import os

# ============ SETTINGS ============
# Ye woh folder hai jahan aap ka project rakha hai
PROJECT_FOLDER = "."          # "." ka matlab current folder
OUTPUT_FILE = "project_dump.txt"

# Ye extensions wali files collect karega
ALLOWED_EXT = [".html", ".css", ".js", ".json", ".md", ".txt", ".py", ".php"]

# Ye folders skip karega
SKIP_FOLDERS = ["node_modules", ".git", "__pycache__", "venv", ".venv", "dist", "build"]

# ==================================

def collect_files(folder):
    collected = []
    for root, dirs, files in os.walk(folder):
        # skip unwanted folders
        dirs[:] = [d for d in dirs if d not in SKIP_FOLDERS]

        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ALLOWED_EXT:
                full_path = os.path.join(root, file)
                collected.append(full_path)
    return collected

def write_dump(files, output):
    with open(output, "w", encoding="utf-8") as out:
        out.write("=" * 70 + "\n")
        out.write("PROJECT CODE DUMP\n")
        out.write("=" * 70 + "\n\n")

        for i, path in enumerate(files, 1):
            rel_path = os.path.relpath(path)
            out.write(f"\n{'=' * 70}\n")
            out.write(f"FILE #{i}: {rel_path}\n")
            out.write(f"{'=' * 70}\n\n")

            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                out.write(content)
                out.write("\n")
            except Exception as e:
                out.write(f"[ERROR READING FILE: {e}]\n")

        out.write("\n" + "=" * 70 + "\n")
        out.write(f"TOTAL FILES: {len(files)}\n")
        out.write("=" * 70 + "\n")

    print(f"✅ Done! {len(files)} files collected into: {output}")

if __name__ == "__main__":
    files = collect_files(PROJECT_FOLDER)
    write_dump(files, OUTPUT_FILE)
