import os

directories = [
    r"C:\Users\DELL\.gemini\antigravity",
    r"C:\Users\DELL\.gemini\antigravity-backup"
]

print("Searching backup directories for code files...")

for base_dir in directories:
    if not os.path.exists(base_dir):
        print(f"Directory does not exist: {base_dir}")
        continue
    print(f"\nScanning: {base_dir}")
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".html") or file.endswith(".css") or file.endswith(".js"):
                file_path = os.path.join(root, file)
                size = os.path.getsize(file_path)
                print(f"Found code file: {file_path} (size={size})")
                
print("\nDone searching backups.")
