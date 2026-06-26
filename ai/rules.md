# AI Rules for roboPet

1. **Git Commits & Authorship**: All code changes, commits, and actions must appear as made by **Arya Vora**.
2. **AI Action Logging**: All edits, pushes, and significant AI interactions must be logged in a daily log file located in the `ai/logs/` directory (e.g., `ai/logs/YYYY-MM-DD.md`).
3. **Agent Tools**: Store any custom utility scripts or agent tools (like `read_serial.py`, `reset.py`, etc.) in the `ai/tools/` directory to keep the root directory clean.
4. **Devlogs**: Keep project development logs organized in the `devlogs/` directory.
5. **Git Tracking**: The AI logs, rules, and devlogs *should* be tracked in Git. However, private credentials like `wifi.txt` and `webrepl_cfg.py` must NEVER be pushed to Git.
6. **Development Framework**: The project defaults to **MicroPython** for the ESP32 to ensure easier collaboration.
