import { test, expect } from '@playwright/test';

// UI example - add new user verify in the table - delete the user verify in the table 
// Generate a Playwright test for the following scenario:
// 1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
// 2. Fill username as 'Admin' and password as 'admin123' 
// 3. Click 'login'
// 4. Verify that you logged in to the dashboard 
// 5. Click 'PIM' and 'Add Employee'
// 6. Fill First Name as 'Alex' and Last Name as 'Test'
// 7. Turn on 'Create Login Details' toggle
// 8. Fill Username as 'alextest'
// 9. Click 'Enabled' radio button
// 10. Fill password as 'alex1234'
// 11. Fill confirm password as 'alex1234'
// 12. Click 'Save' button 
// 13. Verify that user successfully saved and wait successful message to disappear
// 14. Click 'Employee List'
// 15. Fill Employee Name as 'Alex Test' and select from the dropdown
// 16. Click 'Search' button
// 17. Verify First Name displayed as 'Alex' and Last Name displayed as 'Test' in employee list table with pencil and trash icons
// 18. Click 'Admin' link
// 19. Fill Username as 'alextest' and Click 'Search' button
// 20. Verify Username displayed as 'alextest', User Role displayed as 'ESS', Employee Name displayed as 'Alex Test', Status displayed as 'Enabled' in employee list table with pencil and trash icons
// 21. Click user dropdown and click logout
// 22. Fill username as 'alextest' and password as 'alex1234' 
// 23. Click 'login'
// 24. Verify that you logged in to the dashboard 
// 25. Click user dropdown and click logout
// 26. Fill username as 'Admin' and password as 'admin123' 
// 27. Click 'login'
// 28. Verify that you logged in to the dashboard 
// 29. Click 'PIM' and 'Employee List'
// 30. Fill Employee Name as 'Alex Test' and select from the dropdown
// 31. Click 'Search' button
// 32. Verify First Name displayed as 'Alex' and Last Name displayed as 'Test' in employee list table
// 33. Click trash icon and 'Yes, Delete'
// 34. Verify that user successfully saved and wait successful message to disappear
// 35. Click 'Admin' link
// 36. Fill Username as 'alextest' and Click 'Seacrh' button
// 37. Verify no records found
// 38. Click user dropdown and click logout
// 39. Fill username as 'alextest' and password as 'alex1234' 
// 40. Click 'login'
// 41. Verify 'Invalid credentials'


