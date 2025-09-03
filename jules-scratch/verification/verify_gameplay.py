import os
from playwright.sync_api import sync_playwright, Page, expect

def verify_gameplay(page: Page):
    """
    This script verifies the core gameplay loop.
    It navigates to the challenge page, enters the correct code,
    runs it, and verifies the success state.
    """
    # 1. Arrange: Go to the challenge page and set up logging.
    logs = []
    page.on("console", lambda msg: logs.append(msg.text))
    page.goto('http://localhost:8000/challenge.html')

    # 2. Assert: Check if the main elements are visible.
    expect(page.get_by_role("heading", name="Move Forward")).to_be_visible()
    canvas = page.locator("#turtle-canvas")
    expect(canvas).to_be_visible()

    # 3. Act: Type the correct code into the editor.
    code_editor = page.locator("#code-editor")
    correct_code = "forward(100)"
    code_editor.fill(correct_code)

    # 4. Act: Click the "Run Code" button and handle the success alert.
    # Set up a handler for the dialog (alert) BEFORE the action that triggers it.
    page.once("dialog", lambda dialog: dialog.accept())

    run_button = page.locator("#run-code-btn")
    run_button.click()

    # 5. Screenshot: Capture the final result for visual verification.
    # The turtle should have moved and a line should be drawn.
    page.wait_for_timeout(500) # Wait for canvas to render
    page.screenshot(path="jules-scratch/verification/gameplay_verification.png")

    print("\n--- Console Logs ---")
    for log in logs:
        print(log)
    print("--------------------")

# Boilerplate to run the verification
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_gameplay(page)
        browser.close()
