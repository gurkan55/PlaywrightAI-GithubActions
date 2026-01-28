import { test, expect } from '@playwright/test';


// Generate a Playwright test for the following scenario:
// 1. Navigate to https://demo5.odoo.com/odoo/sales
// 2. Click 'Products' menu and 'Products'
// 3. Click 'New' button
// 4. Fill Product as 'Smart Phone'
// 5. Click 'Goods' radio button
// 6. Click 'Track Inventory' checkbox
// 7. Fill Quantity On Hand as '15'
// 8. Fill Sales Price as '399'
// 9. Verify the following values are visible:
// Sales Tax: 15%
// (= $ 458.85 Incl. Taxes)
// 10. Select Avatax Category as 'Digital goods'
// 11. Fill Cost as '199'
// 12. Select Purchase Taxes as '15%'
// 13. Select Category as 'Goods'
// 14. Click 'Products' menu and 'Products'
// 15. Change view from 'Kanban' to 'List'
// 16. Search for 'Smart Phone'
// 17. Verify the following columns and values (make sure correct rows and columns): 
// Product Name: Smart Phone
// Sales Price: $ 399.00
// Sales Taxes: 15%
// On Hand: 15.00
// Forecasted: 15.00
// Unit: Units


test.describe('Odoo Product Management', () => {
  test('Create a new Smart Phone product and verify in list view', async ({ page }) => {
    // Set longer timeout for Odoo demo site
    test.setTimeout(180000);

    // Step 1: Navigate to Odoo demo and access Sales module
    await page.goto('https://demo.odoo.com');
    
    // Wait for the Sales option to appear (demo site redirects automatically)
    await page.getByRole('option', { name: 'Sales' }).waitFor({ state: 'visible', timeout: 60000 });
    
    // Click on Sales app
    await page.getByRole('option', { name: 'Sales' }).click();
    
    // Wait for Products menu to be visible (indicates Sales module loaded)
    await page.getByRole('button', { name: 'Products' }).waitFor({ state: 'visible', timeout: 30000 });

    // Step 2: Click Products menu and Products submenu
    await page.getByRole('button', { name: 'Products' }).click();
    await page.getByRole('menuitem', { name: 'Products' }).waitFor({ state: 'visible' });
    await page.getByRole('menuitem', { name: 'Products' }).click();
    
    // Wait for the URL to change to products page
    await page.waitForURL(/\/products/, { timeout: 30000 });
    
    // Wait for New button to appear (indicates Products page loaded)
    await page.getByRole('button', { name: 'New' }).waitFor({ state: 'visible', timeout: 30000 });

    // Step 3: Click New button to create a new product
    await page.getByRole('button', { name: 'New' }).click();
    
    // Wait for the URL to change to new product form
    await page.waitForURL(/\/products\/new/, { timeout: 30000 });
    
    // Wait for the product form to load
    await page.getByRole('textbox', { name: 'Product' }).waitFor({ state: 'visible', timeout: 60000 });

    // Step 4: Fill Product name as 'Smart Phone'
    await page.getByRole('textbox', { name: 'Product' }).fill('Smart Phone');

    // Step 5: Click 'Goods' radio button (verify it's selected - it's default)
    const goodsRadio = page.getByRole('radio', { name: 'Goods' });
    await expect(goodsRadio).toBeChecked();

    // Step 6: Click 'Track Inventory' checkbox
    await page.getByRole('checkbox', { name: 'Track Inventory?' }).click();

    // Step 7: Fill Quantity On Hand as '15'
    // Wait for the quantity field to appear after checking Track Inventory
    const quantityField = page.locator('input[id^="qty_available"]');
    await quantityField.waitFor({ state: 'visible' });
    await quantityField.click();
    await quantityField.fill('15');

    // Step 8: Fill Sales Price as '399'
    await page.getByRole('textbox', { name: 'Sales Price?' }).click();
    await page.getByRole('textbox', { name: 'Sales Price?' }).fill('399');

    // Step 9: Verify Sales Tax values are visible
    // Click elsewhere to trigger the update
    await page.getByRole('textbox', { name: 'Cost?' }).click();
    
    // Verify Sales Tax is 15%
    await expect(page.locator('text=15%').first()).toBeVisible();
    
    // Verify the calculated tax inclusive price
    await expect(page.locator('text=(= $ 458.85 Incl. Taxes)')).toBeVisible();

    // Step 10: Select Avatax Category as 'Digital goods'
    await page.getByRole('combobox', { name: 'Avatax Category?' }).click();
    await page.getByRole('combobox', { name: 'Avatax Category?' }).fill('Digital goods');
    await page.getByRole('option', { name: '[D0000000] Digital goods' }).click();

    // Step 11: Fill Cost as '199'
    await page.getByRole('textbox', { name: 'Cost?' }).fill('199');

    // Step 12: Verify Purchase Taxes is '15%' (should be pre-selected)
    await expect(page.locator('.o_field_widget[name="supplier_taxes_id"]').getByText('15%')).toBeVisible();

    // Step 13: Select Category as 'Goods'
    await page.getByRole('combobox', { name: 'Category', exact: true }).click();
    await page.getByRole('combobox', { name: 'Category', exact: true }).fill('Goods');
    await page.getByRole('option', { name: 'Goods', exact: true }).click();

    // Save the product
    await page.getByRole('button', { name: 'Save manually' }).click();
    
    // Wait for save to complete - title should change to 'Smart Phone'
    await page.waitForFunction(() => document.title.includes('Smart Phone'), { timeout: 30000 });

    // Verify product was saved
    await expect(page.locator('text=Smart Phone')).toBeVisible();

    // Step 14: Click Products menu and Products submenu
    await page.getByRole('button', { name: 'Products' }).click();
    await page.getByRole('menuitem', { name: 'Products' }).waitFor({ state: 'visible' });
    await page.getByRole('menuitem', { name: 'Products' }).click();
    
    // Wait for the products list to load
    await page.getByRole('button', { name: 'List View' }).waitFor({ state: 'visible', timeout: 30000 });

    // Step 15: Change view from 'Kanban' to 'List'
    await page.getByRole('button', { name: 'List View' }).click();
    
    // Wait for the list view to load - look for the table or grid
    await page.locator('.o_list_view').waitFor({ state: 'visible', timeout: 30000 });

    // Step 16: Search for 'Smart Phone'
    await page.getByRole('searchbox', { name: 'Search...' }).fill('Smart Phone');
    
    // Wait for search suggestions to appear and click on "Search Product for" option
    await page.getByRole('link', { name: 'Search Product for: Smart' }).waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('link', { name: 'Search Product for: Smart' }).click();
    
    // Wait for search to filter results
    await page.waitForTimeout(3000);

    // Step 17: Verify the following columns and values
    // First verify the list view container is visible
    const listView = page.locator('.o_list_view, .o_list_renderer, table');
    await expect(listView.first()).toBeVisible({ timeout: 10000 });

    // Find the data row containing our product (exclude header rows)
    const productRow = page.locator('.o_data_row').filter({ hasText: 'Smart Phone' }).first();
    await expect(productRow).toBeVisible({ timeout: 15000 });

    // Verify values in the row
    // Product Name: Smart Phone
    await expect(productRow).toContainText('Smart Phone');

    // Sales Price: $ 399.00
    await expect(productRow).toContainText('399.00');

    // Sales Taxes: 15%
    await expect(productRow).toContainText('15%');

    // On Hand: 15.00
    await expect(productRow).toContainText('15.00');

    // Forecasted: 15.00 (same as On Hand initially)
    // Unit: Units
    await expect(productRow).toContainText('Units');
  });
});
