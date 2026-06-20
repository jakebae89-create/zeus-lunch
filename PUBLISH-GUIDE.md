# 제우스의 점심 — 플레이 스토어 출시 가이드 (무료 버전)

이 앱은 **PWA(웹앱)**입니다. 구글 플레이에는 PWA를 안드로이드 앱으로 감싸는
**TWA(Trusted Web Activity)** 방식으로 올립니다. 아래 순서대로 진행하면 됩니다.

---

## 0. 준비물 체크리스트

| 항목 | 상태 | 비고 |
|---|---|---|
| HTTPS로 배포된 PWA | 필요 | GitHub Pages 등 (아래 1단계) |
| 구글 플레이 개발자 계정 | 필요 | 최초 1회 **$25** 등록비 |
| 앱 아이콘 512×512 PNG | ✅ `icon-512.png` | 보유 |
| 매니페스트 | ✅ `manifest.webmanifest` | 보강 완료 |
| 개인정보처리방침 페이지 | ✅ `privacy.html` | **연락처 이메일만 채우면 됨** |
| Digital Asset Links | ⏳ `.well-known/assetlinks.json` | 서명키 지문 입력 필요(3단계) |
| 피처 그래픽 1024×500 | ❌ | 직접 제작 필요(5단계) |
| 스크린샷(폰) 2~8장 | ❌ | 실기기/에뮬레이터 캡처(5단계) |
| 스토어 등록 문구 | ✅ `store-listing-ko.md` | 복사해서 사용 |

---

## 1. PWA를 HTTPS에 배포

TWA는 실제 웹 주소를 그대로 띄우므로, 먼저 앱이 HTTPS 주소로 떠 있어야 합니다.

- 이 저장소를 GitHub Pages로 배포 (예: `https://<사용자>.github.io/zeus-lunch/`)
- 배포 후 아래가 정상 동작하는지 확인:
  - `https://.../zeus-lunch/index.html` (앱)
  - `https://.../zeus-lunch/manifest.webmanifest`
  - `https://.../zeus-lunch/privacy.html` (개인정보처리방침)
  - 서비스워커 등록 + 설치 배너 노출(설치형 PWA)

> ⚠️ **assetlinks.json 위치 주의**
> TWA 도메인 검증 파일은 반드시 **도메인 루트**에서 서비스돼야 합니다.
> 즉 `https://<사용자>.github.io/.well-known/assetlinks.json` (프로젝트 하위 경로가 아님).
> - GitHub Pages **프로젝트 페이지**(`/zeus-lunch/`)만 쓰면 루트에 파일을 둘 수 없습니다.
> - 해결책 중 하나:
>   1. 사용자 페이지 저장소(`<사용자>.github.io`)의 루트 `/.well-known/assetlinks.json`에 배치, 또는
>   2. **커스텀 도메인**을 연결해 그 도메인 루트에 배치.
> - 이 저장소의 `.well-known/assetlinks.json`은 **내용 템플릿**이며, 실제로는 도메인 루트로 옮겨야 합니다.

---

## 2. TWA(안드로이드 패키지) 만들기 — PWABuilder 추천

비개발자에게는 웹 UI인 **PWABuilder**가 가장 쉽습니다.

1. <https://www.pwabuilder.com> 접속 → 배포한 PWA 주소 입력 → **Start**
2. 매니페스트/서비스워커/보안 점검 결과 확인 (빨간 항목 있으면 보완)
3. **Package For Stores → Android(Google Play)** 선택
4. 패키지 옵션:
   - **Package ID(앱 패키지명)**: 예 `app.zeuslunch.twa` (한번 정하면 변경 불가, 고유해야 함)
   - **App name**: 제우스의 점심
   - **Signing key**: “Create new” 선택 시 PWABuilder가 키를 생성 → **반드시 키와 비밀번호를 안전하게 보관**
5. 다운로드되는 zip 안에:
   - `app-release-bundle.aab` ← 플레이 콘솔에 업로드할 파일
   - `assetlinks.json` ← 이 파일의 지문을 3단계에 사용
   - `signing.keystore` + 비밀번호 ← 분실 금지(업데이트 시 동일 키 필요)

