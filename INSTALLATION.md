# Installation Instructions

## PowerShell Execution Policy Issue

If you encountered an error when running `npm install`, you need to enable script execution in PowerShell.

### Option 1: Run in Command Prompt instead
1. Open **Command Prompt** (not PowerShell)
2. Navigate to your project: `cd d:\Projects\Court-Batminton`
3. Run: `npm install @supabase/supabase-js bcryptjs`

### Option 2: Enable PowerShell scripts (if you prefer PowerShell)
1. Open PowerShell as **Administrator**
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Type `Y` to confirm
4. Close and reopen your normal PowerShell
5. Navigate to project and run: `npm install @supabase/supabase-js bcryptjs`

## After Installation

Once the packages are installed successfully, follow the **SUPABASE_SETUP.md** guide to:
1. Create your Supabase account and project
2. Run the database schema
3. Get your API credentials
4. Configure the `.env` file

Then I can help you complete the frontend migration!
