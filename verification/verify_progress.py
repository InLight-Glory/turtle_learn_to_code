from playwright.sync_api import sync_playwright

def verify_progress_tracking():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Step 1: Complete a challenge
        print("Navigating to challenge page...")
        page.goto('http://localhost:8000/challenge.html?id=K_S1C1')

        # We need to simulate winning.
        # The easiest way is to set the turtle position to the target and call checkWinCondition
        # But since we modified checkWinCondition, we can just execute JS to do that.

        print("Simulating challenge completion...")
        page.evaluate("""
            const target = state.currentChallenge.target;
            state.turtle.x = target.x;
            state.turtle.y = target.y;
            checkWinCondition();
        """)

        # Wait a bit for the localStorage to update and alert to handle (though alert might block, Playwright handles dialogs)
        # We need to handle the dialog
        page.on("dialog", lambda dialog: dialog.accept())

        # Wait a moment
        page.wait_for_timeout(1000)

        # Step 2: Check Index Page
        print("Navigating to index page...")
        page.goto('http://localhost:8000/index.html')

        # Click Grade K, Set 1
        # The default should be Grade K, Set 1 already populated, but let's click to be sure
        # The buttons are generated dynamically.

        # Wait for the buttons to appear
        page.wait_for_selector('.grade-btn')

        # Check if the challenge link has the 'completed-challenge' class
        # K_S1C1 title is "Simple Move"

        print("Checking for completed class...")
        link = page.locator('a[href="challenge.html?id=K_S1C1"]')
        is_completed = link.get_attribute('class')

        if is_completed and 'completed-challenge' in is_completed:
            print("SUCCESS: Challenge is marked as completed.")
        else:
            print(f"FAILURE: Challenge is NOT marked as completed. Class: {is_completed}")

        # Take screenshot
        page.screenshot(path='verification/progress_tracking.png')
        print("Screenshot saved to verification/progress_tracking.png")

        browser.close()

if __name__ == "__main__":
    verify_progress_tracking()
