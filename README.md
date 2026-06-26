# roboPet

> An open-source, AI-ready robotic companion — built from scratch to learn mechatronics end to end: mechanical design, electronics, control systems, and embedded + AI software.

roboPet is a small four-legged robot designed to feel approachable and expressive rather than industrial. Phase 1 is a self-contained 8-servo walker running entirely on a microcontroller. Later phases grow the same platform into a 12-servo robot with learned locomotion, computer vision, and natural-language control.

---

## Goals

### Phase 1 — 8-servo walker (current)
A standalone, microcontroller-only robot that:
- walks and turns on flat ground (static-stable gait)
- self-levels using IMU feedback (auto-balancing)
- shows expressions on an OLED "face" + status via an RGB LED
- needs **no** Raspberry Pi, no AI, no cloud — fully deterministic firmware

### Long-term vision
- **12-servo version** (3 DOF/leg) for realistic, natural locomotion and real body-pose control
- **Learned locomotion** — reinforcement learning in simulation for disturbance rejection ("respond to sudden movements") and terrain traversal, with sim-to-real transfer
- **High-level brain** — a Raspberry Pi 5 layer for computer vision and an LLM-as-planner that turns natural-language commands ("push the ball in front of you") into robot actions via a skill library

The architecture is intentionally two-layered so the platform scales from a simple walker to an AI companion without redesigning the core.

---

## Learning goals
This project is a deliberate mechatronics learning vehicle. Mechanical design is the builder's strength; the focus areas to grow are:
- **Electrical design** — power distribution, grounding, signal vs. power conductors
- **Control systems** — sensor fusion, inverse kinematics, PID, gait generation
- **Programming** — real-time embedded firmware, later computer vision + AI orchestration

Every decision is documented with its *why*, so the repo teaches the reasoning, not just the result.

---

## Hardware (Phase 1)

| Part | Role |
|------|------|
| ESP32 dev board | Main controller (real-time loop, all I/O) |
| 8× HV metal-gear micro servos (~7.2 V) | 4 legs × 2 joints (hip + knee) |
| MPU6050 | IMU (accel + gyro) over I²C — balance input |
| Mini OLED (SSD1306, I²C) | The "face" — animated expressions |
| 1× WS2812 addressable LED | Status / mood indicator |
| 3S LiPo pack | Power source (9–12.6 V) |
| 2× XL4016 buck converters | Two-rail power: servo rail + logic rail |
| Bulk caps (1000–2200 µF), fuse, switch | Power conditioning + protection |
| PLA chassis & legs (printed on A1 Mini) | Structure; TPU feet added later for grip |

> Note: verify the servos' real torque and stall current by measurement — don't trust optimistic listing specs. Stall current sizes the servo rail.

---

## Architecture

