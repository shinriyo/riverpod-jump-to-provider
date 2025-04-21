# Riverpod Jump to Provider

Riverpod provider istifadə yerindən orijinal `.dart` faylındakı tərifə keçməyə imkan verən VSCode genişlənməsidir.

## Xüsusiyyətlər

- Provider istifadə yerindən (məsələn: `settingScreenProvider`) orijinal `.dart` faylındakı tərifə keçmə
- Həm `Cmd+Click` (Mac) / `Ctrl+Click` (Windows/Linux), həm də `Cmd+Shift+P` / `Ctrl+Shift+P` qısayollarını dəstəkləyir
- Uyğun `.g.dart` faylını avtomatik aşkarlayır və `part of` ifadəsindən istifadə edərək orijinal `.dart` faylını tapır
- Həm `@riverpod`, həm də `@ProviderFor` annotasiyalarını dəstəkləyir

## İstifadə qaydası

1. Kursoru provider istifadə yerinə (məsələn: `settingScreenProvider`) yerləşdirin
2. Tərifə keçmək üçün aşağıdakı üsullardan birini istifadə edin:
   - Provider adına `Cmd+Click` (Mac) / `Ctrl+Click` (Windows/Linux) edin
   - `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux) düyməsini basın və "Go to Riverpod Declaration" yazın

Genişlənmə aşağıdakı əməliyyatları yerinə yetirir:
1. Provider tərifini ehtiva edən `.g.dart` faylını tapır
2. `.g.dart` faylında `part of` ifadəsini aşkarlayır
3. Orijinal `.dart` faylına və sinif tərifinə keçir

## Nümunə

```dart
// some_file.dart faylında
final someProvider = ref.watch(settingScreenProvider); // Burada Cmd+Click edin

// setting_screen.g.dart faylında
part of 'setting_screen.dart';
@riverpod
class SettingScreen extends _$SettingScreen {
  // ...
}

// setting_screen.dart faylında
@riverpod
class SettingScreen extends _$SettingScreen {
  // Buraya keçir
}
```

## Tələblər

- VSCode 1.60.0 və ya daha yüksək versiya
- VSCode üçün Dart genişlənməsi

## Genişlənmə parametrləri

Bu genişlənmə aşağıdakı parametrləri təqdim edir:

* `riverpod-jump-to-provider.enableLogging`: Debugging üçün logları aktiv/deaktiv edir

## Məlum problemlər

- Əgər provider adı standart adlandırma qaydasına (məsələn: `nameProvider`) uyğun deyilsə, genişlənmə düzgün işləməyə bilər
- Genişlənmə `.g.dart` fayllarındakı `part of` ifadəsinə güvənir, buna görə də xüsusi kod yaradılması parametrləri ilə işləməyə bilər

## Buraxılış qeydləri

### 0.0.2

- Cursor və digər VSCode əsaslı redaktorlarla uyğunluğu artırmaq üçün VSCode minimum versiya tələbini 1.99.0-dan 1.60.0-a endirdi

### 0.0.1

Riverpod Jump to Provider-in ilk buraxılışı

## Töhfə

Töhfələr xoş qarşılanır! Zəhmət olmasa Pull Request göndərin.

## Lisenziya

Bu layihə MIT lisenziyası altında lisenziyalanıb. Ətraflı məlumat üçün LICENSE faylına baxın. 