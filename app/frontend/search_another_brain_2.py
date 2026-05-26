import os

target_brain_dir = r"C:\Users\DELL\.gemini\antigravity-ide\brain\4a0f0434-6a2f-410b-a468-c5392024cb51"
print(f"Scanning files in {target_brain_dir} for keywords...")

if not os.path.exists(target_brain_dir):
    print("Directory does not exist!")
else:
    for root, dirs, files in os.walk(target_brain_dir):
        for file in files:
            file_path = os.path.join(root, file)
            # check size to avoid reading massive binary files
            try:
                size = os.path.getsize(file_path)
            except Exception:
                continue
            if size > 2000000:
                continue
            if file.endswith(".md") or file.endswith(".json") or file.endswith(".jsonl") or file.endswith(".txt") or file.endswith(".html") or file.endswith(".css") or file.endswith(".js"):
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        matches = []
                        for key in ["weather-banner", "SOS Emergency", "ResQBot", "let PLACES"]:
                            if key in content:
                                matches.append(key)
                        if matches:
                            print(f"Match: {file_path} (size={size}) contains keys: {matches}")
                except Exception as e:
                    pass
                    
print("Scan done.")