### Electrical — two power rails
A 3S pack feeds two independent buck converters:
- **Servo rail** (XL4016 #1) set to **~7.0–7.2 V**, with bulk capacitors placed *at the servo power bus*
- **Logic rail** (XL4016 #2) set to **5.0 V**, feeding the ESP32

**Why two rails:** servo current spikes during a gait would otherwise brown out the ESP32 and cause phantom "firmware" bugs. Splitting them is the single most important power decision.

**Key principle — power voltage ≠ signal voltage.** A servo's power (7.2 V) and its PWM control signal (3.3 V logic from the ESP32) are separate. The 7.2 V must never reach an ESP32 pin; the rails meet only at common ground. A 3.3→5 V level shifter is on hand in case a servo's signal input is marginal.

Also: shared common ground everywhere; inline fuse + switch on the pack; a voltage-divider into an ESP32 ADC pin for low-battery monitoring/cutoff.

### Firmware — one fixed-rate control loop
A deterministic ~100 Hz "heartbeat." Each tick:
1. **Sense** — read the MPU6050
2. **Think** — sensor fusion → gait → inverse kinematics → balance correction
3. **Act** — write all 8 servo angles

Cosmetic output (OLED face, LED) runs on a slower, separate timer so it can never steal cycles from motion. No blocking `delay()` calls — blocking breaks balance.

Concepts in play: fixed-timestep loops, complementary-filter sensor fusion, 2-link inverse kinematics, proportional/PID control, state machines.

---

## Roadmap

This roadmap is a detailed field manual for Phase 1. 

### DAYS 1–4 — BENCH BRING-UP (no filament, electronics only)
The goal is to prove every single component works before it goes inside a chassis. A bug on the breadboard takes five minutes to fix; after assembly, it takes three hours.

**Day 1 — Power system only**
- [ ] Set up bench: 3S pack, fuse holder, power switch, both XL4016s, multimeter
- [ ] Bring up XL4016 #1 with no load, trim to exactly 7.2 V
- [ ] Bring up XL4016 #2 to exactly 5.0 V
- [ ] Wire both bucks in parallel from the pack and confirm both rails hold voltages
- [x] Add 1000 µF cap on each output rail and measure again (check for voltage pull-down)

**Day 2 — ESP32 and digital peripherals**
- [ ] Power ESP32 from 5 V logic rail via VIN pin, confirm it boots
- [ ] Blink an LED on a GPIO pin
- [ ] Bring up OLED over I2C (print 'roboPet')
- [ ] Bring up WS2812 (cycle through colors)
- [ ] Check logic rail current draw with OLED/WS2812 running (< 500 mA)

**Day 3 — Servos and IMU**
- [ ] Plug one servo into 7.2 V rail (not breadboard), signal to ESP32. Sweep 0 to 180°
- [ ] Tune attach() pulse range (500-2500 µs defaults might be wrong). Listen for grinding
- [ ] Wire all 8 servos. Sweep simultaneously and watch 7.2 V rail sag (add bulk caps if below 6.8 V)
- [ ] Wire MPU6050 (I2C 0x68). Print raw accel/gyro to Serial at 100 Hz. Verify gravity on Z axis

**Day 4 — System integration and Lamington Road**
- [ ] Wire everything together on breadboard (rails, ESP32, 8 servos, IMU, OLED, LED)
- [ ] System test: startup sequence -> stream pitch/roll to OLED while servos hold neutral
- [ ] Lamington Road run: buy consumables, look for PCA9685 breakout and cheap 8-channel logic analyzer

### WEEK 1 — PRINTING, WIRING, AND CHASSIS ASSEMBLY
Print PLA structural parts, migrate electronics to perfboard, assemble two-rail power.

**Mechanical & Electrical Assembly**
- [ ] Print body, legs, brackets (40-50% infill for torque parts, 3+ walls)
- [ ] Add temporary adhesive rubber bumpers to feet
- [ ] Migrate logic electronics from breadboard to perfboard
- [ ] Mount 7.2V terminal block with bulk caps for servo power bus (separate from perfboard)
- [ ] Tie all grounds (7.2V, 5.0V, ESP32, IMU, servos) to a single common ground

### WEEK 2 — CALIBRATION, SENSOR FUSION, IK (It Stands)
High-density learning week: servo calibration, complementary filter, and 2-link inverse kinematics.

**Calibration & Stance**
- [ ] Command servos to 90°, measure physical offset, and store in trim[] array
- [ ] Write standPose() function (straight legs, level body)
- [ ] Test standPose() and check for lean due to remaining offsets

**Sensor Fusion & IK**
- [ ] Implement complementary filter (pitch = 0.98*(pitch+gyro*dt) + 0.02*accel)
- [ ] Tape robot to a book, tilt it, tune alpha coefficients via Arduino Serial Plotter
- [ ] Implement 2-link IK (math for knee and hip angles from x,y targets)
- [ ] Command leg 0 to specific x,y and verify angles. Repeat for all 4 legs

### WEEK 3 — GAIT GENERATION (It Walks)
Implement a static-stable creep gait (one leg swings, three form a base). Iterative tuning.

**Gait Implementation**
- [ ] Implement phase clock (0 to 1) with phase offset/duty cycle for each leg
- [ ] Pass x,y targets from gait to IK layer for forward walking
- [ ] Tune step height, length, and frequency until forward walk is stable
- [ ] Implement turning (scale step length differently for left vs right legs)

### WEEK 4 — BALANCE, PERSONALITY, AND FINISHING (It's Alive)
Close the balance loop, add OLED affective states, and finalize Phase 1.

**Balance & Personality**
- [ ] Add P correction to foot Y/height targets (correction = Kp * pitchError)
- [ ] Add D term to damp oscillation (PD controller)
- [ ] Create OLED face state machine (idle, walking, alert, happy, low battery)
- [ ] Implement WS2812 LED moods (green=healthy, amber=low battery, blue pulse=idle)
- [ ] Integrate low-battery cutoff (finish stride, fold down, tired face, sleep)

---

## Status
Phase 1 · Project infrastructure complete (Interactive Roadmap Deployed). Starting Day 1 (Power system).

## License
Open-source (hardware + firmware + software). License TBD.
