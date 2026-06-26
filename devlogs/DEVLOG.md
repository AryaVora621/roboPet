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
Successfully set up the 3S pack and tuned both XL4016 buck converters. Flashed the ESP32 with MicroPython and developed a sleek local web server dashboard (HTML/CSS/JS) to test the I2C GEM12864-50 OLED and the WS2811 RGB LED over Wi-Fi. Added a geometric "Emotive Faces" system to the OLED display (inspired by `sesame-robot`) controllable from the dashboard, and set up WebREPL for completely wireless over-the-air code updates.

**What I learned:**
- Serving a modern, glassmorphic UI directly from the ESP32 using MicroPython is lightweight and extremely effective. By splitting the logic between a responsive frontend and an API backend on the ESP32, debugging hardware becomes seamless.
- **Embedded Trap:** A blocking `socket.accept()` in the main loop will starve background MicroPython processes like WebREPL. Adding a timeout (`s.settimeout(0.5)`) lets the processor "breathe" and allows wireless uploads to work alongside the web server.

**What's next:**
With the power delivery, microcontroller, and over-the-air workflow verified, the next step is connecting and testing the servo motors to begin building the robotic chassis.
