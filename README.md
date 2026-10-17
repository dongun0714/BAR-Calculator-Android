# BAR 생산 계산기 — Android APK

이 프로젝트는 네트워크 접속 권한이 없는 오프라인 Android 앱입니다. 계산기 HTML/CSS/JS 파일이 앱에 내장되어 있습니다.

## GitHub에서 APK 만들기

1. GitHub에서 **새 저장소**를 만듭니다 (예: `BAR-Calculator-Android`).
2. 이 ZIP을 풀어 **안의 모든 파일/폴더**를 새 저장소 최상위에 업로드합니다. `.github/workflows/build-android-apk.yml`도 포함하세요.
3. **Actions → Build Android APK → Run workflow**로 실행합니다.
4. 초록 체크 후 실행 기록 **Summary → Artifacts → BAR-Calculator-Android-APK** 다운로드.
5. ZIP을 풀면 `app-debug.apk`가 있습니다. Android 휴대폰에서 열어 설치합니다.

이 APK는 개발/개인 테스트용 **디버그 서명 APK**입니다. Play Store 배포용 정식 출시 파일과는 다르며, 일반 사용자에게 공개 배포하려면 서명 키 보관과 정식 릴리스 서명 절차를 권장합니다.

Android에서 '알 수 없는 앱 설치'를 허용해야 할 수 있습니다. 본인이 빌드한 APK만 설치하세요.

## 기능

- 1BAR 시트 수 = 2×S2+3×S3
- 완성 BAR = 전체 시트 ÷ 1BAR 시트 수의 내림
- S2/S3 총개수, 사용 시트, 잔여 시트 자동 계산
- 인터넷이나 데이터 없이 실행 가능 (INTERNET 권한 없음)
- 결과 복사 및 초기화

참고: 실제 Android 기기 빌드는 GitHub Actions에서 수행하며 이 프로젝트 패키지는 소스 코드입니다.
