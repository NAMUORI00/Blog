# themes 폴더 - Hugo 테마 디렉토리

**작성일**: 2025-07-24  
**용도**: Hugo 사이트의 외관과 레이아웃을 정의하는 테마 파일들

## 📁 폴더 구조

```
themes/
└── github-style/                    # GitHub 스타일 테마
    ├── LICENSE                      # 테마 라이선스
    ├── README.md                    # 테마 문서
    ├── config.template.toml         # 테마 설정 템플릿
    ├── images/                      # 테마 스크린샷
    ├── archetypes/                  # 콘텐츠 아키타입
    ├── layouts/                     # HTML 템플릿
    │   ├── _default/               # 기본 레이아웃
    │   ├── partials/               # 재사용 가능한 컴포넌트
    │   ├── shortcodes/             # 숏코드 정의
    │   ├── 404.html               # 404 에러 페이지
    │   └── index.html             # 홈페이지 레이아웃
    └── static/                     # 정적 자산
        ├── css/                    # 스타일시트
        ├── js/                     # JavaScript 파일
        └── images/                 # 테마 이미지
```

## 🎨 GitHub Style 테마 특징

### 디자인 철학:
- **GitHub 마크다운 스타일**: GitHub의 렌더링과 동일한 디자인
- **미니멀리즘**: 깔끔하고 읽기 쉬운 인터페이스
- **다크 모드**: 자동/수동 테마 전환
- **반응형**: 모든 기기에서 최적화된 경험

### 핵심 기능:
1. **코드 하이라이팅**: GitHub 스타일 신택스 하이라이팅
2. **수학 표기**: LaTeX 수식 렌더링 지원
3. **목차**: 자동 생성되는 테이블 오브 컨텐츠
4. **검색**: 클라이언트 사이드 검색 기능
5. **댓글**: Gitalk 통합 댓글 시스템

## 🏗️ 레이아웃 구조

### 1. **_default/** - 기본 템플릿
```
_default/
├── baseof.html        # 기본 HTML 구조
├── single.html        # 단일 페이지 레이아웃
├── list.html          # 목록 페이지 레이아웃
└── index.json         # 검색 인덱스 JSON
```

### 2. **partials/** - 컴포넌트
```
partials/
├── head.html          # HTML <head> 섹션
├── header.html        # 사이트 헤더
├── footer.html        # 사이트 푸터
├── post.html          # 포스트 컴포넌트
├── gitalk.html        # Gitalk 댓글 위젯
├── search.html        # 검색 기능
├── menus.html         # 네비게이션 메뉴
├── user-profile.html  # 사용자 프로필
└── script.html        # JavaScript 로더
```

### 3. **shortcodes/** - 숏코드
```
shortcodes/
└── details.html       # 접을 수 있는 상세 정보 블록
```

## 🎯 주요 템플릿 분석

### **baseof.html** - 기본 레이아웃
```html
<!DOCTYPE html>
<html lang="{{ .Language.Lang }}">
<head>
  {{ partial "head.html" . }}
</head>
<body>
  {{ partial "header.html" . }}
  <main>
    {{ block "main" . }}{{ end }}
  </main>
  {{ partial "footer.html" . }}
  {{ partial "script.html" . }}
</body>
</html>
```

### **single.html** - 개별 포스트
```html
{{ define "main" }}
<article>
  {{ partial "post.html" . }}
  {{ if .Params.enableGitalk }}
    {{ partial "gitalk.html" . }}
  {{ end }}
</article>
{{ end }}
```

### **gitalk.html** - 댓글 시스템
```html
<div id="gitalk-container"></div>
<script>
  const gitalk = new Gitalk({
    clientID: '{{ .Site.Params.gitalk.clientID }}',
    clientSecret: '{{ .Site.Params.gitalk.clientSecret }}',
    repo: '{{ .Site.Params.gitalk.repo }}',
    owner: '{{ .Site.Params.gitalk.owner }}'
  });
  gitalk.render('gitalk-container');
</script>
```

## 💅 스타일링 시스템

### CSS 구조:
```
css/
├── github-style.css      # 메인 테마 스타일
├── light.css            # 라이트 모드
├── dark.css             # 다크 모드
├── toc.css              # 목차 스타일
├── syntax.css           # 코드 하이라이팅
├── github.min.css       # GitHub 마크다운 스타일
└── frameworks.min.css   # 외부 프레임워크 (CodeMirror 등)
```

