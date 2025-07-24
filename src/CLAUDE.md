# src 폴더 - Notion-Hugo 동기화 엔진

**작성일**: 2025-07-24  
**용도**: Notion CMS와 Hugo 정적 사이트 생성기 간의 동기화를 담당하는 TypeScript 코드

## 📁 폴더 구조

```
src/
├── index.ts          # 메인 진입점 - Notion에서 콘텐츠를 가져와 Hugo로 동기화
├── config.ts         # 설정 로더 - notion-hugo.config.ts 파일 읽기 및 검증
├── render.ts         # 페이지 렌더링 - Notion 페이지를 Hugo 마크다운으로 변환
├── file.ts           # 파일 시스템 작업 - 콘텐츠 파일 읽기/쓰기
├── helpers.ts        # 유틸리티 함수 - 제목 추출, 파일명 생성 등
├── sh.ts             # 쉘 명령 실행 - Hugo 명령어 실행
└── markdown/         # 마크다운 변환 관련 모듈
    ├── notion-to-md.ts  # Notion 블록을 마크다운으로 변환
    ├── notion.ts        # Notion API 래퍼
    ├── md.ts           # 마크다운 처리 유틸리티
    └── types.ts        # TypeScript 타입 정의
```

## 🔑 주요 기능

### 1. **index.ts** - 메인 오케스트레이터
- Notion API 클라이언트 초기화
- 데이터베이스와 페이지 동기화
- 로컬에만 있는 파일 정리
- 환경 변수(`NOTION_TOKEN`) 확인

### 2. **config.ts** - 설정 관리
- `notion-hugo.config.ts` 파일 로드
- 수동/자동 마운트 모드 지원
- API URL 생성 함수 제공
- TypeScript 타입 안전성 보장

### 3. **render.ts** - 콘텐츠 변환
- Notion 페이지를 Hugo 프론트매터가 있는 마크다운으로 변환
- 페이지 속성을 프론트매터로 매핑
- 커버 이미지 처리
- 작성자 정보 자동 추출

### 4. **file.ts** - 파일 시스템 작업
- 콘텐츠 파일 읽기/쓰기
- 프론트매터 파싱
- `NOTION_METADATA` 확인으로 관리 대상 파일 식별

### 5. **sh.ts** - 명령 실행
- ⚠️ **보안 주의**: `exec()` 사용으로 명령 주입 취약점 존재
- Hugo 명령어 실행 (`hugo new` 등)
- Promise 기반 비동기 처리

## 🚨 보안 권장사항

1. **명령 주입 취약점 수정** (`sh.ts`):
   ```typescript
   // 현재 (위험)
   exec(cmd, (err, stdout, stderr) => {...})
   
   // 권장
   execFile(command, args, (err, stdout, stderr) => {...})
   ```

2. **환경 변수 검증 추가**:
   ```typescript
   if (!process.env.NOTION_TOKEN || process.env.NOTION_TOKEN.trim() === "") {
     throw new Error("NOTION_TOKEN is required");
   }
   ```

## 💡 개선 제안

1. **에러 처리 강화**
   - 모든 비동기 작업에 try-catch 추가
   - 커스텀 에러 클래스 생성
   - 에러 로깅 개선

2. **타입 안전성 향상**
   - `any` 타입 제거
   - `@ts-ignore` 제거
   - 엄격한 null 체크 활성화

3. **테스트 추가**
   - 단위 테스트 작성
   - 통합 테스트 추가
   - 모킹을 통한 API 테스트

## 🔧 사용 방법

```bash
# 환경 변수 설정
export NOTION_TOKEN="your-notion-api-token"

# 동기화 실행
npm start
```

## 📝 설정 예시

```typescript
// notion-hugo.config.ts
export default {
  base_url: "https://blog.namuori.net",
  mount: {
    manual: false,
    page_url: 'https://notion.so/...',
    databases: [{
      database_id: '...',
      target_folder: 'posts'
    }]
  }
}
```

## ⚡ 성능 고려사항

- Notion API 요청 최적화를 위한 배치 처리 고려
- 파일 시스템 작업 병렬화
- 캐싱 전략 구현 검토