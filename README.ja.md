# Riverpod Jump to Provider

Riverpodプロバイダーの使用箇所から元の`.dart`ファイルの定義にジャンプできるVSCode拡張機能です。

## 機能

- プロバイダーの使用箇所（例：`settingScreenProvider`）から元の`.dart`ファイルの定義にジャンプ
- `Cmd+Click`（Mac）/ `Ctrl+Click`（Windows/Linux）と`Cmd+Shift+P` / `Ctrl+Shift+P`の両方のショートカットに対応
- 対応する`.g.dart`ファイルを自動的に検出し、`part of`ステートメントを使用して元の`.dart`ファイルを特定
- `@riverpod`と`@ProviderFor`の両方のアノテーションに対応

## 使い方

1. プロバイダーの使用箇所（例：`settingScreenProvider`）にカーソルを置きます
2. 以下のいずれかの方法で定義にジャンプします：
   - プロバイダー名を`Cmd+Click`（Mac）/ `Ctrl+Click`（Windows/Linux）する
   - `Cmd+Shift+P`（Mac）/ `Ctrl+Shift+P`（Windows/Linux）を押して「Go to Riverpod Declaration」と入力する

拡張機能は以下の処理を行います：
1. プロバイダー定義を含む`.g.dart`ファイルを検索
2. `.g.dart`ファイル内の`part of`ステートメントを検出
3. 元の`.dart`ファイルとクラス定義にジャンプ

## 例

```dart
// some_file.dart内
final someProvider = ref.watch(settingScreenProvider); // ここをCmd+Click

// setting_screen.g.dart内
part of 'setting_screen.dart';
@riverpod
class SettingScreen extends _$SettingScreen {
  // ...
}

// setting_screen.dart内
@riverpod
class SettingScreen extends _$SettingScreen {
  // ここにジャンプ
}
```

## 必要条件

- VSCode 1.60.0以上
- VSCode用Dart拡張機能

## 拡張機能の設定

この拡張機能は以下の設定を提供します：

* `riverpod-jump-to-provider.enableLogging`: デバッグ用のログを有効/無効にする

## 既知の問題

- プロバイダー名が標準的な命名規則（例：`nameProvider`）に従っていない場合、正しく動作しない可能性があります
- 拡張機能は`.g.dart`ファイル内の`part of`ステートメントに依存しているため、カスタムのコード生成設定では動作しない可能性があります

## リリースノート

### 0.0.3

- クラス定義ではなくプロバイダーの実装（関数定義）へのジャンプをサポート
- ジャンプ後のフォーカス動作を改善

### 0.0.2

- Cursorやその他のVSCodeベースのエディタとの互換性を向上させるため、VSCodeの最小バージョン要件を1.99.0から1.60.0に引き下げ

### 0.0.1

Riverpod Jump to Providerの初期リリース

## 貢献

貢献は大歓迎です！プルリクエストを自由に送信してください。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細はLICENSEファイルを参照してください。 