test.describe('OrangeHRM Employee Management', () => {
  const adminUsername = 'Admin';
  const adminPassword = 'admin123';
  const newEmployeeFirstName = 'Alex';
  const newEmployeeLastName = 'Test';
  const newEmployeeUsername = 'alextest';
  const newEmployeePassword = 'alex1234';

  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('Complete employee lifecycle - create, verify, login, delete, and verify deletion', async ({ page }) => {
    // Increase timeout for this long E2E test
    test.setTimeout(120000);

    // Step 1-4: Login as Admin and verify dashboard
    await page.getByRole('textbox', { name: 'Username' }).fill(adminUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(adminPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Step 5: Click PIM and navigate to Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 6: Fill First Name and Last Name
    await page.getByRole('textbox', { name: 'First Name' }).fill(newEmployeeFirstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(newEmployeeLastName);

    // Step 7: Turn on Create Login Details toggle (use evaluate due to span intercepting clicks)
    await page.evaluate(() => { document.querySelector('.oxd-switch-input')?.click(); });

    // Step 8: Fill Username in the Login Details section
    await page.locator('.oxd-input-group').filter({ hasText: 'Username' }).getByRole('textbox').fill(newEmployeeUsername);

    // Step 9: Enabled radio button is already selected by default
    await expect(page.getByRole('radio', { name: 'Enabled' })).toBeChecked();

    // Step 10-11: Fill password and confirm password
    await page.locator('input[type="password"]').first().fill(newEmployeePassword);
    await page.locator('input[type="password"]').nth(1).fill(newEmployeePassword);

    // Step 12: Click Save button
    await page.getByRole('button', { name: 'Save' }).click();

    // Step 13: Verify success message and wait for it to disappear
    await expect(page.getByText('Successfully Saved')).toBeVisible();
    await page.getByText('Successfully Saved').waitFor({ state: 'hidden' });

    // Step 14: Click Employee List
    await page.getByRole('link', { name: 'Employee List' }).click();

    // Step 15: Fill Employee Name and select from dropdown
    await page.getByRole('textbox', { name: 'Type for hints...' }).first().pressSequentially(`${newEmployeeFirstName} ${newEmployeeLastName}`);
    await page.getByRole('option', { name: `${newEmployeeFirstName} ${newEmployeeLastName}` }).click();

    // Step 16: Click Search button
    await page.getByRole('button', { name: 'Search' }).click();

    // Step 17: Verify employee details in table
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Record Found')).toBeVisible({ timeout: 10000 });
    const employeeRow = page.getByRole('row', { name: new RegExp(`${newEmployeeFirstName}.*${newEmployeeLastName}`) });
    await expect(employeeRow.getByRole('cell', { name: newEmployeeFirstName })).toBeVisible();
    await expect(employeeRow.getByRole('cell', { name: newEmployeeLastName })).toBeVisible();
    // Verify pencil and trash icons exist (two buttons in the Actions cell)
    await expect(employeeRow.getByRole('button').first()).toBeVisible();
    await expect(employeeRow.getByRole('button').nth(1)).toBeVisible();

    // Step 18: Click Admin link
    await page.getByRole('link', { name: 'Admin' }).click();

    // Step 19: Fill Username and Click Search button (nth(1) because nth(0) is sidebar Search)
    await page.getByRole('textbox').nth(1).fill(newEmployeeUsername);
    await page.getByRole('button', { name: 'Search' }).click();

    // Step 20: Verify user details in Admin table
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Record Found')).toBeVisible({ timeout: 10000 });
    const adminRow = page.getByRole('row', { name: new RegExp(newEmployeeUsername) });
    await expect(adminRow.getByRole('cell', { name: newEmployeeUsername })).toBeVisible();
    await expect(adminRow.getByRole('cell', { name: 'ESS' })).toBeVisible();
    await expect(adminRow.getByRole('cell', { name: `${newEmployeeFirstName} ${newEmployeeLastName}` })).toBeVisible();
    await expect(adminRow.getByRole('cell', { name: 'Enabled' })).toBeVisible();
    // Verify pencil and trash icons
    await expect(adminRow.getByRole('button').first()).toBeVisible();
    await expect(adminRow.getByRole('button').nth(1)).toBeVisible();

    // Step 21: Click user dropdown and logout
    await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    // Step 22-23: Login with new employee credentials
    await page.getByRole('textbox', { name: 'Username' }).fill(newEmployeeUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(newEmployeePassword);
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 24: Verify logged in to dashboard
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Step 25: Click user dropdown and logout
    await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    // Step 26-27: Login as Admin again
    await page.getByRole('textbox', { name: 'Username' }).fill(adminUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(adminPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 28: Verify logged in to dashboard
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Step 29: Click PIM and Employee List
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Employee List' }).click();

    // Step 30: Fill Employee Name and select from dropdown
    await page.getByRole('textbox', { name: 'Type for hints...' }).first().pressSequentially(`${newEmployeeFirstName} ${newEmployeeLastName}`);
    await page.getByRole('option', { name: `${newEmployeeFirstName} ${newEmployeeLastName}` }).click();

    // Step 31: Click Search button
    await page.getByRole('button', { name: 'Search' }).click();

    // Step 32: Verify employee in table
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Record Found')).toBeVisible({ timeout: 10000 });
    const deleteEmployeeRow = page.getByRole('row', { name: new RegExp(`${newEmployeeFirstName}.*${newEmployeeLastName}`) });
    await expect(deleteEmployeeRow.getByRole('cell', { name: newEmployeeFirstName })).toBeVisible();
    await expect(deleteEmployeeRow.getByRole('cell', { name: newEmployeeLastName })).toBeVisible();

    // Step 33: Click trash icon and confirm deletion
    await deleteEmployeeRow.getByRole('button').nth(1).click();
    await page.getByRole('button', { name: ' Yes, Delete' }).click();

    // Step 34: Verify success message and dismiss the toast
    const deleteToast = page.locator('.oxd-toast').filter({ hasText: 'Successfully Deleted' });
    await expect(deleteToast).toBeVisible();
    await deleteToast.locator('.oxd-toast-close').click();

    // Step 35: Click Admin link
    await page.getByRole('link', { name: 'Admin' }).click();

    // Step 36: Fill Username and Click Search button
    await page.getByRole('textbox').nth(1).fill(newEmployeeUsername);
    await page.getByRole('button', { name: 'Search' }).click();

    // Step 37: Verify no records found
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('No Records Found').first()).toBeVisible({ timeout: 10000 });

    // Step 38: Click user dropdown and logout
    await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    // Step 39-40: Try to login with deleted user credentials
    await page.getByRole('textbox', { name: 'Username' }).fill(newEmployeeUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(newEmployeePassword);
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 41: Verify Invalid credentials
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
