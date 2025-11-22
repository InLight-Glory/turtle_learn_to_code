from playwright.sync_api import sync_playwright

def verify_mobile_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate iPhone SE (375x667)
        context = browser.new_context(viewport={'width': 375, 'height': 667})
        page = context.new_page()

        print("Navigating to challenge page (Mobile View)...")
        page.goto('http://localhost:8000/challenge.html?id=K_S1C1')

        # Wait for layout to settle
        page.wait_for_timeout(1000)

        # Check if main container overflows width
        body_width = page.evaluate("document.body.scrollWidth")
        viewport_width = 375

        print(f"Body Width: {body_width}px (Viewport: {viewport_width}px)")

        if body_width > viewport_width:
            print("FAILURE: Horizontal scrollbar detected (overflow).")
        else:
            print("SUCCESS: No horizontal overflow.")

        # Check if Canvas is visible and sized appropriately
        canvas = page.locator('#turtle-canvas')
        box = canvas.bounding_box()
        if box:
            print(f"Canvas Size: {box['width']}x{box['height']}")
            if box['width'] > 355: # 375 - 20px padding
                print("WARNING: Canvas might be too wide for padding.")

        page.screenshot(path='verification/mobile_layout.png')
        print("Screenshot saved to verification/mobile_layout.png")

        browser.close()

if __name__ == "__main__":
    verify_mobile_layout()
