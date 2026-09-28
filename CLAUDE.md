# 여수과외 (yeosu-tutoring) — 작업 규칙

전라남도 여수시 지역 타겟 과외 사이트. 정적 사이트, 빌드 없음.
**호스팅은 Cloudflare Pages**(2026-09-21 이전). main 에 push 하면 `.github/workflows/deploy.yml` 이 GitHub Actions 에서 Cloudflare 로 직접 올린다(Direct Upload — Cloudflare 빌드 월 500회 제한과 무관).
- Cloudflare 대시보드에서 이 프로젝트를 "Connect to Git" 으로 다시 만들지 말 것. Direct Upload 타입은 바꿀 수 없다.
- 배포 실패는 GitHub 저장소 → Actions 탭에서 본다. 저장소는 지금 public(Actions 무제한). private 로 바꾸면 계정당 월 2,000분에서 차감.
- `*.md`·`tools/`·`CNAME` 은 사이트에 올라가지 않는다(내부 메모 보호).
- **사이트 안 주소는 `.html` 없이 쓴다** (`school/gumi-geumo-go`, `blog/글주소`, 홈은 `./`). Cloudflare 가 `/x.html` 을 `/x` 로 넘기기 때문 — 넘겨지는 주소가 canonical·sitemap 에 있으면 검색엔진이 싫어한다. 파일 이름은 그대로 `x.html`. 손으로 글을 쓸 때도 링크에 `.html` 을 붙이지 말 것(생성기를 다시 돌리면 자동으로 고쳐지긴 한다).
- `404.html` 이 있어야 없는 주소에 404 가 나간다. 지우지 말 것.
홈 `~/CLAUDE.md` 규칙을 그대로 따른다 (세션 하나 = 저장소 하나, 시작 때 pull, 끝날 때 commit+push, 작업로그 기록).

## 도메인 / 배포
- 도메인: **nadolesson.co.kr** (가비아, 2026-09-21 연결). `CNAME` 파일 있음 · 주소 `https://nadolesson.co.kr/`
- 도메인을 바꿀 때: `사이트관리/도구/지역과외/regions.js` 의 `domain` 을 고치고 재생성 → 사이트 안 주소(sitemap·canonical·og:url·robots)와 `CNAME` 이 같이 바뀐다. GitHub Pages 설정의 Custom domain 도 맞출 것
- 검색엔진 소유확인: 네이버 `` · 구글 `` — 홈 `<head>` 에 생성기가 넣는다(`regions.js` 의 `verify`). **`index.html` 에 손으로 넣지 말 것** — 재생성하면 사라진다. 코드를 바꾸려면 `verify` 를 고치고 재생성.
- GA4 측정 ID 미발급. `analytics.js` 의 `GA_ID` 가 비어 있어 지금은 아무것도 보내지 않는다. 발급하면 그 한 줄만 채우고 `사이트관리/사이트대장.md` 10절에 적는다.

## 이 사이트만의 구조
| 파일 | 내용 |
|---|---|
| `index.html` | 홈 (히어로 SVG = undefined 모티프) |
| `schools.html` | 여수 초·중·고 95곳 목록 + 검색 |
| `school/*.html` | **학교별 정적 페이지 95개** — SEO 의 핵심. 학교당 국어·영어·수학·사회·과학·코딩 키워드 |
| `teachers.html` | 선생님 (화상 673명 — 여수 방문 선생님이 0명이라 방문 관련 내용은 감춰져 있다) |
| `online.html` | 화상과외 안내 + 동네 목록 + "화상과외 선생님 N명" 단락(→ teachers). **메뉴에 '선생님'·'상담신청' 은 없다**(2026-09-22 구미 방식으로 11곳 통일: 선생님은 화상과외 하위, 상담신청은 우상단 버튼과 중복) |
| `아파트목록.md` | 데일리 글에 쓸 실재 확인된 아파트 단지. **생성기가 덮어쓰지 않는다** — 데일리 세션이 확인한 단지를 추가 |
| `blog.html` · `blog/*.html` | 데일리 글 |
| `teachers-data.js` | 선생님 데이터 (자동 생성 — 직접 고치지 말 것) |
| `데일리-키워드.md` | 데일리 글 주제 목록 (읍·면·동 × 과목, 학교 × 과목) |

## 절대 손으로 고치지 말 것
이 사이트 전체는 **생성기 출력**이다: `C:\Users\DOJIVERSE\사이트관리\도구\지역과외\`
- 디자인·문구·페이지 구조를 바꾸려면 → 생성기(`regions.js`/`css.js`/`build.js`)를 고치고 다시 생성
- 손으로 고친 뒤 재생성하면 **덮어써진다**
- 예외: `blog/` 안의 글과 `blog.html` 목록, `rss.xml`, `sitemap.xml` 은 재생성 시 **보존**한다 (생성기가 blog 폴더를 건드리지 않음)

## 글 올릴 때
1. `git pull`
2. `blog/<슬러그>.html` 작성 (기존 글 형식 그대로 복사해서 본문만 교체)
3. `tools/새글.js` 실행 → `blog.html`·`rss.xml`·`sitemap.xml` 갱신
4. `git add -A && git commit && git push`
5. `& "$env:USERPROFILE\사이트관리\로그기록.ps1" -Repo yeosu-tutoring -Status 완료 -What "글 N편"`

## 함정
- CSS/JS 를 고쳤으면 HTML 의 `?v=` 를 올린다 (전 사이트 공통 규칙 6). 생성기가 `style.css?v=1`·`app.js?v=1`·`teachers-data.js?v=1` 로 박아 둔다.
- 상담 폼은 **허브 Apps Script 공유**다. `form.js` 의 `SHEET_TAB = "지역과외"` — 오타가 나면 시트에 새 탭이 조용히 생긴다. 탭 이름을 바꾸려면 11개 사이트 전부 같이 바꿔야 한다.
- 학교 이름은 정식 명칭으로 쓴다 (홈 CLAUDE.md 규칙 10). 기존 페이지 주소는 고치지 않는다.

## 데일리 시간대 규칙 (2026-09-23부터, 전 사이트 공통)
- 매일 **10:00** 자동화가 이 저장소 `blog/` 에 지역 소식 2편을 올린다(공용 지시서 `사이트관리/데일리/지시서/지역과외.md`, 재탕 기록 `데일리-사용기록.md`, 단지 목록 `아파트목록.md`). **09:30~13:00 에는 커밋·push 하지 않는다** — 자동화와 같은 파일(blog.html·rss.xml·sitemap.xml)을 동시에 고치면 꼬인다.
- 그 외 시간에는 손으로 글을 추가로 올려도 된다. 글 규칙은 `데일리-키워드.md` 의 "데일리 글 2편 규칙" 과 같다. 시작 전 `git pull`, 끝나면 push 까지. 자동화는 손으로 올린 글과 무관하게 2편을 올린다.
- 자동화도 생성기(`run.js`)는 돌리지 않는다. 사이트 구조를 바꿀 일이 있으면 생성기를 고친 뒤 **13:00 이후에** 재생성한다.
