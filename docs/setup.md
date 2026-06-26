# roboPet Setup Guide

Welcome to the roboPet documentation. This guide covers how to set up the wireless configuration required for the ESP32 brain to connect to your local network and host the Web Dashboard.

## Wi-Fi Configuration (`wifi.txt`)

To ensure your Wi-Fi credentials are kept private and never pushed to GitHub, roboPet uses a local `wifi.txt` file that is ignored by Git.

### Setup Instructions

1. In the root of your project, locate the `wifi.txt.example` file.
2. Create a new file in the same directory named `wifi.txt`.
3. Copy the contents from the example file into your new `wifi.txt`.
4. Update the fields with your actual Wi-Fi network credentials:

```text
SSID=YourRealNetworkName
PASSWORD=YourRealNetworkPassword
```

When the ESP32 boots up, the `boot.py` script will read this file and attempt to connect to the specified network.

## WebREPL Configuration (`webrepl_cfg.py`)

Similarly, for Over-The-Air (OTA) programming via WebREPL, a password is required.

1. Ensure you have run `import webrepl_setup` on the ESP32 via serial at least once.
2. This generates a `webrepl_cfg.py` file on the microcontroller. 
3. This file is also strictly ignored by `.gitignore` to prevent leaking your WebREPL password. Do not manually track or commit this file if you download it to your local machine.

---
*Note: Always double check that you haven't accidentally bypassed `.gitignore` when adding files. Your credentials should remain strictly local.*
