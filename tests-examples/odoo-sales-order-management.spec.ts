import { test, expect } from '@playwright/test';


// UI example - Sales App Demo
// Generate a Playwright test for the following scenario:
// 1. Navigate to https://demo5.odoo.com/odoo/sales
// 2. Click 'New' button
// 3. Select Customer as 'OpenWood'
// 4. Fill Expiration as '12/31/2026'
// 5. Select Pricelist as 'EUR (EUR)'
// 6. Select Payment Terms as 'Immediate Payment'
// 7. Click 'Add a product' and select product as 'Apple Pie'
// 8. Fill Quantity as '20'
// 9. Remove '0% Exports' from Taxes and select '15%'
// 10. Verify the following values are visible: 
// Untaxed Amount:	308.00
// Tax 15%:	46.20
// Total	354.20
// 11. Click 'Send' button
// 12. Wait for Configure your document layout
// 13. Click 'Continue' button
// 14. Wait for Send details
// 15. Verify the following details are visible: 
// To: OpenWood
// Subject: Demo Company Quotation (Ref S00070)
// amount 354.20 €
// 16. Click 'Send' button
// 17. Click 'Confirm' button
// 18. Click 'Orders' and 'Quotations'
// 19. Search for 'openwood'
// 20. Verify the following columns and values: 
// Customer: OpenWood
// Salesperson: Mitchell Admin
// Company: Demo Company
// Total: 354.20
// Status: Sales Order
// 21. Click the row that has Number as 'S00070' 
// 22. Edit Quantity from '20' to '30'
// 23  Verify the following values are visible: 
// Untaxed Amount:	462.00
// Tax 15%:	69.30
// Total	531.30
// 24. Click 'Orders' and 'Quotations'
// 25. Search for 'openwood'
// 26. Verify the following columns and values: 
// Customer: OpenWood
// Salesperson: Mitchell Admin
// Company: Demo Company
// Total: 531.30
// Status: Sales Order


// Reduce default timeouts for faster test execution
test.use({ actionTimeout: 10000, navigationTimeout: 15000 });

