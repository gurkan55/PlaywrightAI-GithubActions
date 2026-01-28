import { test, expect } from '@playwright/test';

// UI example - AG Grid Demo 
// Generate a Playwright test for the following scenario:
// 1. Navigate to https://aggrid.reflex.run/model-auth/
// 2. Click 'Login' 
// 3. Verify the following grid columns are displayed: 'Id', 'Name', 'Age', 'Years_known', 'Owes_me', 'Has_a_dog', 'Spouse_is_annoying' and 'Met' 
// 4. Verify the following action buttons are visible: 'Logout', 'Generate Friends', 'Delete' and 'Add' 
// 5. Click 'Add' button
// 6. Fill the form with the following values:
// Name: Mark Test
// Age: 30
// Years_known: 5
// 7.Select the following checkboxes:
// Owes_me
// Has_a_dog
// Spouse_is_annoying
// 10. Fill met date as '2018-09-04T04:48:21.960785'
// 11. Click 'Add' button
// 12. Open Name Filter and Enter 'Mark Test'
// 13. Verify the row displays:
// Name: Mark Test
// Age: 30
// Years_known: 5
// Owes_me: checked
// Has_a_dog: checked
// Spouse_is_annoying: checked
// Met: 2018-09-04T04:48:21.960785
// 14. Edit Name from 'Mark Test' to 'Mark Test Edit'
// 15. Edit Age from '30' to '35'
// 16. Edit Years_known from '5' to '10'
// 17. Uncheck the following checkboxes and verify each change:
// Owes_me
// Has_a_dog
// Spouse_is_annoying
// 18. Update Met date to: 2025-12-22
// 19. Clear the Name Filter
// 20. Verify all edited values are saved and displayed correctly
// 21. Select the row checkbox for Name = Mark Test Edit
// 22. Click Delete   
// 23. Verify the record is no longer present in the grid  


