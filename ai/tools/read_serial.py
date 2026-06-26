import serial, time
s = serial.Serial('/dev/cu.usbserial-0001', 115200, timeout=1)
# Reset the ESP32
s.dtr = False
s.rts = True
time.sleep(0.1)
s.dtr = True
s.rts = False
time.sleep(0.1)
t0 = time.time()
while time.time() - t0 < 5:
    if s.in_waiting:
        print(s.read(s.in_waiting).decode('utf-8', 'ignore'), end='')
    time.sleep(0.01)
s.close()
