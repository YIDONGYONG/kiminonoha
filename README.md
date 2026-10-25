# 君の脳 (Kiminonoha) — 뇌 타입 진단

> 7개의 질문으로 나의 사고·행동 스타일을 4가지 동물 타입(치타·부엉이·코끼리·돌고래)으로 알려 주는 무료 진단 웹앱입니다.

## 1. 서비스 개요

- 질문 7개에 답하면 뇌 타입이 표시되고, 학습법·업무법·인간관계 팁을 확인할 수 있습니다.
- 결과 화면에서는 생일 파티 같은 축하 애니메이션(폭죽·색종이·풍선)이 나옵니다.
- 회원가입 없이 사용할 수 있고, 진단 결과는 브라우저(localStorage)에만 저장됩니다.

## 2. 목적

- RUNTEQ(ランテック) 수강생·수료생 커뮤니티에 **SNS로 공유**하기 위한 포트폴리오 겸 가벼운 진단 서비스입니다.
- 현재는 광고·수익화 없이 운영합니다.

## 3. 기술 스펙

| 구분 | 내용 |
|---|---|
| 언어 / 프레임워크 | Ruby 3.2.5 / Rails 7.2 |
| 프런트엔드 | Hotwire (Turbo + Stimulus), Tailwind CSS 4, esbuild |
| DB | MySQL 8.0 |
| 서버 | Puma (개발: Docker Compose / 배포: 무료 PaaS 예정) |
| 테스트 | Minitest (컨트롤러·모델), Brakeman, RuboCop |
| CI | GitHub Actions (보안 스캔 → 린트 → 테스트) |

## 4. 주요 페이지

| 경로 | 내용 |
|---|---|
| `/` | 뇌 타입 진단 (시작 → 질문 → 분석 → 결과) |
| `/types`, `/types/:id` | 4가지 타입 목록과 상세 해설 |
| `/guide` | 진단 방식과 활용법 |
| `/sitemap.xml`, `/robots.txt` | 검색 엔진용 |

## 5. 실행 방법

```bash
# 1. DB 실행 (Docker)
docker compose up -d db

# 2. 의존성 설치와 DB 준비
bundle install
npm install
DB_HOST=127.0.0.1 bin/rails db:prepare db:seed

# 3. 개발 서버 (Rails + JS/CSS 감시)
DB_HOST=127.0.0.1 bin/dev
```

개발 서버 기본 주소는 `http://localhost:3000` 입니다.

## 6. 테스트

```bash
DB_HOST=127.0.0.1 bin/rails test   # 테스트
bin/rubocop                        # 린트
bin/brakeman --no-pager            # 보안 스캔
```

## 7. 구조 메모

- 타입 해설 문장은 `config/brain_type_contents.yml`에서 관리합니다. `**강조**` 표기는 굵은 글씨로 변환됩니다.
- 질문·결과 데이터는 `db/seeds.rb`에 있습니다. 캐릭터 이미지는 `public/characters/*.svg` 입니다.
- 결과 계산과 축하 애니메이션은 `app/javascript/controllers/brain_quiz_controller.js` 입니다.

## 8. 알려진 과제

- 메인 비주얼(`app/assets/images/main-visual.jpg.png`)이 기존 애니메이션 포스터와 매우 비슷해, **공개 전에 직접 만든 이미지로 교체**해야 합니다.
- Ruby 3.2 / Rails 7.2는 지원이 종료되어 Brakeman의 EOL 경고를 `config/brakeman.yml`에서 일시적으로 건너뛰고 있습니다. 버전 업그레이드가 필요합니다.
- 무료 서버는 접속이 없으면 잠들 수 있어, 첫 접속이 느릴 수 있습니다.
