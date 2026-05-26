import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

extracted_dir = r"C:\Users\DELL\.gemini\antigravity-ide\brain\238296c1-2cab-4154-ac7a-e3ba557d80b8\scratch\extracted_vscode"

html_file = os.path.join(extracted_dir, "c%3A_Users_DELL_OneDrive_Desktop_Resqtail_app_frontend_index.html_1777050515339_Eruo.html")
css_file = os.path.join(extracted_dir, "c%3A_Users_DELL_OneDrive_Desktop_Resqtail_app_frontend_styles.css_1777048973297_BHtN.css")
js_file = os.path.join(extracted_dir, "c%3A_Users_DELL_OneDrive_Desktop_Resqtail_app_frontend_app.js_1777073358786_iSR9.js")

print("Checking index.html...")
if os.path.exists(html_file):
    with open(html_file, "r", encoding="utf-8") as f:
        html_content = f.read()
    print("  Size:", len(html_content))
    print("  Contains 'nearby.js' script tag:", "nearby.js" in html_content)
    print("  Contains 'donationMessage':", "donationMessage" in html_content)
    print("  Contains quick amount buttons (e.g. Rupee100 or setDonationAmount):", "setDonationAmount" in html_content or "100" in html_content)
    print("  Contains reporterName:", "reporterName" in html_content)
    print("  Contains reporterEmail:", "reporterEmail" in html_content)
    print("  Contains latitude / longitude in report form:", "latitude" in html_content and "longitude" in html_content)
    print("  Contains adoption filters:", "adoption-filters" in html_content or "species" in html_content)
else:
    print("  HTML file not found!")

print("\nChecking styles.css...")
if os.path.exists(css_file):
    with open(css_file, "r", encoding="utf-8") as f:
        css_content = f.read()
    print("  Size:", len(css_content))
    print("  Contains toast styling:", "toast" in css_content)
    print("  Contains skeleton-loader:", "skeleton" in css_content)
    print("  Contains weather-banner styling:", "weather-banner" in css_content)
else:
    print("  CSS file not found!")

print("\nChecking app.js...")
if os.path.exists(js_file):
    with open(js_file, "r", encoding="utf-8") as f:
        js_content = f.read()
    print("  Size:", len(js_content))
    print("  Contains setDonationAmount:", "setDonationAmount" in js_content)
    print("  Contains submitInquiry:", "submitInquiry" in js_content)
    print("  Contains filterListings:", "filterListings" in js_content)
    print("  Contains updateReportStatus:", "updateReportStatus" in js_content)
    print("  Contains triggerSOS:", "triggerSOS" in js_content)
else:
    print("  JS file not found!")
