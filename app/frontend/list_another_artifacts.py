import os

artifacts_dir = r"C:\Users\DELL\.gemini\antigravity-ide\brain\4a0f0434-6a2f-410b-a468-c5392024cb51\.artifacts"
print(f"Listing files in {artifacts_dir}...")

if not os.path.exists(artifacts_dir):
    print("Directory does not exist!")
else:
    for root, dirs, files in os.walk(artifacts_dir):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                size = os.path.getsize(file_path)
                print(f"File: {file_path} (size={size})")
            except Exception as e:
                print(f"Error for {file_path}: {e}")
                
print("Listing done.")
