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
