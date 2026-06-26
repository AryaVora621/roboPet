import time

class Faces:
    def __init__(self, oled):
        self.oled = oled
        self.w = 128
        self.h = 64
        self.current_face = 'neutral'
        
    def clear(self):
        self.oled.fill(0)
        
    def draw_eye(self, x, y, w, h):
        self.oled.fill_rect(x, y, w, h, 1)
        
    def neutral(self):
        self.clear()
        self.draw_eye(30, 20, 24, 24)
        self.draw_eye(74, 20, 24, 24)
        self.oled.show()
        
    def happy(self):
        self.clear()
        # Happy eyes look like ^ ^ 
        self.draw_eye(30, 20, 24, 24)
        self.draw_eye(74, 20, 24, 24)
        # Cut out the bottom middle to make arches
        self.oled.fill_rect(34, 28, 16, 16, 0)
        self.oled.fill_rect(78, 28, 16, 16, 0)
        self.oled.show()
        
    def sad(self):
        self.clear()
        self.draw_eye(30, 24, 24, 20)
        self.draw_eye(74, 24, 24, 20)
        self.oled.fill_rect(34, 20, 16, 16, 0)
        self.oled.fill_rect(78, 20, 16, 16, 0)
        self.oled.show()

    def angry(self):
        self.clear()
        self.draw_eye(30, 20, 24, 24)
        self.draw_eye(74, 20, 24, 24)
        # Cut diagonal for angry eyebrows
        for i in range(12):
            self.oled.hline(30, 20 + i, 24 - i * 2, 0)
            self.oled.hline(74 + i * 2, 20 + i, 24 - i * 2, 0)
        self.oled.show()
        
    def sleepy(self):
        self.clear()
        self.draw_eye(30, 34, 24, 6)
        self.draw_eye(74, 34, 24, 6)
        self.oled.show()
        
    def look_left(self):
        self.clear()
        self.draw_eye(20, 20, 24, 24)
        self.draw_eye(64, 20, 24, 24)
        self.oled.show()
        
    def look_right(self):
        self.clear()
        self.draw_eye(40, 20, 24, 24)
        self.draw_eye(84, 20, 24, 24)
        self.oled.show()

    def set_face(self, face_type):
        self.current_face = face_type
        if face_type == 'happy':
            self.happy()
        elif face_type == 'sad':
            self.sad()
        elif face_type == 'angry':
            self.angry()
        elif face_type == 'sleepy':
            self.sleepy()
        elif face_type == 'look_left':
            self.look_left()
        elif face_type == 'look_right':
            self.look_right()
        else:
            self.neutral()
