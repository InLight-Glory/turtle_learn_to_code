import os
from playwright.sync_api import sync_playwright, Page, expect

def verify_challenge_loading(page: Page):
    """
    This script verifies that the challenge page can dynamically load a
    challenge based on a URL parameter.
    """
    logs = []
    try:
        # 1. Arrange: Go to the challenge page with a specific challenge ID.
        page.on("console", lambda msg: logs.append(msg.text))
        page.goto('http://localhost:8000/challenge.html?id=K_S1C2')

        # 2. Assert: Check that the correct challenge title is displayed.
        expect(page.get_by_role("heading", name="A Simple Turn")).to_be_visible(timeout=5000)

        # 3. Screenshot: Capture the final result for visual verification.
        page.screenshot(path="jules-scratch/verification/challenge_loading_verification.png")

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
        verify_challenge_loading(page)
        browser.close()
