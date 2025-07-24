# layouts 폴더 - 사용자 정의 레이아웃

**작성일**: 2025-07-24  
**용도**: 테마의 기본 레이아웃을 오버라이드하거나 확장하는 사용자 정의 템플릿

## 📁 폴더 구조

```
layouts/
└── shortcodes/                    # 사용자 정의 숏코드
    ├── notion-unsupported-block.html  # Notion 미지원 블록 처리
    └── math.html                      # 수학 표기 렌더링
```

## 🔧 Hugo 레이아웃 시스템

### 레이아웃 우선순위:
1. **layouts/** (프로젝트 루트) ← **최우선**
2. **themes/github-style/layouts/** (테마)
3. Hugo 기본 레이아웃

### 오버라이드 원리:
- 프로젝트의 `layouts/` 폴더가 테마 레이아웃보다 우선
- 부분적 커스터마이징을 통해 테마 업데이트 시에도 변경사항 유지
- 테마 파일을 직접 수정하지 않고 확장 가능

## 🎯 Shortcodes (숏코드)

### 1. **notion-unsupported-block.html**
Notion에서 지원하지 않는 블록 타입을 처리하는 숏코드입니다.

#### 사용법:
```markdown
{{< notion-unsupported-block type="toggle" >}}
```

#### 구현 예시:
```html
<!-- layouts/shortcodes/notion-unsupported-block.html -->
<div class="notion-unsupported-block" data-type="{{ .Get "type" }}">
  <div class="alert alert-warning">
    <strong>미지원 Notion 블록:</strong> {{ .Get "type" }}
    <p>이 블록 타입은 현재 지원되지 않습니다.</p>
  </div>
</div>
```

#### 처리되는 블록 타입:
- `toggle` - 접을 수 있는 토글 블록
- `column_list` - 다단 레이아웃
- `synced_block` - 동기화된 블록
- `table_of_contents` - 목차
- `breadcrumb` - 브레드크럼
- `link_preview` - 링크 미리보기

### 2. **math.html**
LaTeX 수식을 렌더링하는 숏코드입니다.

#### 사용법:
```markdown
{{< math >}}
E = mc^2
{{< /math >}}

{{< math display="block" >}}
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
{{< /math >}}
```

#### 구현 예시:
```html
<!-- layouts/shortcodes/math.html -->
{{ $display := .Get "display" | default "inline" }}
{{ if eq $display "block" }}
  <div class="math-block">
    $${{ .Inner | safeHTML }}$$
  </div>
{{ else }}
  <span class="math-inline">
    ${{ .Inner | safeHTML }}$
  </span>
{{ end }}
```

## 🔗 Notion 통합

### Notion → Hugo 변환 과정:
1. **Notion API**: 블록 데이터 추출
2. **notion-to-md**: 마크다운 변환
3. **Unsupported 처리**: 미지원 블록을 숏코드로 변환
4. **Hugo 렌더링**: 숏코드를 HTML로 변환

### 변환 예시:
```javascript
// src/markdown/notion-to-md.ts
n2m.setUnsupportedTransformer((type) => {
  return `{{< notion-unsupported-block type=${type} >}}`;
});
```

## 🎨 CSS 스타일링

### 미지원 블록 스타일:
```css
.notion-unsupported-block {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px dashed #ccc;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.notion-unsupported-block .alert {
  margin: 0;
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeaa7;
}
```

### 수학 표기 스타일:
```css
.math-block {
  margin: 1rem 0;
  text-align: center;
  overflow-x: auto;
}

.math-inline {
  display: inline;
  margin: 0 0.2rem;
}

/* KaTeX 스타일 오버라이드 */
.katex {
  font-size: 1.1em;
}
```

## 📚 MathJax/KaTeX 통합

### KaTeX 설정:
```html
<!-- layouts/partials/head.html에 추가 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/contrib/auto-render.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "$", right: "$", display: false}
    ]
  });
});
</script>
```

## 🔧 사용자 정의 레이아웃 확장

### 추가 가능한 레이아웃:
```
layouts/
├── _default/
│   ├── single.html        # 개별 포스트 커스터마이징
│   └── list.html         # 목록 페이지 커스터마이징
├── partials/
│   ├── custom-head.html   # 추가 <head> 콘텐츠
│   ├── analytics.html     # 분석 스크립트
│   └── custom-footer.html # 커스텀 푸터
└── shortcodes/
    ├── youtube.html       # YouTube 임베드
    ├── twitter.html       # 트위터 임베드
    └── codepen.html       # CodePen 임베드