test.describe('Odoo Sales Order Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Odoo demo and wait for it to load
    await page.goto('https://demo.odoo.com');
    // Wait for the home page to load
    await page.waitForLoadState('domcontentloaded');
  });

  test('Create, send, confirm and edit a sales order for OpenWood', async ({ page }) => {
    // Step 1: Navigate to Sales module
    await page.getByRole('option', { name: 'Sales' }).click();
    await expect(page).toHaveTitle(/Quotations/);

    // Step 2: Click 'New' button to create a new quotation
    await page.getByRole('button', { name: 'New' }).click();
    await expect(page).toHaveURL(/\/sales\/new/);

    // Step 3: Select Customer as 'OpenWood'
    await page.getByRole('combobox', { name: 'Customer' }).click();
    await page.getByRole('option', { name: 'OpenWood' }).click();
    await expect(page.getByRole('combobox', { name: 'Customer' })).toHaveValue('OpenWood');

    // Step 4: Fill Expiration as '12/31/2026'
    await page.getByRole('button', { name: /Expiration/ }).click();
    await page.getByRole('textbox', { name: /Expiration/ }).fill('12/31/2026');
    await page.keyboard.press('Escape');

    // Step 5: Select Pricelist as 'EUR (EUR)'
    await page.getByRole('combobox', { name: /Pricelist/ }).click();
    await page.getByRole('option', { name: 'EUR (EUR)' }).click();

    // Step 6: Select Payment Terms as 'Immediate Payment'
    await page.getByRole('combobox', { name: 'Payment Terms' }).click();
    await page.getByRole('option', { name: 'Immediate Payment' }).click();

    // Step 7: Click 'Add a product' and select product as 'Apple Pie'
    await page.getByRole('button', { name: 'Add a product' }).click();
    await page.getByRole('combobox', { name: 'Search a product' }).fill('Apple Pie');
    await page.getByRole('option', { name: 'Apple Pie', exact: true }).click();

    // Step 8: Fill Quantity as '20'
    await page.getByRole('cell', { name: '1.00' }).getByRole('textbox').click();
    await page.getByRole('cell', { name: '1.00' }).getByRole('textbox').fill('20');

    // Step 9: Remove '0% Exports' from Taxes and select '15%'
    await page.getByRole('link', { name: 'Delete' }).click();
    await page.locator('.o_field_many2many_selection .o-autocomplete--input').click();
    await page.getByRole('option', { name: '15%' }).click();

    // Step 10: Verify the calculated values
    await expect(page.getByRole('cell', { name: 'Untaxed Amount:' }).locator('..').getByRole('cell').last()).toContainText('308.00');
    await expect(page.getByRole('cell', { name: 'Tax 15%:' }).locator('..').getByRole('cell').last()).toContainText('46.20');
    await expect(page.getByRole('cell', { name: 'Total:' }).locator('..').getByRole('cell').last()).toContainText('354.20');

    // Step 11: Click 'Send' button
    await page.getByRole('button', { name: 'Send', exact: true }).click();

    // Step 12: Wait for Configure your document layout dialog
    await expect(page.getByRole('heading', { name: 'Configure your document layout' })).toBeVisible();

    // Step 13: Click 'Continue' button
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 14: Wait for Send details dialog
    await expect(page.getByRole('heading', { name: 'Send' })).toBeVisible();

    // Step 15: Verify the send details
    await expect(page.locator('text=OpenWood')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue(/Demo Company Quotation.*S00/);
    await expect(page.getByText('354.20', { exact: true }).first()).toBeVisible();

    // Step 16: Click 'Send' button in dialog
    await page.locator('button[name="action_send_mail"]').click();

    // Step 17: Click 'Confirm' button
    await page.getByRole('button', { name: 'Confirm' }).click();
    
    // Wait for the status to update to Sales Order
    await expect(page.getByRole('radio', { name: 'Sales Order' })).toBeChecked();

    // Step 18-19: Click 'Orders' -> 'Quotations' and Search for 'openwood'
    await page.getByRole('button', { name: 'Orders' }).click();
    await page.getByRole('menuitem', { name: 'Quotations' }).click();
    await page.getByRole('searchbox', { name: 'Search...' }).fill('openwood');
    await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');

    // Step 20: Verify the columns and values in the list
    const row = page.getByRole('row').filter({ hasText: 'OpenWood' }).first();
    // Verify specific columns by position: Customer(3), Salesperson(5), Company(7), Total(8), Status(9)
    await expect(row.getByRole('cell').nth(3)).toContainText('OpenWood');
    await expect(row.getByRole('cell').nth(5)).toContainText('Mitchell Admin');
    await expect(row.getByRole('cell').nth(7)).toContainText('Demo Company');
    await expect(row.getByRole('cell').nth(8)).toContainText('354.20');
    await expect(row.getByRole('cell').nth(9)).toContainText('Sales Order');

    // Step 21: Click the row that has the sales order number to open edit page
    await row.getByRole('cell', { name: 'OpenWood' }).click();

    // Step 22: Edit Quantity from '20' to '30'
    await page.getByRole('cell', { name: '20.00' }).click();
    await page.getByRole('cell', { name: '20.00' }).getByRole('textbox').fill('30');
    await page.keyboard.press('Tab');

    // Step 23: Verify the updated calculated values
    await expect(page.getByRole('cell', { name: 'Untaxed Amount:' }).locator('..').getByRole('cell').last()).toContainText('462.00');
    await expect(page.getByRole('cell', { name: 'Tax 15%:' }).locator('..').getByRole('cell').last()).toContainText('69.30');
    await expect(page.getByRole('cell', { name: 'Total:' }).locator('..').getByRole('cell').last()).toContainText('531.30');

    // Save the changes
    await page.getByRole('button', { name: 'Save manually' }).click();

    // Step 24-25: Click 'Orders' -> 'Quotations' and Search for 'openwood'
    await page.getByRole('button', { name: 'Orders' }).click();
    await page.getByRole('menuitem', { name: 'Quotations' }).click();
    await page.getByRole('searchbox', { name: 'Search...' }).fill('openwood');
    await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');

    // Step 26: Verify the updated columns and values in the list
    const updatedRow = page.getByRole('row').filter({ hasText: 'OpenWood' }).first();
    // Verify specific columns by position: Customer(3), Salesperson(5), Company(7), Total(8), Status(9)
    await expect(updatedRow.getByRole('cell').nth(3)).toContainText('OpenWood');
    await expect(updatedRow.getByRole('cell').nth(5)).toContainText('Mitchell Admin');
    await expect(updatedRow.getByRole('cell').nth(7)).toContainText('Demo Company');
    await expect(updatedRow.getByRole('cell').nth(8)).toContainText('531.30');
    await expect(updatedRow.getByRole('cell').nth(9)).toContainText('Sales Order');
  });
});
