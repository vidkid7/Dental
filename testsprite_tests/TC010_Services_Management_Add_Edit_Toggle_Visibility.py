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
        
        # -> Fill the login form with provided credentials and submit to sign in (email=admin@omchabahildental.com.np, password=Admin@123). After successful sign-in, navigate to the Services page in the admin UI.
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
        
        # -> Open the Services management page in the admin panel by clicking the Services link in the sidebar.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/aside/nav/div[4]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the Services management page (Manage Services) in the admin by clicking the 'Manage Services' quick-action button so the services list and controls are visible.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[4]/div/a[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the 'Add Service' form so a new service can be created (click the Add Service button).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill the 'Add New Service' form with test data (name, description, price, duration, category) and click 'Add' to create the service.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[1]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Automated Test Service - DO NOT DELETE')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Automated test service added by UI test. Used to verify add, edit, and visibility controls.')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[3]/div[1]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('2500')
        
        # -> Click the 'Add' button to submit the new service form and create the service in the admin list.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[5]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the Edit modal for 'Automated Test Service - DO NOT DELETE', update Price to 3000 and Duration to 60, then save the changes.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[3]/div[7]/div[3]/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[3]/div[1]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('3000')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[3]/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('60')
        
        # -> Set Price=3000 and Duration=60 in the Edit Service modal, click 'Update Service', toggle the service visibility to hidden, then click 'View Site' to verify the service is not visible on the public services page.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[3]/div[1]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('3000')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[3]/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('60')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[5]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Close the Edit modal, then open the public site (View Site) to verify the Automated Test Service appears on the public services page.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/main/div/div[5]/div/div[2]/div[5]/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[2]/div/header/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the public site's Services page, wait for it to load, and check whether 'Automated Test Service - DO NOT DELETE' is present. If present, return exact displayed name, displayed price, and displayed duration; otherwise return 'not found'.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/header/div/nav/div[1]/div[3]/a').nth(0)
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
    