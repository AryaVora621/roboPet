# roboPet AI Customization Rules

These are the global rules for the roboPet project. Please adhere to them at all times.

- **Authorship**: Ensure all commits and file edits are attributed to "Arya Vora".
- **Logging**: Log all AI actions, edits, and file modifications in a daily log markdown file inside the `ai/logs/` directory. Create a new log file per day in `YYYY-MM-DD.md` format.
- **Agent Tools**: Store any custom utility scripts or agent tools (like `read_serial.py`, `reset.py`, etc.) in the `ai/tools/` directory to keep the root directory clean.
- **Devlogs**: Keep project development logs organized in the `devlogs/` directory.
- **Privacy**: Do NOT push private credentials (like `wifi.txt` or `webrepl_cfg.py`) to the git repository. However, AI logs, rules, and devlogs *should* be committed and pushed to git to maintain a record of our work.
- **Environment**: The default framework for ESP32 firmware development in this project is **MicroPython**.
