# How to Verify Changes Are Applied

## Steps to Ensure Updates Are Working:

### 1. **Clear Next.js Cache**
```powershell
cd Payroll-config-setup\frontend
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

### 2. **Restart Dev Server**
- Stop your current `npm run dev` process (Ctrl+C)
- Start it again: `npm run dev`

### 3. **Hard Refresh Browser**
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### 4. **Check Browser Console**
When you try to create a signing bonus or termination benefit, you should see:
- `Creating signing bonus with data: { positionName: "...", amount: ... }`
- `API: Sending signing bonus payload: { positionName: "...", amount: ... }`

### 5. **Verify Files Are Updated**

**Signing Bonus Form** (`signing-bonuses/new/page.tsx`):
- Should only have `positionName` and `amount` fields
- NO `name`, `paymentTerms`, `eligibilityCriteria`, `description`, `status` fields

**Termination Benefit Form** (`termination-benefits/new/page.tsx`):
- Should only have `name`, `amount`, and optional `terms` fields
- NO `benefitType`, `calculationMethod`, `eligibilityCriteria`, `description`, `status` fields

**Delete Buttons**:
- Check any Payroll Specialist page (policies, pay-grades, etc.)
- Should NOT see Delete buttons in the Actions column

**Navigation Tabs** (`layout.tsx`):
- Should show: Policies, Pay Grades, Pay Types, Allowances, Signing Bonuses, Termination Benefits, Insurance Brackets, Tax Rules

### 6. **Network Tab Verification**
1. Open Browser DevTools (F12)
2. Go to Network tab
3. Try creating a signing bonus
4. Find the POST request to `/payroll-configuration/signing-bonuses`
5. Click on it → Go to "Payload" or "Request" tab
6. Verify it only contains: `{ "positionName": "...", "amount": ... }`

### 7. **If Still Not Working**
- Check if you're running the dev server from the correct directory
- Make sure you saved all files
- Check for any TypeScript compilation errors
- Look for any error messages in the terminal where `npm run dev` is running

