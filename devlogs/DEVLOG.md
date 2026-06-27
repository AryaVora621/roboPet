# roboPet Developer Log

This log tracks daily progress, challenges, and insights over the course of the project build.

---

### Day 0 — Project Infrastructure & Roadmap
**Date:** June 26, 2026

**What I worked on:**
Set up the core project infrastructure before touching hardware. Initialized the GitHub repository and built a custom, interactive roadmap visualizer web app hosted on Vercel. This visualizer acts as a living "field manual" that tracks my progress and securely pushes updates directly back to the checkboxes in the main `README.md` via the GitHub API.

**What I learned:**
Using Vercel Serverless Functions to securely interact with the GitHub API allows for a dynamic frontend without exposing PATs or relying on heavy databases. This treats documentation as code and provides a live progress bar for recruiters and collaborators viewing the repository.

**What's next:**
Tomorrow is Day 1 of actual hardware bring-up. The focus is entirely on the power system: setting up the 3S pack, fuse, switch, and both XL4016 buck converters (tuning them to exactly 7.2V and 5.0V). No ESP32 yet—just verifying the clean power delivery that the rest of the robot depends on.

---

### Day 1 — Power System & Initial ESP32 Testing
**Date:** June 26, 2026

**What I worked on:**
I successfully set up the 3S pack and tuned both XL4016 buck converters. I flashed the ESP32 with MicroPython and developed a sleek local web server dashboard (HTML/CSS/JS) to test the I2C GEM12864-50 OLED and the WS2811 RGB LED over Wi-Fi. I added a geometric "Emotive Faces" system to the OLED display (inspired by `sesame-robot`) controllable from the dashboard, and set up WebREPL for completely wireless over-the-air code updates. Additionally, I polished the repository infrastructure by integrating a secure "Scripts Viewer" tab into the Vercel roadmap site, customized GitHub issue templates for hardware debugging, and added setup documentation.

**What I learned:**
- Serving a modern, glassmorphic UI directly from the ESP32 using MicroPython is lightweight and extremely effective. By splitting the logic between a responsive frontend and an API backend on the ESP32, debugging hardware becomes seamless.
- **Embedded Trap:** A blocking `socket.accept()` in the main loop will starve background MicroPython processes like WebREPL. Adding a timeout (`s.settimeout(0.5)`) lets the processor "breathe" and allows wireless uploads to work alongside the web server.

**What's next:**
With the power delivery, microcontroller, and over-the-air workflow verified, the next step is connecting and testing the servo motors to begin building the robotic chassis.

---

### Day 2 — Servo Rail & First Servo Test
**Date:** June 27, 2026

**What I worked on:**
Soldered in the XL4016 buck converter for the dedicated servo rail (targeting ~7.2V). Updated the ESP32 firmware with new WiFi credentials and resolved a serial upload blocker -- `mpremote` could not interrupt the running web server loop because the bare `except Exception: pass` catch was swallowing `KeyboardInterrupt`. Switched to `ampy` as the upload tool and successfully pushed all firmware files. ESP32 reconnected at `192.168.31.59` on the new network.

Added servo control directly into the web dashboard: two 996R 360-degree continuous rotation servos wired on GPIO 13 and 14, with speed control buttons (◀◀ full reverse through STOP to ▶▶ full forward) in the glassmorphic UI. Verified both servos respond correctly over USB power -- full motion range confirmed. Also fixed WebREPL by passing the password explicitly in `webrepl.start()`, enabling wireless code pushes from here on.

**What I learned:**
- **Embedded Trap:** A bare `except Exception` in a MicroPython event loop catches `KeyboardInterrupt`, which completely blocks serial tools like `mpremote` from interrupting the program. The fix is to catch only `OSError` (the expected socket timeout exception) and let everything else propagate.
- 360-degree continuous rotation servos (996R) use PWM pulse width to control speed and direction, not angle. The neutral/stop point is ~1500µs. This is fundamentally different from positional servos and the firmware mapping has to reflect it -- 500-2500µs (positional range) becomes 1000-2000µs (speed range) with 1500µs as center.
- WebREPL on MicroPython v1.28 requires the password to be passed explicitly to `webrepl.start(password='...')` -- relying on `webrepl_cfg.py` alone silently fails on some builds.

**What's next:**
Day 3: Power both rails from the 3S LiPo battery pack and test the servos at full 7.2V servo rail voltage. Measure real stall current per servo to validate the fuse and bulk capacitor sizing. If all 8 servos are ready, wire them all up and verify the ESP32 can drive them simultaneously without brownout.
