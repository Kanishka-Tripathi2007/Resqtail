import os

search_dir = r"C:\Users\DELL\.gemini"
target = "weather-banner"
print(f"Scanning the entire {search_dir} for '{target}'...")

for root, dirs, files in os.walk(search_dir):
    for file in files:
        file_path = os.path.join(root, file)
        try:
            size = os.path.getsize(file_path)
            if size > 15000000: # skip very large files
                continue
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                if target in content:
                    print(f"Found in: {file_path} (size={size})")
        except Exception:
            pass
            
print("Scan complete.")
