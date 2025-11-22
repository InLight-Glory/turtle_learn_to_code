from playwright.sync_api import sync_playwright

def verify_pen_commands():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # We need to load a challenge page. We can use K_S1C1 as a base.
        print("Navigating to challenge page...")
        page.goto('http://localhost:8000/challenge.html?id=K_S1C1')

        # Inject code that uses the new commands
        code = """
forward(50)
penUp()
forward(50)
penDown()
penColor('red')
forward(50)
"""
        # Set the code in the editor
        print("Setting code in editor...")
        page.locator('#code-editor').fill(code)

        # Click Run Code
        print("Running code...")
        page.click('#run-code-btn')

        # Verify the state
        print("Verifying state...")
        lines = page.evaluate("state.lines")

        # We expect 2 lines.
        # Line 1: Black (default), length 50.
        # Gap of 50 (penUp).
        # Line 2: Red, length 50.

        if len(lines) != 2:
            print(f"FAILURE: Expected 2 lines, got {len(lines)}")
        else:
            line1 = lines[0]
            line2 = lines[1]

            print(f"Line 1 color: {line1.get('color')}")
            print(f"Line 2 color: {line2.get('color')}")

            # Check colors
            # Note: state.turtle.color defaults to 'black', so the first line should have that if forward() was called when color was black.
            # Wait, I need to check if forward() implementation adds the color.
            # Yes, `color: state.turtle.color` is pushed.

            success = True
            if line1.get('color') != 'black':
                print("FAILURE: Line 1 should be black.")
                success = False
            if line2.get('color') != 'red':
                print("FAILURE: Line 2 should be red.")
                success = False

            # Check continuity/gap
            # Line 1: (50, 200) -> (100, 200) (Start is 50,200, angle 0)
            # Gap: (100, 200) -> (150, 200)
            # Line 2: (150, 200) -> (200, 200)

            if line1['to']['x'] != 100:
                 print(f"FAILURE: Line 1 end x should be 100, got {line1['to']['x']}")
                 success = False

            if line2['from']['x'] != 150:
                 print(f"FAILURE: Line 2 start x should be 150, got {line2['from']['x']}")
                 success = False

            if success:
                print("SUCCESS: Pen commands are working correctly.")

        # Take screenshot
        page.screenshot(path='verification/pen_commands.png')
        print("Screenshot saved to verification/pen_commands.png")

        browser.close()

if __name__ == "__main__":
    verify_pen_commands()
