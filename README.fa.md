# Riverpod Jump to Provider

یک افزونه VSCode که امکان پرش از محل استفاده Riverpod provider به تعریف آن در فایل `.dart` اصلی را فراهم می‌کند.

## ویژگی‌ها

- پرش از محل استفاده provider (مثلاً: `settingScreenProvider`) به تعریف آن در فایل `.dart` اصلی
- پشتیبانی از هر دو میانبر `Cmd+Click` (Mac) / `Ctrl+Click` (Windows/Linux) و `Cmd+Shift+P` / `Ctrl+Shift+P`
- تشخیص خودکار فایل `.g.dart` مربوطه و یافتن فایل `.dart` اصلی با استفاده از عبارت `part of`
- پشتیبانی از هر دو حاشیه‌نویسی `@riverpod` و `@ProviderFor`

## نحوه استفاده

1. مکان‌نما را در محل استفاده provider (مثلاً: `settingScreenProvider`) قرار دهید
2. از یکی از روش‌های زیر برای پرش به تعریف استفاده کنید:
   - روی نام provider `Cmd+Click` (Mac) / `Ctrl+Click` (Windows/Linux) کنید
   - `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux) را فشار دهید و "Go to Riverpod Declaration" را تایپ کنید

افزونه موارد زیر را انجام می‌دهد:
1. فایل `.g.dart` مربوطه که شامل تعریف provider است را پیدا می‌کند
2. عبارت `part of` را در فایل `.g.dart` تشخیص می‌دهد
3. به فایل `.dart` اصلی و تعریف کلاس پرش می‌کند

## مثال

```dart
// در some_file.dart
final someProvider = ref.watch(settingScreenProvider); // اینجا Cmd+Click کنید

// در setting_screen.g.dart
part of 'setting_screen.dart';
@riverpod
class SettingScreen extends _$SettingScreen {
  // ...
}

// در setting_screen.dart
@riverpod
class SettingScreen extends _$SettingScreen {
  // به اینجا پرش می‌کند
}
```

## نیازمندی‌ها

- VSCode 1.60.0 یا بالاتر
- افزونه Dart برای VSCode

## تنظیمات افزونه

این افزونه تنظیمات زیر را ارائه می‌دهد:

* `riverpod-jump-to-provider.enableLogging`: فعال/غیرفعال کردن ثبت رویدادها برای اشکال‌زدایی

## مشکلات شناخته شده

- اگر نام provider از قرارداد نامگذاری استاندارد (مثلاً: `nameProvider`) پیروی نکند، افزونه ممکن است به درستی کار نکند
- افزونه به عبارت `part of` در فایل‌های `.g.dart` وابسته است، بنابراین ممکن است با تنظیمات تولید کد سفارشی کار نکند

## یادداشت‌های انتشار

### 0.0.3

- پشتیبانی از پرش به پیاده‌سازی ارائه‌دهنده (تعریف تابع) به جای تعریف کلاس
- بهبود رفتار فوکوس پس از پرش

### 0.0.2

- کاهش نیاز به حداقل نسخه VSCode از 1.99.0 به 1.60.0 برای سازگاری بهتر با Cursor و سایر ویرایشگرهای مبتنی بر VSCode

### 0.0.1

نسخه اولیه Riverpod Jump to Provider

## مشارکت

مشارکت‌ها مورد استقبال قرار می‌گیرند! لطفاً Pull Request ارسال کنید.

## مجوز

این پروژه تحت مجوز MIT مجوز داده شده است. برای جزئیات بیشتر به فایل LICENSE مراجعه کنید. 