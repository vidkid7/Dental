# Contact Information Update Guide

## Current Status

The application uses **two sources** for contact information:

### 1. Database Settings (Dynamic)
- **Used by**: Footer component
- **Source**: `settings` table in database
- **Fields**: `settings.phone`, `settings.address`, `settings.email`
- **Managed via**: Admin panel at `/admin/settings`

### 2. Hardcoded Values (Static)
- **Used by**: CTASection, Chatbot, Backend services
- **Current values**: Placeholder data
- **Need to update**: Yes

## Recommended Contact Information

Based on the Footer showing "Chabahil, Koteshwor, Kathmandu", here's what should be used:

```
Hospital Name: Om Chabahil Dental Hospital
Address: Chabahil, Koteshwor, Kathmandu, Nepal
Phone: [To be set in admin panel]
Email: [To be set in admin panel]
```

## How to Update Contact Information

### Option 1: Update via Admin Panel (Recommended)
1. Go to `/admin/settings`
2. Update the following fields:
   - Phone number
   - Address
   - Email
3. Save changes
4. Footer will automatically reflect these changes

### Option 2: Update Hardcoded Values
If you want consistent contact info across all components, update these files:

#### Files to Update:
1. `frontend/src/components/home/CTASection.tsx`
   - Phone number (line ~60)
   - Address (line ~73)

2. `frontend/src/components/chatbot/ChatbotWidget.tsx`
   - Phone in responses (lines ~73, ~80, ~95)
   - Email in responses (line ~80)

3. `frontend/src/app/academics/admissions/page.tsx`
   - Phone placeholder (line ~260)

4. `backend/src/modules/chatbot/chatbot.service.ts`
   - Phone, email, address in context (lines ~38-40)
   - Phone in error message (line ~69)
   - Phone in FAQ (line ~77)

5. `backend/src/modules/notifications/notifications.service.ts`
   - Hospital name, address, phone in email footer (line ~104)

## Current Placeholder Values

These are currently used in hardcoded locations:
- Phone: `+1 (234) 567-890`
- Address: `123 Dental Avenue, Medical District`
- Email: `info@premierdentalcollege.edu`

## Action Required

**Please provide the actual contact information:**
1. **Phone Number**: _________________
2. **Full Address**: _________________
3. **Email**: _________________

Once provided, I can update all hardcoded values to match.

## Note

The Footer component already uses the correct approach (database settings), so it will always show the most up-to-date information from the admin panel. Other components should either:
- Be updated to use the same settings hook, OR
- Have their hardcoded values updated to match the database settings
