# archetypes 폴더 - Hugo 콘텐츠 템플릿

**작성일**: 2025-07-24  
**용도**: 새로운 콘텐츠 생성 시 사용되는 템플릿 파일들

## 📁 폴더 구조

```
archetypes/
├── default.md          # 기본 콘텐츠 템플릿
└── post.md            # 블로그 포스트 전용 템플릿
```

## 🎯 Hugo Archetypes 시스템

### Archetype 개념:
- **콘텐츠 생성 템플릿**: `hugo new` 명령어로 새 콘텐츠 생성 시 사용
- **프론트매터 자동화**: 일관된 메타데이터 구조 보장
- **초기 콘텐츠**: 템플릿 콘텐츠로 작성 시작점 제공
- **타입별 템플릿**: 콘텐츠 타입에 따른 다른 템플릿 적용

### 사용법:
```bash
# 기본 템플릿 사용
hugo new content/my-new-post.md

# 특정 archetype 사용
hugo new --kind post content/posts/my-blog-post.md

# 디렉토리 기반 자동 선택
hugo new content/posts/auto-post.md  # post.md 자동 사용
```

## 📄 템플릿 파일 분석

### 1. **default.md** - 기본 템플릿
```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
---

# {{ replace .Name "-" " " | title }}

새로운 콘텐츠를 여기에 작성하세요.
```

#### 템플릿 변수:
- `{{ .Name }}`: 파일명 (확장자 제외)
- `{{ .Date }}`: 현재 날짜시간 (ISO 8601 형식)
- `{{ replace .Name "-" " " | title }}`: 파일명을 제목으로 변환

### 2. **post.md** - 블로그 포스트 템플릿
```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true
author: "Kim Yu Seok"
categories: []
tags: []
description: ""
featuredImage: ""
---

# {{ replace .Name "-" " " | title }}

## 소개

이 포스트에서는...

## 본문

### 소제목 1

내용...

### 소제목 2

내용...

## 결론

정리하면...

---

**관련 포스트:**
- [링크 제목](링크 URL)

**참고 자료:**
- [참고 자료 1](URL)
```

## 🔧 프론트매터 구조

### 기본 필드:
```yaml
title: "포스트 제목"           # 페이지 제목
date: 2025-07-24T10:30:00+09:00  # 생성 날짜
lastmod: 2025-07-24T10:30:00+09:00  # 최종 수정일
draft: true                    # 초안 상태 (false로 변경 시 공개)
```

### 블로그 전용 필드:
```yaml
author: "Kim Yu Seok"          # 작성자
categories: ["Tech", "Hugo"]   # 카테고리 배열
tags: ["blog", "static-site"]  # 태그 배열
description: "포스트 요약"      # 메타 설명 (SEO용)
featuredImage: "/images/..."   # 대표 이미지
```

### SEO 최적화 필드:
```yaml
slug: "custom-url-slug"        # 커스텀 URL
keywords: ["hugo", "blog"]     # SEO 키워드
summary: "포스트 요약"          # 목록에서 표시될 요약
weight: 100                    # 정렬 우선순위
```

## 🎨 템플릿 커스터마이징

### 고급 프론트매터 예시:
```yaml
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true
author: "{{ .Site.Params.author | default "Kim Yu Seok" }}"

# 분류
categories: []
tags: []
series: ""

# SEO
description: ""
keywords: []
slug: ""

# 미디어
featuredImage: ""
featuredImagePreview: ""

# 소셜
hiddenFromHomePage: false
hiddenFromSearch: false

# 댓글
comment: true
toc: true
autoCollapseToc: false
math: false

# 라이선스
license: ""
---
```

### 조건부 콘텐츠:
```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
{{ if eq .Type "tutorial" }}
difficulty: "초급"
estimatedTime: "30분"
prerequisites: []
{{ end }}
---

{{ if eq .Type "tutorial" }}
## 튜토리얼 정보

- **난이도**: {{ .Params.difficulty }}
- **예상 소요 시간**: {{ .Params.estimatedTime }}
- **사전 요구사항**: {{ delimit .Params.prerequisites ", " }}
{{ end }}
```

## 🚀 실제 사용 시나리오

### 1. **기술 블로그 포스트**:
```bash
hugo new content/posts/react-hooks-guide.md
```

생성되는 파일:
```markdown
---
title: "React Hooks Guide"
date: 2025-07-24T10:30:00+09:00
draft: true
author: "Kim Yu Seok"
categories: ["React", "Frontend"]
tags: ["react", "hooks", "javascript"]
description: "React Hooks 완전 가이드"
---

# React Hooks Guide

## 소개

React Hooks는...
```

### 2. **프로젝트 문서**:
```bash
hugo new --kind documentation content/docs/api-reference.md
```

### 3. **튜토리얼 시리즈**:
```bash
hugo new --kind tutorial content/tutorials/hugo-basics-01.md
```

## 📝 다양한 콘텐츠 타입

