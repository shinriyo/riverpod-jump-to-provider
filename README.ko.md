# Riverpod Jump to Provider

Riverpod provider 사용 위치에서 원본 `.dart` 파일의 정의로 이동할 수 있는 VSCode 확장 프로그램입니다.

## 기능

- provider 사용 위치(예: `settingScreenProvider`)에서 원본 `.dart` 파일의 정의로 이동
- `Cmd+Click`(Mac) / `Ctrl+Click`(Windows/Linux)와 `Cmd+Shift+P` / `Ctrl+Shift+P` 단축키 모두 지원
- 해당 `.g.dart` 파일을 자동으로 감지하고 `part of` 문을 사용하여 원본 `.dart` 파일을 찾음
- `@riverpod`와 `@ProviderFor` 주석 모두 지원

## 사용 방법

1. provider 사용 위치(예: `settingScreenProvider`)에 커서를 놓습니다
2. 다음 방법 중 하나로 정의로 이동합니다:
   - provider 이름을 `Cmd+Click`(Mac) / `Ctrl+Click`(Windows/Linux)합니다
   - `Cmd+Shift+P`(Mac) / `Ctrl+Shift+P`(Windows/Linux)를 누르고 "Go to Riverpod Declaration"을 입력합니다

확장 프로그램은 다음 작업을 수행합니다:
1. provider 정의가 포함된 `.g.dart` 파일을 찾습니다
2. `.g.dart` 파일에서 `part of` 문을 감지합니다
3. 원본 `.dart` 파일과 클래스 정의로 이동합니다

## 예시

```dart
// some_file.dart에서
final someProvider = ref.watch(settingScreenProvider); // 여기서 Cmd+Click

// setting_screen.g.dart에서
part of 'setting_screen.dart';
@riverpod
class SettingScreen extends _$SettingScreen {
  // ...
}

// setting_screen.dart에서
@riverpod
class SettingScreen extends _$SettingScreen {
  // 여기로 이동
}
```

## 요구사항

- VSCode 1.60.0 이상
- VSCode용 Dart 확장 프로그램

## 확장 프로그램 설정

이 확장 프로그램은 다음 설정을 제공합니다:

* `riverpod-jump-to-provider.enableLogging`: 디버깅을 위한 로깅 활성화/비활성화

## 알려진 문제

- provider 이름이 표준 명명 규칙(예: `nameProvider`)을 따르지 않는 경우 제대로 작동하지 않을 수 있습니다
- 확장 프로그램은 `.g.dart` 파일의 `part of` 문에 의존하므로 사용자 정의 코드 생성 설정에서는 작동하지 않을 수 있습니다

## 릴리스 노트

### 0.0.2

- Cursor 및 기타 VSCode 기반 편집기와의 호환성을 높이기 위해 VSCode 최소 버전 요구사항을 1.99.0에서 1.60.0으로 낮춤

### 0.0.1

Riverpod Jump to Provider의 초기 릴리스

## 기여

기여는 환영합니다! 자유롭게 Pull Request를 보내주세요.

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다. 자세한 내용은 LICENSE 파일을 참조하세요. 