> 대안(CLI 익숙하면): **Bubblewrap**
> ```
> npm i -g @bubblewrap/cli
> bubblewrap init --manifest https://<사용자>.github.io/zeus-lunch/manifest.webmanifest
> bubblewrap build
> ```

---

## 3. Digital Asset Links 연결

TWA가 주소창 없는 전체화면으로 뜨려면 도메인과 앱이 서로를 인증해야 합니다.

1. 2단계에서 받은 `assetlinks.json`(또는 플레이 콘솔의 **앱 서명 인증서 SHA-256 지문**)을 확인
2. 이 저장소의 `.well-known/assetlinks.json`에서 아래 두 값을 실제 값으로 교체
   - `package_name` → 정한 패키지명
   - `sha256_cert_fingerprints` → 서명키 SHA-256 지문
3. 그 파일을 **도메인 루트** `https://<도메인>/.well-known/assetlinks.json`로 배포 (1단계 주의 참고)
4. 검증: <https://developers.google.com/digital-asset-links/tools/generator> 에서 통과 확인

> 팁: 플레이 콘솔의 **Play 앱 서명**을 쓰면, 콘솔이 최종 서명키를 관리합니다.
> 이 경우 콘솔의 “앱 서명 키 인증서” SHA-256 지문을 assetlinks에 넣어야 합니다.

---

## 4. 플레이 콘솔에 업로드

1. <https://play.google.com/console> → 앱 만들기 → 무료(Free) 선택
2. **프로덕션 → 새 버전 만들기** → `app-release-bundle.aab` 업로드
3. 버전 이름/출시 노트 입력

---

## 5. 스토어 등록정보 & 정책 (필수 항목)

- **앱 이름**: 제우스의 점심
- **간단한 설명**(80자 이내) / **자세한 설명**(4000자 이내) → `store-listing-ko.md` 사용
- **앱 아이콘**: 512×512 (`icon-512.png` 사용 가능)
- **피처 그래픽**: 1024×500 PNG/JPG (직접 제작 — 번개 로고 + 앱 이름 권장)
- **스크린샷**: 폰 2~8장 (시작 화면, 식당 흩뿌림, 결과 모달, 퀴즈 화면 등)
  - 권장 비율 9:16, 최소 320px. 모바일 프리뷰로 캡처한 화면 활용 가능
- **카테고리**: 음식/식당 또는 라이프스타일
- **콘텐츠 등급(설문)**: 전체 이용가 예상
- **개인정보처리방침 URL**: `https://<도메인>/zeus-lunch/privacy.html`
- **데이터 보안(Data safety) 양식** (아래 6번)
- **광고 포함 여부**: 없음

---

## 6. 데이터 보안(Data Safety) 양식 작성 요령

플레이 콘솔이 묻는 항목 기준:

- **데이터 수집/공유**: 개발자는 수집하지 않음.
  단, **위치 정보가 제3자(카카오) API로 전송**됨 → “위치”를 **공유(shared)**로 표기,
  목적은 “앱 기능(주변 식당 검색)”.
- **데이터 암호화 전송**: 예(HTTPS)
- **데이터 삭제 요청 가능**: 앱 데이터 삭제/앱 제거로 로컬 데이터 삭제됨
- 광고/분석 식별자: 사용 안 함

> 위치 권한을 쓰므로, 등록정보에 **위치 사용 목적 설명**이 요구될 수 있습니다.
> “현재 위치 주변의 식당을 찾기 위해 사용하며, 거부 시 예시 데이터로 동작” 식으로 기재.

---

## 7. 출시 전 최종 점검

- [ ] PWA가 HTTPS에서 정상 + 설치 가능
- [ ] `privacy.html`의 연락처 이메일 입력 완료
- [ ] `assetlinks.json`이 도메인 루트에서 200으로 응답 + 지문 일치
- [ ] TWA 실행 시 주소창 없이 전체화면 (검증 성공 표시)
- [ ] 위치 권한 거부 시 더미 데이터로 정상 동작
- [ ] 스크린샷·피처 그래픽·설명·개인정보 URL 등록
- [ ] 데이터 보안 양식 제출
- [ ] 서명 키(keystore) + 비밀번호 안전하게 백업
