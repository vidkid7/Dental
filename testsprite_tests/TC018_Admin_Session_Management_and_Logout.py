import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000/admin/login", wait_until="commit", timeout=10000)

        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass

        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:3000/admin/login
        await page.goto("http://localhost:3000/admin/login", wait_until="commit", timeout=10000)
        
        # -> Fill the email and password fields with provided credentials and click 'Sign In' to log in as admin.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div[2]/div/div/div/form/div[1]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('admin@omchabahildental.com.np')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div[2]/div/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Admin@123')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div[2]/div/div/div/form/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open Settings to locate session management (active sessions) so active sessions can be viewed and validated.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/aside/nav/div[8]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the Security settings (session management) to view active sessions and session controls (logout/invalidate sessions).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/aside/nav/div[8]/div/div/a[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Revoke the non-current iPhone - Safari session to verify session revocation works, then log out other sessions, and finally sign out the current admin to confirm redirect and invalidation.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[4]/div[2]/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[4]/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Confirm 'Logout All' to log out all other sessions, then sign out the current admin and verify redirect to login and other sessions invalidated.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[7]/div/div[2]/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/aside/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Confirm the admin was redirected to the login page and that the session is invalidated. If not redirected, navigate to the login page to verify the login form is shown and session state.
        await page.goto("http://localhost:3000/admin/login", wait_until="commit", timeout=10000)
        
        # -> Re-login as admin to verify session state, then revisit Security to confirm active sessions reflect revocation/logout-all before final sign-out verification.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div[2]/div/div/div/form/div[1]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('admin@omchabahildental.com.np')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div[2]/div/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Admin@123')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div[2]/div/div/div/form/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    