import network
import socket
import machine
import neopixel
import ssd1306
import gc
import faces
import time

# --- PINS (Adjust these if your wiring is different!) ---
I2C_SDA_PIN = 21
I2C_SCL_PIN = 22
LED_PIN = 4
# --------------------------------------------------------

# Initialize WS2811
np = None
try:
    np = neopixel.NeoPixel(machine.Pin(LED_PIN), 1)
    np[0] = (0, 0, 0)
    np.write()
    print("WS2811 initialized on pin", LED_PIN)
except Exception as e:
    print("Failed to init WS2811:", e)

# Initialize OLED
oled = None
try:
    i2c = machine.I2C(0, scl=machine.Pin(I2C_SCL_PIN), sda=machine.Pin(I2C_SDA_PIN), freq=400000)
    oled = ssd1306.SSD1306_I2C(128, 64, i2c)
    oled.fill(0)
    oled.text("roboPet OS", 0, 0)
    oled.text("Wi-Fi Starting...", 0, 16)
    oled.show()
    print("OLED initialized.")
except Exception as e:
    print("Failed to init OLED:", e)

face_engine = None
if oled:
    try:
        face_engine = faces.Faces(oled)
    except Exception as e:
        print("Failed to init Faces:", e)

# --- NETWORK SETUP ---
ssid = None
password = None

try:
    with open('wifi.txt', 'r') as f:
        lines = f.read().split('\n')
        for line in lines:
            if '=' in line:
                k, v = line.split('=', 1)
                if k.strip().upper() == 'SSID':
                    ssid = v.strip()
                elif k.strip().upper() == 'PASSWORD':
                    password = v.strip()
except Exception as e:
    print("No wifi.txt found or invalid format.", e)

ip_address = ""
mode = ""

sta = network.WLAN(network.STA_IF)
ap = network.WLAN(network.AP_IF)

if ssid and password and ssid != "YourHomeNetworkName":
    # Connect to Home Network
    print("Connecting to home network:", ssid)
    ap.active(False)
    sta.active(True)
    sta.connect(ssid, password)
    
    timeout = 300 # 30 seconds
    while not sta.isconnected() and timeout > 0:
        time.sleep(0.1)
        timeout -= 1
        
    if sta.isconnected():
        ip_address = sta.ifconfig()[0]
        mode = "STA"
        print("Connected! IP:", ip_address)
    else:
        print("Failed to connect. Falling back to AP mode.")

if not ip_address:
    # Fallback to Access Point Mode
    sta.active(False)
    ap.active(True)
    try:
        ap.config(ssid="roboPet-Test", password="robopet_admin")
    except:
        ap.config(essid="roboPet-Test", password="robopet_admin")
        
    while not ap.active():
        time.sleep(0.1)
    
    ip_address = ap.ifconfig()[0]
    mode = "AP"
    print("Access Point created! IP:", ip_address)

if oled:
    oled.fill(0)
    oled.text("roboPet OS", 0, 0)
    oled.text("IP:", 0, 12)
    oled.text(ip_address, 0, 24)
    if mode == "STA":
        oled.text("Net: " + ssid[:11], 0, 36)
    else:
        oled.text("AP: roboPet-Test", 0, 36)
    oled.show()

try:
    import webrepl
    webrepl.start()
    print("WebREPL started.")
except Exception as e:
    print("WebREPL start failed:", e)

# --- WEB SERVER ---
html_content = ""
try:
    with open("index.html", "r") as f:
        html_content = f.read()
except Exception as e:
    html_content = "<html><body><h1>Error: index.html missing</h1></body></html>"

def unquote(string):
    res = string.split('%')
    for i in range(1, len(res)):
        item = res[i]
        try:
            res[i] = chr(int(item[:2], 16)) + item[2:]
        except ValueError:
            res[i] = '%' + item
    return "".join(res)

def update_oled(text):
    if oled:
        oled.fill(0)
        oled.text("New Message:", 0, 0)
        oled.text(text[:16], 0, 16)
        oled.text(text[16:32], 0, 26)
        oled.text(text[32:48], 0, 36)
        oled.show()

def update_led(r, g, b):
    if np:
        np[0] = (r, g, b)
        np.write()

addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(addr)
s.listen(1)
s.settimeout(0.5)

print("Web server listening on port 80")

while True:
    try:
        cl, addr = s.accept()
        cl.settimeout(2.0)
        request = cl.recv(1024).decode('utf-8')
        request_line = request.split('\r\n')[0]
        
        if '/api/face?type=' in request_line:
            try:
                start = request_line.find('type=') + 5
                end = request_line.find(' ', start)
                face_type = request_line[start:end]
                if face_engine:
                    face_engine.set_face(face_type)
                cl.send('HTTP/1.1 200 OK\r\n\r\n')
            except Exception as e:
                cl.send('HTTP/1.1 500 ERROR\r\n\r\n')
                
        elif '/api/text?msg=' in request_line:
            try:
                start = request_line.find('msg=') + 4
                end = request_line.find(' ', start)
                msg_raw = request_line[start:end]
                msg = unquote(msg_raw.replace('+', ' '))
                update_oled(msg)
                cl.send('HTTP/1.1 200 OK\r\n\r\n')
            except Exception as e:
                cl.send('HTTP/1.1 500 ERROR\r\n\r\n')
                
        elif '/api/color?' in request_line:
            try:
                r_start = request_line.find('r=') + 2
                r_end = request_line.find('&', r_start)
                g_start = request_line.find('g=') + 2
                g_end = request_line.find('&', g_start)
                b_start = request_line.find('b=') + 2
                b_end = request_line.find(' ', b_start)
                
                r = int(request_line[r_start:r_end])
                g = int(request_line[g_start:g_end])
                b = int(request_line[b_start:b_end])
                update_led(r, g, b)
                cl.send('HTTP/1.1 200 OK\r\n\r\n')
            except Exception as e:
                cl.send('HTTP/1.1 500 ERROR\r\n\r\n')
        else:
            cl.send('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection: close\r\n\r\n')
            cl.sendall(html_content)
            
        cl.close()
        gc.collect()
    except Exception as e:
        pass
