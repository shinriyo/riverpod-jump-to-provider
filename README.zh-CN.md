# Riverpod Jump to Provider

这是一个VSCode扩展，可以从Riverpod provider的使用位置跳转到原始`.dart`文件中的定义。

## 功能

- 从provider使用位置（例如：`settingScreenProvider`）跳转到原始`.dart`文件中的定义
- 同时支持`Cmd+Click`（Mac）/ `Ctrl+Click`（Windows/Linux）和`Cmd+Shift+P` / `Ctrl+Shift+P`快捷键
- 自动检测对应的`.g.dart`文件，并使用`part of`语句找到原始`.dart`文件
- 支持`@riverpod`和`@ProviderFor`两种注解

## 使用方法

1. 将光标放在provider使用位置（例如：`settingScreenProvider`）
2. 使用以下任一方法跳转到定义：
   - 在provider名称上使用`Cmd+Click`（Mac）/ `Ctrl+Click`（Windows/Linux）
   - 按`Cmd+Shift+P`（Mac）/ `Ctrl+Shift+P`（Windows/Linux）并输入"Go to Riverpod Declaration"

扩展将执行以下操作：
1. 查找包含provider定义的`.g.dart`文件
2. 检测`.g.dart`文件中的`part of`语句
3. 跳转到原始`.dart`文件和类定义

## 示例

```dart
// 在some_file.dart中
final someProvider = ref.watch(settingScreenProvider); // 在这里Cmd+Click

// 在setting_screen.g.dart中
part of 'setting_screen.dart';
@riverpod
class SettingScreen extends _$SettingScreen {
  // ...
}

// 在setting_screen.dart中
@riverpod
class SettingScreen extends _$SettingScreen {
  // 跳转到这里
}
```

## 要求

- VSCode 1.60.0或更高版本
- VSCode的Dart扩展

## 扩展设置

此扩展提供以下设置：

* `riverpod-jump-to-provider.enableLogging`：启用/禁用调试日志

## 已知问题

- 如果provider名称不遵循标准命名约定（例如：`nameProvider`），扩展可能无法正常工作
- 扩展依赖于`.g.dart`文件中的`part of`语句，因此可能无法与自定义代码生成设置一起使用

## 发行说明

### 0.0.2

- 将VSCode最低版本要求从1.99.0降低到1.60.0，以提高与Cursor和其他基于VSCode的编辑器的兼容性

### 0.0.1

Riverpod Jump to Provider的初始版本

## 贡献

欢迎贡献！请随时提交Pull Request。

## 许可证

本项目根据MIT许可证授权。详情请参阅LICENSE文件。 