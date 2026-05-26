from datetime import datetime

timestamps = [
    ("styles.css", 1777048973297),
    ("index.html", 1777050515339),
    ("app.js", 1777073358786)
]

for name, ts in timestamps:
    dt = datetime.fromtimestamp(ts / 1000.0)
    print(f"{name}: {dt.isoformat()}")