### 사진 갤러리 archetype:
```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
type: "gallery"
images: []
location: ""
camera: ""
---

{{ range .Params.images }}
![{{ .alt }}]({{ .src }})
{{ end }}
```

### 북 리뷰 archetype:
```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
type: "review"
book:
  title: ""
  author: ""
  isbn: ""
  publisher: ""
  year: ""
rating: 0
---

## 책 정보

- **제목**: {{ .Params.book.title }}
- **저자**: {{ .Params.book.author }}
- **출판사**: {{ .Params.book.publisher }}
- **출간년도**: {{ .Params.book.year }}

## 평점

{{ range seq .Params.rating }}★{{ end }}{{ range seq (sub 5 .Params.rating) }}☆{{ end }}
```

## 🔄 Notion 통합

### Notion 동기화 파일 archetype:
```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
# Notion 동기화 플래그 - 수동으로 설정하지 마세요
MANAGED_BY_NOTION_HUGO: false
NOTION_METADATA: null
---

⚠️ **주의**: 이 파일이 Notion과 동기화되면 내용이 덮어쓰여집니다.
Notion에서 관리하려면 `MANAGED_BY_NOTION_HUGO: true`로 설정하세요.
```

## 🎯 템플릿 함수 활용

### 날짜 포맷팅:
```yaml
date: {{ .Date }}                    # 2025-07-24T10:30:00+09:00
publishDate: {{ now.Format "2006-01-02" }}  # 2025-07-24
expiryDate: {{ (now.AddDate 1 0 0).Format "2006-01-02" }}  # 1년 후
```

### 사이트 변수 활용:
```yaml
author: "{{ .Site.Params.author }}"
baseURL: "{{ .Site.BaseURL }}"
language: "{{ .Site.Language.Lang }}"
```

### 파일 경로 기반 설정:
```yaml
{{ if in .File.Path "tutorials" }}
type: "tutorial"
toc: true
{{ else if in .File.Path "reviews" }}
type: "review"
comment: true
{{ end }}
```

## 🔧 고급 템플릿 기법

### 동적 카테고리 생성:
```yaml
{{ $path := split .File.Dir "/" }}
{{ if gt (len $path) 2 }}
categories: ["{{ index $path 1 | humanize }}"]
{{ else }}
categories: []
{{ end }}
```

### 자동 태그 생성:
```yaml
{{ $tags := slice }}
{{ if in .Name "react" }}{{ $tags = $tags | append "React" }}{{ end }}
{{ if in .Name "vue" }}{{ $tags = $tags | append "Vue" }}{{ end }}
{{ if in .Name "js" }}{{ $tags = $tags | append "JavaScript" }}{{ end }}
tags: {{ $tags }}
```

## 🎨 템플릿 베스트 프랙티스

### 1. **일관성 유지**:
- 모든 archetype에서 동일한 필드 순서 사용
- 동일한 명명 규칙 적용
- 일관된 날짜 형식 사용

### 2. **기본값 설정**:
```yaml
author: "{{ .Site.Params.author | default "익명" }}"
language: "{{ .Site.Language.Lang | default "ko" }}"
```

### 3. **검증 가능한 구조**:
```yaml
# 필수 필드는 빈 문자열로 초기화
title: ""
description: ""

# 선택적 필드는 적절한 기본값
draft: true
comment: true
```

## 💡 확장 아이디어

### 1. **프로젝트별 archetype**:
```
archetypes/
├── blog/
│   ├── tech.md        # 기술 포스트
│   ├── review.md      # 리뷰 포스트
│   └── tutorial.md    # 튜토리얼 포스트
├── docs/
│   ├── api.md         # API 문서
│   └── guide.md       # 가이드 문서
└── portfolio/
    └── project.md     # 포트폴리오 프로젝트
```

### 2. **인터랙티브 생성기**:
```bash
#!/bin/bash
# create-post.sh
echo "포스트 제목을 입력하세요:"
read title
echo "카테고리를 선택하세요 (1: Tech, 2: Review, 3: Tutorial):"
read category

case $category in
  1) hugo new --kind tech "content/posts/$title.md" ;;
  2) hugo new --kind review "content/posts/$title.md" ;;
  3) hugo new --kind tutorial "content/posts/$title.md" ;;
esac
```

### 3. **자동화 워크플로우**:
```yaml
# .github/workflows/create-post.yml
name: Create New Post
on:
  workflow_dispatch:
    inputs:
      title:
        description: 'Post title'
        required: true
      type:
        description: 'Post type'
        required: true
        default: 'post'
```

## 🔍 디버깅 및 테스트

### archetype 테스트:
```bash
# 다양한 파일명으로 테스트
hugo new content/test-post.md
hugo new content/posts/my-first-blog-post.md
hugo new --kind tutorial content/tutorials/advanced-hugo.md

# 생성된 파일 확인
cat content/test-post.md
```

### 템플릿 변수 디버깅:
```markdown
---
# 디버그 정보
debug_name: "{{ .Name }}"
debug_date: "{{ .Date }}"
debug_type: "{{ .Type }}"
debug_path: "{{ .File.Path }}"
---
```