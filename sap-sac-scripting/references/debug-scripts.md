# Debugging Scripts (2025.23)

Source: `help-portal-704272da511143d686ca6949040b9a68.md`.

## Locate scripts in browser devtools
- Run the app once, open **Sources** in Chrome DevTools.
- Search `Ctrl+P` for files named `<WIDGET_NAME>.<FUNCTION_NAME>.js` inside folder `<APPLICATION_NAME>` under `sandbox.worker.main...`.
- `onInitialization` scripts use widget name `Application`.

## Breakpoints
- Add breakpoints on line numbers in DevTools; blue marker indicates active breakpoint.
- Multiple breakpoints allowed; click to remove.

## Debug mode
- Add `debugger;` statements in scripts.
- Launch app with URL parameter `debug=true` to pause automatically at those statements:
  `[https://<TENANT>/.../application/<APP_ID>/?mode=present&debug=true`](https://<TENANT>/.../application/<APP_ID>/?mode=present&debug=true`)
- Comments are preserved in transformed JS to aid identification.