test.describe('AG Grid Friend Management', () => {
  test('should add, verify, edit, and delete a friend record', async ({ page }) => {
    // Step 1: Navigate to the application
    await page.goto('https://aggrid.reflex.run/model-auth/');

    // Step 2: Click Login button
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for the grid to load after login
    await expect(page.locator('.ag-root-wrapper')).toBeVisible({ timeout: 15000 });

    // Step 3: Verify grid columns are displayed
    const expectedColumns = ['Id', 'Name', 'Age', 'Years_known', 'Owes_me', 'Has_a_dog', 'Spouse_is_annoying', 'Met'];
    for (const column of expectedColumns) {
      await expect(page.getByRole('columnheader', { name: column })).toBeVisible();
    }

    // Step 4: Verify action buttons are visible
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate Friends' })).toBeVisible();
    // Delete and Add buttons are icon buttons
    await expect(page.locator('.lucide-trash-2').first()).toBeVisible();
    await expect(page.locator('.lucide-plus').first()).toBeVisible();

    // Step 5: Click Add button (plus icon)
    await page.locator('.lucide-plus').first().click();

    // Wait for dialog to appear
    await expect(page.getByRole('dialog', { name: 'Add new Friend' })).toBeVisible();

    // Step 6: Fill the form with values
    await page.locator('input[name="name"]').fill('Mark Test');
    await page.locator('input[name="age"]').fill('30');
    await page.locator('input[name="years_known"]').fill('5');

    // Step 7: Select checkboxes
    await page.getByRole('row', { name: "owes_me (<class 'bool'>)" }).getByLabel('', { exact: true }).click();
    await page.getByRole('row', { name: "has_a_dog (<class 'bool'>)" }).getByLabel('', { exact: true }).click();
    await page.getByRole('row', { name: "spouse_is_annoying (<class '" }).getByLabel('', { exact: true }).click();

    // Step 10: Fill met date
    await page.locator('input[name="met"]').fill('2018-09-04T04:48:21.960785');

    // Step 11: Click Add button in dialog
    await page.getByRole('button', { name: 'Add' }).click();

    // Wait for dialog to close
    await expect(page.getByRole('dialog', { name: 'Add new Friend' })).not.toBeVisible();

    // Step 12: Open Name Filter and Enter 'Mark Test'
    await page.locator('.ag-header-cell-comp-wrapper').filter({ hasText: 'Name' }).locator('.ag-header-cell-filter-button').click();
    await page.getByRole('textbox', { name: 'Filter Value' }).first().fill('Mark Test');
    await page.keyboard.press('Enter');

    // Step 13: Verify the row displays correct values
    const row = page.getByRole('row').filter({ hasText: 'Mark Test' });
    await expect(row.getByRole('gridcell', { name: 'Mark Test' })).toBeVisible();
    await expect(row.getByRole('gridcell', { name: '30', exact: true })).toBeVisible();
    await expect(row.getByRole('gridcell', { name: '5', exact: true })).toBeVisible();
    // Verify checkboxes are checked
    const owesmeCell = row.locator('[col-id="owes_me"]');
    await expect(owesmeCell.getByRole('checkbox')).toBeChecked();
    const hasADogCell = row.locator('[col-id="has_a_dog"]');
    await expect(hasADogCell.getByRole('checkbox')).toBeChecked();
    const spouseIsAnnoyingCell = row.locator('[col-id="spouse_is_annoying"]');
    await expect(spouseIsAnnoyingCell.getByRole('checkbox')).toBeChecked();
    await expect(row.getByRole('gridcell', { name: '2018-09-04T04:48:21.960785' })).toBeVisible();

    // Close the filter popup
    await page.keyboard.press('Escape');

    // Step 14: Edit Name from 'Mark Test' to 'Mark Test Edit'
    await page.getByRole('gridcell', { name: 'Mark Test' }).dblclick();
    await page.getByRole('textbox', { name: 'Input Editor' }).fill('Mark Test Edit');
    await page.keyboard.press('Enter');

    // Step 15: Edit Age from '30' to '35'
    await page.getByRole('gridcell', { name: '30', exact: true }).dblclick();
    await page.getByRole('spinbutton', { name: 'Input Editor' }).fill('35');
    await page.keyboard.press('Enter');

    // Step 16: Edit Years_known from '5' to '10'
    await page.getByRole('gridcell', { name: '5', exact: true }).dblclick();
    await page.getByRole('spinbutton', { name: 'Input Editor' }).fill('10');
    await page.keyboard.press('Enter');

    // Step 17: Uncheck checkboxes and verify
    // Uncheck Owes_me
    const updatedRow = page.getByRole('row').filter({ hasText: 'Mark Test Edit' });
    const owesmeCheckbox = updatedRow.locator('[col-id="owes_me"]').getByRole('checkbox');
    await owesmeCheckbox.click();
    await expect(owesmeCheckbox).not.toBeChecked();

    // Uncheck Has_a_dog
    const hasADogCheckbox = updatedRow.locator('[col-id="has_a_dog"]').getByRole('checkbox');
    await hasADogCheckbox.click();
    await expect(hasADogCheckbox).not.toBeChecked();

    // Uncheck Spouse_is_annoying
    const spouseCheckbox = updatedRow.locator('[col-id="spouse_is_annoying"]').getByRole('checkbox');
    await spouseCheckbox.click();
    await expect(spouseCheckbox).not.toBeChecked();

    // Step 18: Update Met date to 2025-12-22
    await updatedRow.getByRole('gridcell').filter({ hasText: '2018-09-04T04:48:21.960785' }).dblclick();
    await page.getByRole('textbox', { name: 'Input Editor' }).fill('2025-12-22');
    await page.keyboard.press('Enter');

    // Step 19: Clear the Name Filter
    await page.locator('.ag-header-cell-filter-button.ag-filter-active').click();
    await page.getByRole('textbox', { name: 'Filter Value' }).first().fill('');
    await page.keyboard.press('Enter');

    // Step 20: Verify all edited values are saved - filter by edited name
    await page.getByRole('textbox', { name: 'Filter Value' }).first().fill('Mark Test Edit');
    await page.keyboard.press('Enter');

    const verifyRow = page.getByRole('row').filter({ hasText: 'Mark Test Edit' });
    await expect(verifyRow.locator('[col-id="name"]')).toHaveText('Mark Test Edit');
    await expect(verifyRow.locator('[col-id="age"]')).toHaveText('35');
    await expect(verifyRow.locator('[col-id="years_known"]')).toHaveText('10');
    await expect(verifyRow.locator('[col-id="owes_me"]').getByRole('checkbox')).not.toBeChecked();
    await expect(verifyRow.locator('[col-id="has_a_dog"]').getByRole('checkbox')).not.toBeChecked();
    await expect(verifyRow.locator('[col-id="spouse_is_annoying"]').getByRole('checkbox')).not.toBeChecked();
    await expect(verifyRow.getByRole('gridcell').filter({ hasText: /2025-12-22/ })).toBeVisible();

    // Close filter popup
    await page.keyboard.press('Escape');

    // Step 21: Select the row checkbox for Name = Mark Test Edit
    await verifyRow.getByRole('checkbox', { name: 'Press Space to toggle row' }).click();

    // Verify row is selected
    await expect(verifyRow).toHaveAttribute('aria-selected', 'true');

    // Step 22: Click Delete button
    await page.locator('.lucide-trash-2').first().click();

    // Step 23: Verify the record is no longer present in the grid
    // Clear filter to see all records
    await page.locator('.ag-header-cell-filter-button.ag-filter-active').click();
    await page.getByRole('textbox', { name: 'Filter Value' }).first().fill('');
    await page.keyboard.press('Enter');

    // Filter by the deleted name to verify it's gone
    await page.getByRole('textbox', { name: 'Filter Value' }).first().fill('Mark Test Edit');
    await page.keyboard.press('Enter');

    // Verify no rows are displayed (the grid body should be empty or show no data)
    await expect(page.getByRole('gridcell', { name: 'Mark Test Edit' })).not.toBeVisible();
  });
});

