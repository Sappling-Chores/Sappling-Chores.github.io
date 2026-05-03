import pygetwindow as gw
import requests
from dotenv import load_dotenv
import json 
import time
import keyboard
import os

import sys
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GIST_ID = os.getenv("GIST_ID")

def update_gist(status_text):
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }
    data = {
        "files": {
            "status.json": {
                "content": json.dumps({"status": status_text})
            }
        }
    }
   
    requests.patch(f"https://api.github.com/gists/{GIST_ID}", headers=headers, json=data)
def monitor_active_window():
    print("Monitoring active windows... (Press Ctrl+Shift+Q to stop silently from anywhere)")
    musicArtist = ["JENNIE", "BIBI", "KATSEYE", "BLACKPINK", "ROSE", "LISA", "ILLIT", "BTS", "Sabrina Carpenter", "Billie Eilish", "Olivia Rodrigo", "Taylor Swift", "xooos" ]
    current_window = None
    try:
        while True:
           
            if keyboard.is_pressed('ctrl+shift+q'):
                update_gist("Offline")
                print("\nMonitoring stopped via hotkey.")
                break

            new_window = gw.getActiveWindowTitle()
            

            if new_window != current_window and new_window:
                current_window = new_window
                

                if "Fusion 360" in current_window:
                    status_text = "Fusion-360"
                    print(f"Updating website to: {status_text}")
                    update_gist(status_text)
                    print(current_window)
                    
                elif "YouTube" in current_window and not any(artist in current_window for artist in musicArtist):
                    status_text = "YouTube"
                    print(f"Updating website to: {status_text}")
                    update_gist(status_text)
                    print(current_window)
                    
                elif "Code" in current_window or "Cursor" in current_window:
                    status_text = "Code"
                    print(f"Updating website to: {status_text}")
                    update_gist(status_text)
                    print(current_window)
                    
                    
                elif "KiCad 9.0" in current_window : 
                    status_text = "KiCad"
                    print(f"updating status to {status_text}")
                    update_gist(status_text)
                    print(current_window)
                    
                elif any(artist in current_window for artist in musicArtist):
                    status_text = "Music"
                    print(f"Updating status to: {status_text}")
                    update_gist(status_text)
                    print(current_window) 
                    
                elif "Physics Wallah" in current_window : 
                    status_text = "Study"
                    print(f"Updating status to: {status_text}")
                    update_gist(status_text)
                    print(current_window)
                     
                elif "Chrome" in current_window and not "YouTube" in current_window: 
                    status_text = "Chrome"
                    print(f"Updating status to {status_text}")
                    update_gist(status_text)
                    print(current_window)
                    
            time.sleep(15) 
            
    except KeyboardInterrupt:

        update_gist("Offline")
        print("\nMonitoring stopped.")
if __name__ == "__main__":
    monitor_active_window()
