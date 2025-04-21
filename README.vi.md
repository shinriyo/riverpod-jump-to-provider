# Riverpod Jump to Provider

Tiện ích mở rộng VSCode cho phép nhảy từ nơi sử dụng Riverpod provider đến định nghĩa của nó trong file `.dart` gốc.

## Tính năng

- Nhảy từ nơi sử dụng provider (ví dụ: `settingScreenProvider`) đến định nghĩa của nó trong file `.dart` gốc
- Hoạt động với cả phím tắt `Cmd+Click` (Mac) / `Ctrl+Click` (Windows/Linux) và `Cmd+Shift+P` / `Ctrl+Shift+P`
- Tự động phát hiện file `.g.dart` tương ứng và tìm file `.dart` gốc bằng cách sử dụng câu lệnh `part of`
- Hỗ trợ cả chú thích `@riverpod` và `@ProviderFor`

## Cách sử dụng

1. Đặt con trỏ tại nơi sử dụng provider (ví dụ: `settingScreenProvider`)
2. Sử dụng một trong các phương pháp sau để nhảy đến định nghĩa:
   - `Cmd+Click` (Mac) / `Ctrl+Click` (Windows/Linux) vào tên provider
   - Nhấn `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux) và gõ "Go to Riverpod Declaration"

Tiện ích mở rộng sẽ:
1. Tìm file `.g.dart` tương ứng chứa định nghĩa provider
2. Phát hiện câu lệnh `part of` trong file `.g.dart`
3. Nhảy đến file `.dart` gốc và định nghĩa lớp

## Ví dụ

```dart
// Trong some_file.dart
final someProvider = ref.watch(settingScreenProvider); // Cmd+Click tại đây

// Trong setting_screen.g.dart
part of 'setting_screen.dart';
@riverpod
class SettingScreen extends _$SettingScreen {
  // ...
}

// Trong setting_screen.dart
@riverpod
class SettingScreen extends _$SettingScreen {
  // Nhảy đến đây
}
```

## Yêu cầu

- VSCode 1.60.0 trở lên
- Tiện ích mở rộng Dart cho VSCode

## Cài đặt tiện ích mở rộng

Tiện ích mở rộng này cung cấp các cài đặt sau:

* `riverpod-jump-to-provider.enableLogging`: Bật/tắt ghi log để gỡ lỗi

## Vấn đề đã biết

- Tiện ích mở rộng có thể không hoạt động chính xác nếu tên provider không tuân theo quy ước đặt tên tiêu chuẩn (ví dụ: `nameProvider`)
- Tiện ích mở rộng phụ thuộc vào câu lệnh `part of` trong file `.g.dart`, vì vậy có thể không hoạt động với các thiết lập tạo mã tùy chỉnh

## Ghi chú phát hành

### 0.0.2

- Giảm yêu cầu phiên bản VSCode tối thiểu từ 1.99.0 xuống 1.60.0 để tăng khả năng tương thích với Cursor và các trình soạn thảo dựa trên VSCode khác

### 0.0.1

Phiên bản đầu tiên của Riverpod Jump to Provider

## Đóng góp

Đóng góp rất được hoan nghênh! Vui lòng gửi Pull Request.

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem file LICENSE để biết chi tiết. 