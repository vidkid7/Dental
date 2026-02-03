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
        await page.goto("http://localhost:3000/admin", wait_until="commit", timeout=10000)

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
        # -> Navigate to http://localhost:3000/admin
        await page.goto("http://localhost:3000/admin", wait_until="commit", timeout=10000)
        
        # -> Navigate to /admin/enquiries (direct URL because no interactive elements found on current page).
        await page.goto("http://localhost:3000/admin/enquiries", wait_until="commit", timeout=10000)
        
        # -> Reload the /admin/enquiries page to attempt to recover the SPA rendering. If reload fails, try alternate navigation (e.g., /admin or admin login) or open a new tab to further debug.
        await page.goto("http://localhost:3000/admin/enquiries", wait_until="commit", timeout=10000)
        
        # -> Reload /admin/enquiries with a cache-busting query parameter to force client JS to execute, then re-evaluate the page for interactive elements and any runtime errors.
        await page.goto("http://localhost:3000/admin/enquiries?_r=1", wait_until="commit", timeout=10000)
        
        # -> Open the admin login or alternate admin route in a new tab to see if a different admin UI or login page loads (navigate to /admin/login), then inspect the new tab for interactive elements and any runtime errors.
        await page.goto("http://localhost:3000/admin/login", wait_until="commit", timeout=10000)
        
        # -> Open the public site root in a new tab to check whether the main site and auth flow load correctly (look for links to admin/login or visible auth flows), and gather its DOM/scripts to help debug why the admin SPA stalls at 'Checking authentication...'.
        await page.goto("http://localhost:3000/", wait_until="commit", timeout=10000)
        
        # -> Click the 'Staff Login' link on the public site to navigate to the admin login/auth flow and inspect the resulting page for interactive elements (index 293).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the enquiries API endpoint to check server response (data vs 401/redirect) and determine whether the backend is reachable and requires authentication.
        await page.goto("http://localhost:3000/api/enquiries", wait_until="commit", timeout=10000)
        
        # -> Click the 'Staff Login' link on the current page to load the admin login/auth flow in this tab so a fresh in-page evaluation (console/errors, __NEXT_DATA__, cookies/localStorage) can be run to diagnose the stalled 'Checking authentication...' state.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the authentication session API to inspect its response (status, body) to determine why the admin login is stuck on 'Checking authentication...' and whether authentication endpoints are reachable.
        await page.goto("http://localhost:3000/api/auth/session", wait_until="commit", timeout=10000)
        
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    