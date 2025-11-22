import os
from playwright.sync_api import sync_playwright, Page, expect

def verify_progress_tracking(page: Page):
    """
    This script verifies the entire progress tracking loop.
    """
    logs = []
    try:
        # --- Step 1: Complete a challenge ---
        page.on("console", lambda msg: logs.append(msg.text))
        page.goto('http://localhost:8000/challenge.html?id=K_S1C1')
        page.evaluate("localStorage.clear()")
        page.reload()

        code_editor = page.locator("#code-editor")
        expect(code_editor).to_be_visible(timeout=10000)
        code_editor.fill("forward(100)")

        page.once("dialog", lambda dialog: dialog.accept())
        run_button = page.locator("#run-code-btn")
        run_button.click()
        page.wait_for_timeout(500)

        # --- Step 2: Verify the result on the index page ---
        page.goto('http://localhost:8000/index.html')
        completed_link = page.locator("a.completed", has_text="First Steps")
        expect(completed_link).to_be_visible()

        page.screenshot(path="jules-scratch/verification/progress_tracking_verification.png")

    finally:
        print("\n--- Console Logs ---")
        for log in logs:
            print(log)
        print("--------------------")

# Boilerplate to run the verification
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_progress_tracking(page)
        browser.close()
