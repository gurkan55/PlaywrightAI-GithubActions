# Copilot Instructions for Playwright_Automation

## Project Overview
This is a Playwright-based end-to-end testing project for web applications. The workspace is organized for scalable test development and reporting.

## Key Directories & Files
- `tests/`: Main test specs. Subfolders (e.g., `demo/`) group related tests.
- `tests-examples/`: Example/specimen tests for reference.
- `playwright.config.js`: Central config for Playwright (test settings, browser options, etc.).
- `playwright-report/`: Auto-generated HTML reports after test runs.
- `test-results/`: Raw test result artifacts.
- `package.json`: Declares dependencies and scripts.

## Developer Workflows
- **Run all tests:**
  ```powershell
  npx playwright test
  ```
- **Run a specific test file:**
  ```powershell
  npx playwright test tests/my_first_test.spec.js
  ```
- **View HTML report:**
  Open `playwright-report/index.html` after a test run.
- **Debug tests:**
  Use Playwright's built-in debug mode:
  ```powershell
  npx playwright test --debug
  ```

## Patterns & Conventions
- Test files use `.spec.js` naming and are grouped by feature or demo.
- Use Playwright's test API (`test`, `expect`) for assertions and setup.
- Place reusable helpers in subfolders (e.g., `tests/demo/hello.js`).
- Keep config in `playwright.config.js` for easy global changes.
- Reports and results are auto-generated; do not edit them manually.

## Integration Points
- Relies on Playwright (see `package.json` for dependencies).
- No custom services or backend integration detected.
- Example tests in `tests-examples/` can be used as templates for new specs.

## Tips for AI Agents
- Always update or add tests in the `tests/` directory unless instructed otherwise.
- Reference `playwright.config.js` for environment or browser changes.
- Use existing test files as templates for structure and style.
- Do not modify auto-generated report or result files.

---
_If any section is unclear or missing important project-specific details, please provide feedback to improve these instructions._
