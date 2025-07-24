# config 폴더 - Hugo 설정 디렉토리

**작성일**: 2025-07-24  
**용도**: Hugo 사이트의 모든 설정 파일을 체계적으로 관리하는 디렉토리

## 📁 폴더 구조

```
config/
├── _default/                    # 기본 설정
│   ├── config.toml             # 메인 사이트 설정
│   ├── params.toml             # 사이트 매개변수
│   ├── markup.toml             # 마크다운 처리 설정
│   └── permalinks.toml         # URL 구조 설정
└── DoIt/                       # DoIt 테마별 설정
    ├── config.toml             # 테마 기본 설정
    ├── params.toml             # 테마 매개변수
    ├── languages.toml          # 다국어 설정
    ├── markup.toml             # 테마별 마크다운 설정
    ├── outputs.toml            # 출력 형식 설정
    ├── outputFormats.toml      # 커스텀 출력 형식
    ├── mediaTypes.toml         # 미디어 타입 정의
    ├── taxonomies.toml         # 분류 체계 설정
    ├── sitemap.toml           # 사이트맵 설정
    ├── privacy.toml           # 프라이버시 설정
    └── pagination.toml        # 페이지네이션 설정
```

## 🔑 주요 설정 파일

### 1. **_default/config.toml** - 메인 사이트 설정
```toml
baseURL = "https://blog.namuori.net"
languageCode = "en-us"
title = "나무오리"
theme = "github-style"

pygmentsCodeFences = true
pygmentsUseClasses = true

[params]
  author = "Kim Yu Seok"
  github = "NAMUORI00"
  Description = "I love github fork"
  
  # 🚨 보안 경고: 하드코딩된 GitHub OAuth Secret
  [params.gitalk]
    clientSecret = "3e352ec30f7c6151f1770788253577ffbd7ee70e"  # 환경변수로 이동 필요!
```

### 2. **DoIt/params.toml** - 테마 세부 설정
테마별 고급 기능 설정:
- 검색 엔진 통합 (Algolia, Fuse.js)
- 소셜 미디어 연동
- 댓글 시스템 (다양한 서비스 지원)
- 지도 서비스 (Mapbox) 통합
- 분석 도구 연동

### 3. **DoIt/languages.toml** - 다국어 지원
```toml
[en]
  weight = 1
  languageCode = "en"
  languageName = "English"
  hasCJKLanguage = false
  
[zh-cn]
  weight = 2
  languageCode = "zh-CN"
  languageName = "简体中文"
  hasCJKLanguage = true
```

## 🎨 테마 설정 (GitHub Style)

### 테마 특징:
- **GitHub 스타일**: GitHub의 마크다운 렌더링과 유사한 디자인
- **다크 모드**: 자동/수동 테마 전환 지원
- **반응형**: 모바일 친화적 레이아웃
- **Gitalk 댓글**: GitHub Issues 기반 댓글 시스템

### 설정된 기능:
```toml
# 기본 설정
headerIcon = "/images/github-mark.svg"
avatar = "https://avatars.githubusercontent.com/u/46620366"
favicon = "/images/favicon.svg"

# Gitalk 댓글 시스템
enableGitalk = true
[params.gitalk]
  repo = "Blog-comment"
  owner = "NAMUORI00"
  createIssueManually = true
```

## 🔧 Hugo 기능 설정

### 1. **마크다운 처리** (markup.toml)
```toml
[goldmark]
  [goldmark.renderer]
    unsafe = true  # HTML 태그 허용
  [goldmark.parser]
    [goldmark.parser.attribute]
      block = true
      title = true
```

### 2. **코드 하이라이팅**
```toml
pygmentsCodeFences = true
pygmentsUseClasses = true
pygmentsStyle = "github"
```

### 3. **URL 구조** (permalinks.toml)
```toml
posts = "/:year/:month/:title/"
```

## 🌐 다국어 및 국제화

### 지원 언어:
- **영어** (en): 기본 언어
- **중국어** (zh-cn): 간체 중국어 지원

### 언어별 설정:
- 검색 엔진 설정
- 소셜 미디어 링크
- 사이트 메타데이터
- 날짜 형식

## 📊 SEO 및 분석 설정

### 1. **사이트맵** (sitemap.toml)
```toml
changefreq = "weekly"
priority = 0.5
filename = "sitemap.xml"
```

### 2. **분석 도구**
- Google Analytics 지원
- Cloudflare Analytics 준비
- 커스텀 분석 스크립트 지원

### 3. **소셜 미디어**
- Open Graph 메타 태그
- Twitter Cards
- 소셜 미디어 공유 최적화

## 🔍 검색 기능

### 지원하는 검색 엔진:
1. **Algolia**: 클라우드 기반 전문 검색
2. **Fuse.js**: 클라이언트 사이드 퍼지 검색
3. **Lunr**: 정적 사이트용 검색 인덱스

### 설정 예시:
```toml
[en.params.search.algolia]
  appID = "5YGRNRQK1G"
  searchKey = "0ff6874805de24b84aa1d5ebccad56cd"
```

## 💬 댓글 시스템

### Gitalk 설정:
- **GitHub Issues 연동**: 각 포스트가 GitHub Issue로 생성
- **OAuth 인증**: GitHub 계정으로 댓글 작성
- **관리자 모드**: 이슈 수동 생성 옵션

### 다른 댓글 시스템 지원:
- Disqus
- Valine
- Waline
- Utterances

## 🚨 보안 권장사항

### 즉시 수정 필요:
1. **GitHub OAuth Secret 이동**:
   ```bash
   # 환경 변수로 설정
   export GITHUB_CLIENT_SECRET="your-secret"
   ```

2. **설정 파일 수정**:
   ```toml
   [params.gitalk]
     clientSecret = "${GITHUB_CLIENT_SECRET}"  # 환경변수 참조
   ```

3. **민감한 API 키들**:
   - Mapbox Access Token
   - 검색 엔진 API 키
   - 분석 도구 키

## 📱 모바일 최적화

### 반응형 설정:
- 뷰포트 메타 태그 자동 생성
- 모바일 친화적 네비게이션
- 터치 친화적 인터페이스

### PWA 지원:
```toml
[params.app]
  title = "나무오리 블로그"
  noFavicon = false
  svgFavicon = "/images/favicon.svg"
  themeColor = "#ffffff"
```

## 🔄 콘텐츠 마운트 설정

### Hugo Mounts:
```toml
[[module.mounts]]
source = "content/About-218dcd44779f81169bcedf9476baf73b.md"
target = "content/readme.md"

[[module.mounts]]
source = "content/posts"
target = "content/post"
```

## ⚡ 성능 최적화

### 번들링 설정:
```toml
# 현재 비활성화 - 성능 향상을 위해 활성화 권장
bundle = false  # true로 변경 권장
```

### 캐싱 전략:
- 정적 자산 장기 캐싱
- CDN 최적화 설정
- 이미지 지연 로딩

## 🛠️ 개발 환경

### 로컬 개발 설정:
```bash
# 개발 서버 실행
hugo server -D --disableFastRender --noHTTPCache

# 빌드
hugo build --minify
```

### 환경별 설정:
- `_default/`: 공통 설정
- `production/`: 프로덕션 전용 설정
- `development/`: 개발 전용 설정

## 📝 설정 관리 팁

1. **버전 관리**: 모든 설정 파일을 Git으로 추적
2. **백업**: 중요한 설정은 별도 백업
3. **문서화**: 설정 변경 시 이유와 날짜 기록
4. **테스트**: 설정 변경 후 로컬에서 테스트
5. **환경 분리**: 개발/프로덕션 환경 설정 분리