# content 폴더 - Hugo 콘텐츠 디렉토리

**작성일**: 2025-07-24  
**용도**: Hugo 사이트의 모든 콘텐츠 파일을 저장하는 디렉토리

## 📁 폴더 구조

```
content/
├── About-218dcd44779f81169bcedf9476baf73b.md    # 소개 페이지 (Notion 동기화)
├── post/                                         # 블로그 포스트 (Hugo 표준)
│   └── Markdown-218dcd44779f81308f73c87c8b7b56af.md
└── posts/                                       # 추가 포스트 디렉토리
    ├── 새로운-글-223dcd44779f80848151f7a2f421edd0.md
    ├── Test-Child-Page-218dcd44779f81a78140c5986f1e0b89.md
    ├── New-Post-테스트-218dcd44779f802ebb2dd8740f4a7bb9.md
    └── Markdown-218dcd44779f81308f73c87c8b7b56af.md
```

## 🔑 Hugo 콘텐츠 시스템

### Content Organization
이 프로젝트는 **Hugo의 Content Organization** 패턴을 따릅니다:

1. **페이지 번들링**: 각 콘텐츠는 개별 마크다운 파일로 관리
2. **URL 구조**: 파일 경로가 URL 구조를 결정
3. **프론트매터**: YAML 형식으로 메타데이터 정의

### 파일명 규칙
```
{제목}-{notion-page-id}.md
```

- **제목**: URL-safe한 제목 (한글 지원)
- **Notion Page ID**: Notion에서 자동 생성되는 32자리 ID
- 예: `새로운-글-223dcd44779f80848151f7a2f421edd0.md`

## 📄 프론트매터 구조

### Notion 동기화 파일의 표준 프론트매터:
```yaml
---
title: "게시물 제목"
date: "2025-01-15T10:30:00.000Z"        # Notion 생성 시간
lastmod: "2025-01-16T15:45:00.000Z"     # Notion 최종 수정 시간
draft: false
featuredImage: "https://blog.namuori.net/api?page_id=..."  # 커버 이미지
authors: ["Kim Yu Seok"]                 # 작성자 배열
categories: ["Tech"]                     # 카테고리 (Notion 속성에서)
tags: ["Hugo", "Blog"]                   # 태그 (Notion 속성에서)
NOTION_METADATA: {...}                   # Notion 원본 데이터 (JSON)
MANAGED_BY_NOTION_HUGO: true             # 자동 관리 플래그
---
```

## 🔄 동기화 프로세스

### 1. **자동 동기화**
- `npm start` 실행 시 Notion에서 콘텐츠 가져오기
- 변경된 콘텐츠만 업데이트 (`lastmod` 비교)
- 삭제된 Notion 페이지는 로컬에서도 자동 삭제

### 2. **파일 관리**
- **관리 대상**: `MANAGED_BY_NOTION_HUGO: true` 파일만
- **수동 파일**: Notion과 관계없는 파일은 그대로 보존
- **충돌 방지**: Notion ID 기반 고유 파일명 사용

## 🎨 콘텐츠 렌더링

### 지원하는 Notion 블록:
- **텍스트**: 제목, 단락, 인용구, 코드 블록
- **미디어**: 이미지, 비디오, 오디오, PDF
- **구조**: 목록, 테이블, 콜아웃
- **임베드**: 외부 콘텐츠 임베드

### 미디어 파일 처리:
```markdown
<!-- 이미지 -->
![](https://blog.namuori.net/api?block_id=218dcd44-779f-8010-bf5a-ddd655a2b9b6)

<!-- 비디오 -->
<video controls style="height:auto;width:100%;">
  <source src="https://blog.namuori.net/api?block_id=218dcd44-779f-80b7-874e-cf89660a77b1">
</video>

<!-- PDF -->
<embed src="https://blog.namuori.net/api?block_id=218dcd44-779f-8121-90fc-e873855c3adf" type="application/pdf" />
```

## 🌐 다국어 지원

### 현재 설정:
- **기본 언어**: 한국어 (`ko`)
- **URL 구조**: `/posts/게시물제목/`
- **날짜 형식**: 한국 표준 시간 기준

### 언어별 콘텐츠:
```
content/
├── posts/           # 한국어 콘텐츠
└── en/posts/        # 영어 콘텐츠 (확장 가능)
```

## 🔧 Hugo 설정 연동

### config.toml과의 연결:
```toml
# 콘텐츠 마운트
[[module.mounts]]
source = "content/About-218dcd44779f81169bcedf9476baf73b.md"
target = "content/readme.md"

[[module.mounts]]
source = "content/posts"
target = "content/post"  # posts -> post로 리디렉션
```

## 📱 반응형 이미지

### 자동 이미지 최적화:
- Cloudflare의 이미지 최적화 서비스 활용
- WebP 형식 자동 변환
- 다양한 해상도 지원

## 🚨 주의사항

1. **직접 편집 금지**: `MANAGED_BY_NOTION_HUGO: true` 파일은 Notion에서만 편집
2. **파일명 보존**: 동기화 시 기존 파일명 유지
3. **미디어 의존성**: Notion API를 통한 미디어 파일 접근

## 💡 콘텐츠 작성 팁

### Notion에서 작성 시:
1. **제목 설정**: 명확하고 SEO 친화적인 제목 사용
2. **커버 이미지**: 블로그 포스트의 대표 이미지 설정
3. **속성 활용**: 카테고리, 태그, 작성자 등 메타데이터 입력
4. **URL 고려**: 제목이 URL이 되므로 적절한 길이 유지

### 로컬 개발 시:
```bash
# 콘텐츠 동기화
npm start

# 로컬 서버 실행
npm run server

# Hugo 빌드
hugo build
```

## 📊 SEO 최적화

### 자동 생성되는 SEO 요소:
- **메타 제목**: 프론트매터 title 사용
- **메타 설명**: 콘텐츠 첫 번째 문단 자동 추출
- **Open Graph**: 커버 이미지와 메타데이터 활용
- **구조화된 데이터**: JSON-LD 형식으로 자동 생성

## 🔄 백업 및 복구

### 권장 백업 전략:
1. **Git 버전 관리**: 모든 콘텐츠 파일 추적
2. **Notion 백업**: 원본 데이터는 Notion에서 관리
3. **자동 동기화**: 정기적인 동기화로 데이터 일관성 유지