### 주요 CSS 기능:
1. **CSS Variables**: 테마 색상 동적 변경
2. **Responsive Grid**: CSS Grid 기반 반응형 레이아웃
3. **Typography**: 읽기 쉬운 타이포그래피
4. **Animation**: 부드러운 전환 효과

## 🔧 JavaScript 기능

### 스크립트 구조:
```
js/
├── github-style.js      # 메인 테마 스크립트
├── theme-mode.js        # 다크/라이트 모드 전환
└── search.js           # 클라이언트 사이드 검색
```

### 주요 JavaScript 기능:
1. **테마 전환**: 다크/라이트 모드 토글
2. **검색**: 실시간 콘텐츠 검색
3. **목차**: 스크롤 기반 목차 하이라이팅
4. **이미지 최적화**: 지연 로딩 및 반응형 이미지

## 🌓 다크 모드 구현

### CSS Variables 활용:
```css
:root {
  --color-bg: #ffffff;
  --color-text: #24292e;
  --color-border: #e1e4e8;
}

[data-theme="dark"] {
  --color-bg: #0d1117;
  --color-text: #c9d1d9;
  --color-border: #30363d;
}
```

### JavaScript 토글:
```javascript
function toggleTheme() {
  const theme = document.documentElement.getAttribute('data-theme');
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}
```

## 🔍 검색 시스템

### 검색 인덱스 생성:
```json
// layouts/_default/index.json
[
  {{- range $index, $page := .Site.RegularPages -}}
  {{- if $index -}},{{- end -}}
  {
    "title": {{ $page.Title | jsonify }},
    "content": {{ $page.Plain | jsonify }},
    "url": {{ $page.Permalink | jsonify }},
    "date": {{ $page.Date.Format "2006-01-02" | jsonify }}
  }
  {{- end -}}
]
```

### 클라이언트 사이드 검색:
```javascript
// search.js
async function search(query) {
  const response = await fetch('/index.json');
  const pages = await response.json();
  return pages.filter(page => 
    page.title.toLowerCase().includes(query.toLowerCase()) ||
    page.content.toLowerCase().includes(query.toLowerCase())
  );
}
```

## 📱 반응형 디자인

### 브레이크포인트:
```css
/* Mobile First */
@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1200px) {
  /* Large Desktop */
}
```

### 모바일 최적화:
- 터치 친화적 네비게이션
- 읽기 최적화된 타이포그래피
- 빠른 로딩을 위한 이미지 최적화

## 🎨 커스터마이제이션

### 색상 시스템:
```css
/* 브랜드 색상 커스터마이징 */
:root {
  --color-primary: #0366d6;
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-danger: #dc3545;
}
```

### 폰트 설정:
```css
/* 타이포그래피 */
:root {
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  --font-family-mono: SFMono-Regular, Consolas, "Liberation Mono", Menlo;
}
```

## 🔧 개발 가이드

### 테마 수정 시 주의사항:
1. **원본 보존**: 테마 파일을 직접 수정하지 말고 layouts/ 폴더에서 오버라이드
2. **부분 수정**: partials를 활용하여 모듈식 수정
3. **버전 관리**: 테마 업데이트 시 커스터마이징 내용 보존

### 오버라이드 예시:
```
layouts/
├── partials/
│   └── custom-header.html    # 커스텀 헤더
└── _default/
    └── single.html          # 커스텀 단일 페이지 레이아웃
```

## 🚀 성능 최적화

### 최적화 기법:
1. **CSS 최소화**: 프로덕션에서 CSS 압축
2. **JavaScript 지연 로딩**: 중요하지 않은 스크립트 지연 로딩
3. **이미지 최적화**: WebP 형식 및 반응형 이미지
4. **폰트 최적화**: 폰트 디스플레이 최적화

### 성능 메트릭:
- **Lighthouse 점수**: 99/100 (모바일), 100/100 (데스크탑)
- **First Contentful Paint**: < 1.5초
- **Largest Contentful Paint**: < 2.5초

## 🛠️ 유지보수

### 정기 업데이트:
1. **테마 업데이트**: 보안 및 기능 개선
2. **의존성 업데이트**: JavaScript 라이브러리 업데이트
3. **브라우저 호환성**: 최신 브라우저 지원 확인

### 문제 해결:
- **브라우저 호환성**: Can I Use에서 CSS/JS 기능 확인
- **접근성**: WAVE, axe 도구로 접근성 검사
- **성능**: Lighthouse, PageSpeed Insights로 성능 측정