```

### YouTube 숏코드 예시:
```html
<!-- layouts/shortcodes/youtube.html -->
<div class="youtube-embed">
  <iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/{{ .Get 0 }}" 
    frameborder="0" 
    allowfullscreen>
  </iframe>
</div>
```

## 🎯 Notion 블록 확장

### 지원 가능한 추가 블록:
1. **Toggle 블록**:
   ```html
   <!-- layouts/shortcodes/toggle.html -->
   <details class="notion-toggle">
     <summary>{{ .Get "title" }}</summary>
     <div class="toggle-content">
       {{ .Inner | markdownify }}
     </div>
   </details>
   ```

2. **다단 레이아웃**:
   ```html
   <!-- layouts/shortcodes/columns.html -->
   <div class="notion-columns" style="display: grid; grid-template-columns: repeat({{ .Get "count" }}, 1fr); gap: 1rem;">
     {{ .Inner | markdownify }}
   </div>
   ```

3. **콜아웃 블록**:
   ```html
   <!-- layouts/shortcodes/callout.html -->
   <div class="notion-callout callout-{{ .Get "type" }}">
     <div class="callout-icon">{{ .Get "icon" }}</div>
     <div class="callout-content">{{ .Inner | markdownify }}</div>
   </div>
   ```

## 🔍 디버깅 및 개발

### 템플릿 디버깅:
```html
<!-- 변수 출력 -->
{{ printf "%#v" .Params }}

<!-- 조건부 렌더링 -->
{{ if .Site.Params.debug }}
  <pre>{{ jsonify (dict "indent" "  ") . }}</pre>
{{ end }}
```

### 개발 모드 설정:
```toml
# config.toml
[params]
  debug = true  # 개발 시에만 활성화
```

## 📱 반응형 숏코드

### 반응형 임베드:
```html
<!-- layouts/shortcodes/responsive-embed.html -->
<div class="responsive-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="{{ .Get "src" }}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    allowfullscreen>
  </iframe>
</div>
```

## 🚀 성능 최적화

### 지연 로딩:
```html
<!-- layouts/shortcodes/lazy-image.html -->
<img 
  data-src="{{ .Get "src" }}" 
  alt="{{ .Get "alt" }}" 
  class="lazy-load"
  loading="lazy"
>
```

### 임계 CSS:
```html
<!-- layouts/partials/critical-css.html -->
<style>
/* 숏코드에 필요한 임계 CSS만 인라인 */
.notion-unsupported-block { ... }
.math-block { ... }
</style>
```

## 💡 확장 아이디어

### 1. **인터랙티브 컴포넌트**:
```html
<!-- layouts/shortcodes/tabs.html -->
<div class="tabs-container">
  <div class="tab-buttons">
    {{ range $index, $tab := split (.Get "tabs") "," }}
      <button class="tab-button" data-tab="{{ $index }}">{{ trim $tab " " }}</button>
    {{ end }}
  </div>
  <div class="tab-content">
    {{ .Inner | markdownify }}
  </div>
</div>
```

### 2. **코드 블록 개선**:
```html
<!-- layouts/shortcodes/code-block.html -->
<div class="code-block">
  <div class="code-header">
    <span class="language">{{ .Get "lang" }}</span>
    <button class="copy-button">복사</button>
  </div>
  <pre><code class="language-{{ .Get "lang" }}">{{ .Inner }}</code></pre>
</div>
```

### 3. **Notion 데이터베이스 뷰**:
```html
<!-- layouts/shortcodes/notion-database.html -->
<div class="notion-database">
  <!-- Notion 데이터베이스를 테이블로 렌더링 -->
</div>
```

## 🔄 유지보수

### 레이아웃 업데이트 전략:
1. **테마 업데이트**: 테마 변경사항과 충돌 확인
2. **브라우저 호환성**: 새로운 CSS/JS 기능 테스트
3. **성능 측정**: Lighthouse로 성능 영향 평가
4. **접근성 검증**: 스크린 리더 호환성 확인

### 문서화:
- 각 숏코드의 사용법과 옵션을 README에 문서화
- 예시 코드와 결과 이미지 포함
- 브라우저 지원 범위 명시