import os
from playwright.sync_api import sync_playwright, Page, expect

def verify_index_page(page: Page):
    """
    This script verifies the new challenge selection UI on the index page.
    """
    # 1. Arrange: Go to the index page.
    page.goto('http://localhost:8000/index.html')

    # 2. Assert: Check that the grade buttons and challenge list are populated.
    # The expect call will automatically wait for the element to appear.
    expect(page.get_by_role("link", name="First Steps")).to_be_visible(timeout=5000)

    # 3. Screenshot: Capture the final result for visual verification.
    challenge_selection_section = page.locator("#challenge-selection")
    challenge_selection_section.scroll_into_view_if_needed()
    page.screenshot(path="jules-scratch/verification/index_page_verification.png")

# Boilerplate to run the verification
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_index_page(page)
        browser.close()
