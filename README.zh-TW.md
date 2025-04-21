# Riverpod Jump to Provider

這是一個VSCode擴充功能，可以從Riverpod provider的使用位置跳轉到原始`.dart`檔案中的定義。

## 功能

- 從provider使用位置（例如：`settingScreenProvider`）跳轉到原始`.dart`檔案中的定義
- 同時支援`Cmd+Click`（Mac）/ `Ctrl+Click`（Windows/Linux）和`Cmd+Shift+P` / `Ctrl+Shift+P`快捷鍵
- 自動偵測對應的`.g.dart`檔案，並使用`part of`語句找到原始`.dart`檔案
- 支援`@riverpod`和`@ProviderFor`兩種註解

## 使用方法

1. 將游標放在provider使用位置（例如：`settingScreenProvider`）
2. 使用以下任一方法跳轉到定義：
   - 在provider名稱上使用`Cmd+Click`（Mac）/ `Ctrl+Click`（Windows/Linux）
   - 按`Cmd+Shift+P`（Mac）/ `Ctrl+Shift+P`（Windows/Linux）並輸入"Go to Riverpod Declaration"

擴充功能將執行以下操作：
1. 尋找包含provider定義的`.g.dart`檔案
2. 偵測`.g.dart`檔案中的`part of`語句
3. 跳轉到原始`.dart`檔案和類別定義

## 範例

```dart
// 在some_file.dart中
final someProvider = ref.watch(settingScreenProvider); // 在這裡Cmd+Click

// 在setting_screen.g.dart中
part of 'setting_screen.dart';
@riverpod
class SettingScreen extends _$SettingScreen {
  // ...
}

// 在setting_screen.dart中
@riverpod
class SettingScreen extends _$SettingScreen {
  // 跳轉到這裡
}
```

## 需求

- VSCode 1.60.0或更高版本
- VSCode的Dart擴充功能

## 擴充功能設定

此擴充功能提供以下設定：

* `riverpod-jump-to-provider.enableLogging`：啟用/停用除錯日誌

## 已知問題

- 如果provider名稱不遵循標準命名慣例（例如：`nameProvider`），擴充功能可能無法正常運作
- 擴充功能依賴於`.g.dart`檔案中的`part of`語句，因此可能無法與自訂程式碼生成設定一起使用

## 發行說明

### 0.0.2

- 將VSCode最低版本要求從1.99.0降低到1.60.0，以提高與Cursor和其他基於VSCode的編輯器的相容性

### 0.0.1

Riverpod Jump to Provider的初始版本

## 貢獻

歡迎貢獻！請隨時提交Pull Request。

## 授權

本專案根據MIT授權條款授權。詳情請參閱LICENSE檔案。 