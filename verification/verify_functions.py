from playwright.sync_api import sync_playwright

def verify_functions():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to challenge page...")
        page.goto('http://localhost:8000/challenge.html?id=G3_C1') # Function for a Square (from data.js)

        # Test Code: Define and call a function
        code = """
function drawSide() {
    forward(100)
    turn(90)
}
repeat 4 {
    drawSide()
}
"""
        print("Setting code...")
        page.locator('#code-editor').fill(code)

        print("Running code...")
        page.click('#run-code-btn')

        # Check line count
        lines = page.evaluate("state.lines")
        print(f"Lines generated: {len(lines)}")

        # 4 sides -> 4 lines
        if len(lines) == 4:
            print("SUCCESS: Function loop executed successfully (4 lines generated).")

            # Verify first line
            l1 = lines[0]
            # Start position for G3_C1 is 150, 250
            # Forward 100 (Angle 0) -> 250, 250
            if l1['to']['x'] == 250 and l1['to']['y'] == 250:
                 print("SUCCESS: Coordinates are correct.")
            else:
                 print(f"FAILURE: Coordinates incorrect. End: ({l1['to']['x']}, {l1['to']['y']})")
        else:
            print(f"FAILURE: Expected 4 lines, got {len(lines)}")

        browser.close()

if __name__ == "__main__":
    verify_functions()
