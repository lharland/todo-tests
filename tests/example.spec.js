// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/dist/');
});

const TODO_ITEMS = [
  'Task 1'
];

test.describe('New Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    await expect(page.getByTestId('todo-item-label')).toHaveText([
      TODO_ITEMS[0]
    ]);
  });
  
});

async function createTodo(page) {
  // create a new todo locator
  const newTodo = page.getByPlaceholder('What needs to be done?');

  await newTodo.fill('Task 1');
  await newTodo.press('Enter');
}

test.describe('Completing and removing todos', () => {

  test('Mark all items as completed', async ({ page }) => {
    await createTodo(page);
    const completeAllLocator = page.locator('.toggle-all');
    await expect(completeAllLocator).toBeVisible();
    await completeAllLocator.click();

    // Shows item striked off.
    await expect(page.getByTestId('todo-item')).toHaveClass(['completed']);
  });


  test('Clear completed items', async ({ page }) => {
    await createTodo(page);
    const todoItems = page.getByTestId('todo-item');
    await expect(todoItems).toHaveCount(1);
    
    const clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    // This button will be disabled if there are no todo selected.
    await expect(clearCompletedButton).toBeDisabled();

    await page.locator('.todo-list li .toggle').first().check();
    await expect(clearCompletedButton).toBeEnabled();

    await clearCompletedButton.click();
    await expect(todoItems).toHaveCount(0);
  });
});
