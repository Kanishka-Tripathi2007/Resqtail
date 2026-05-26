import os

brain_dir = r"C:\Users\DELL\.gemini\antigravity-ide\brain"
print(f"Searching all brain directories for code files...")

if not os.path.exists(brain_dir):
    print("Directory does not exist!")
else:
    for root, dirs, files in os.walk(brain_dir):
        # Let's skip the current folder's scratch/extracted_vscode to avoid duplicate logs
        if "238296c1-2cab-4154-ac7a-e3ba557d80b8\\scratch\\extracted_vscode" in root:
            continue
        for file in files:
            file_path = os.path.join(root, file)
            # Find any html, css, js files
            if file.endswith(".html") or file.endswith(".css") or file.endswith(".js"):
                size = os.path.getsize(file_path)
                print(f"Found code file: {file_path} (size={size})")
                
print("Search done.")
