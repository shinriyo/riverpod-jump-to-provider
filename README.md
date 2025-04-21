# Riverpod Jump to Provider

VSCode extension that enables jumping from a Riverpod provider usage to its definition in the original `.dart` file.

## Features

- Jump from a provider usage (e.g., `settingScreenProvider`) to its definition in the original `.dart` file
- Works with both `Cmd+Click` (Mac) / `Ctrl+Click` (Windows/Linux) and `Cmd+Shift+P` / `Ctrl+Shift+P` shortcuts
- Automatically detects the corresponding `.g.dart` file and finds the original `.dart` file using the `part of` statement
- Supports both `@riverpod` and `@ProviderFor` annotations

## Usage

1. Place your cursor on a provider usage (e.g., `settingScreenProvider`)
2. Use one of the following methods to jump to the definition:
   - `Cmd+Click` (Mac) / `Ctrl+Click` (Windows/Linux) on the provider name
   - Press `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux) and type "Go to Riverpod Declaration"

The extension will:
1. Find the corresponding `.g.dart` file that contains the provider definition
2. Detect the `part of` statement in the `.g.dart` file
3. Jump to the original `.dart` file and the class definition

## Example

```dart
// In some_file.dart
final someProvider = ref.watch(settingScreenProvider); // Cmd+Click here

// In setting_screen.g.dart
part of 'setting_screen.dart';
@riverpod
class SettingScreen extends _$SettingScreen {
  // ...
}

// In setting_screen.dart
@riverpod
class SettingScreen extends _$SettingScreen {
  // Jumps here
}
```

## Requirements

- VSCode 1.60.0 or higher
- Dart extension for VSCode

## Extension Settings

This extension contributes the following settings:

* `riverpod-jump-to-provider.enableLogging`: Enable/disable logging for debugging

## Known Issues

- The extension may not work correctly if the provider name does not follow the standard naming convention (e.g., `nameProvider`)
- The extension relies on the `part of` statement in `.g.dart` files, so it may not work with custom code generation setups

## Release Notes

### 0.0.2

- Lowered the minimum VSCode version requirement from 1.99.0 to 1.60.0 for better compatibility with Cursor and other VSCode-based editors

### 0.0.1

Initial release of Riverpod Jump to Provider

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
