import os

conv_dir = r"C:\Users\DELL\.gemini\antigravity-ide\conversations"
print("Checking .pb headers...")

for file in os.listdir(conv_dir):
    if file.endswith(".pb"):
        path = os.path.join(conv_dir, file)
        try:
            with open(path, "rb") as f:
                header = f.read(16)
            print(f"File: {file} | Header Hex: {header.hex()} | Header Ascii/Bytes: {header}")
        except Exception as e:
            print(f"Error {file}: {e}")
            
print("Done checking.")
