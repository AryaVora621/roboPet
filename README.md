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

### Phase 1 — ~4 weeks (microcontroller walker)
Each stage ends at a **demo gate**: a concrete, video-able result that isolates one set of unknowns and builds the portfolio.

**Stage 0 — Bench bring-up (no filament needed)**
- [ ] Source consumables + Lamington Road run
- [ ] Set servo rail to ~7.2 V and logic rail to 5.0 V (no load, multimeter-verified)
- [ ] Breadboard logic; bring up each component individually (LED, OLED, WS2812, single servo, IMU pitch/roll to Serial)
- [ ] Stand up documentation + posting workflow
- [ ] **Gate:** every component proven on the bench

**Stage 1 — Body + wiring**
- [ ] Print PLA chassis, 4 legs / 8 joints, mounts, brackets
- [ ] Assemble two-rail power on-chassis (fuse → switch → bucks → bulk caps, common ground, battery-monitor divider)
- [ ] Move electronics to perfboard; wire 8 servos + IMU + OLED + LED
- [ ] **Gate:** assembled robot powers up; all 8 servos sweep without browning out the ESP32

**Stage 2 — It stands**
- [ ] Calibrate joint neutrals (`trim[]` offsets)
- [ ] Implement complementary filter → stable pitch/roll
- [ ] Write 2-link inverse kinematics; verify one leg reaches an (x,y) target; roll out to all four
- [ ] **Gate:** robot unfolds and holds a stable, level stance

**Stage 3 — It walks**
- [ ] Gait engine: phase clock + foot trajectories (static-stable creep gait)
- [ ] Forward walking, then turning
- [ ] **Gate:** walks forward and turns reliably on flat ground

**Stage 4 — It's alive (finish Phase 1)**
- [ ] Close the balance loop: proportional → PID body leveling from the IMU
- [ ] OLED face expressions + LED moods
- [ ] Gain tuning, cable management, low-battery cutoff
- [ ] Stretch: Bluetooth remote drive
- [ ] **Gate:** walking, self-leveling, expressive robot — Phase 1 complete

> Slack: if a week slips, Stage 4 is the compressible part (a simpler leveling routine still counts as done). Protect Stages 2–3 — they carry the core learning.

### Phase 2 — back in the US (extend the platform)
- [ ] Design 12-servo (3 DOF/leg) version in CAD
- [ ] Build accurate MJCF/URDF model
- [ ] RL in simulation (MuJoCo Playground / MJX on a Tesla P40): disturbance rejection + terrain
- [ ] System-identify real servos; domain randomization; sim-to-real transfer
- [ ] Add Raspberry Pi 5 high-level layer (UART to the MCU)
- [ ] Computer vision (object localization)
- [ ] LLM-as-planner over a skill library → natural-language commands ("push the ball")

---

## Documentation & progress

The durable artifact is **this repo** — recruiters and collaborators read the README, the wiring, the build steps, and the rationale. Social posts (TikTok/Instagram) are top-of-funnel that point back here; crosslink them.

Lightweight daily capture, sustainable for a month:
- End each session with a 20–30 s clip of the day's result
- One sentence on what was done + one thing learned or broken
- A git commit
- Alternate "progress" days with "explainer" days (a hard debugging day → a short "what sensor fusion actually does" clip)

The same raw material feeds the social post, the README, and the eventual writeup.

---

## Status
Phase 1 · Stage 0 — bench bring-up (pre-build, awaiting filament)

## License
Open-source (hardware + firmware + software). License TBD.
