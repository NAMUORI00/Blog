# functions 폴더 - Cloudflare Functions API

**작성일**: 2025-07-24  
**용도**: Cloudflare Pages Functions을 통한 Notion 파일 프록시 API

## 📁 폴더 구조

```
functions/
├── api.ts           # Notion 파일 URL 프록시 API
└── tsconfig.json    # 함수별 TypeScript 설정
```

## 🔑 주요 기능

### **api.ts** - 파일 프록시 서비스
Notion에서 호스팅되는 파일(이미지, 비디오, PDF 등)에 대한 인증된 URL을 제공하고 캐싱하는 API입니다.

#### 핵심 기능:
1. **파일 URL 프록시**: Notion의 일시적 인증 URL을 안정적인 URL로 변환
2. **Cloudflare KV 캐싱**: 1시간 TTL로 파일 URL 캐싱
3. **자동 리다이렉트**: 클라이언트를 실제 파일 URL로 302 리다이렉트

#### 지원하는 요청:
- `GET /api?block_id={block_id}` - 특정 블록의 파일 URL 반환
- `GET /api?page_id={page_id}` - 페이지 커버 이미지 URL 반환

## 🏗️ 아키텍처

```mermaid
graph LR
    A[블로그 방문자] --> B[/api 엔드포인트]
    B --> C{캐시 확인}
    C -->|캐시 히트| D[KV에서 URL 반환]
    C -->|캐시 미스| E[Notion API 호출]
    E --> F[새로운 URL 캐시 저장]
    F --> G[사용자를 파일 URL로 리다이렉트]
    D --> G
```

## 🔧 환경 변수

```typescript
interface Env {
  KV: KVNamespace;           // Cloudflare KV 스토리지
  NOTION_TOKEN?: string;     // Notion API 토큰
  CF_PAGES_URL: string;      // Cloudflare Pages URL
}
```

## 💾 캐시 전략

### CacheEntry 구조:
```typescript
type CacheEntry = {
  url: string;         // S3 인증 URL (1시간 유효)
  expiry_time: string; // ISO 8601 만료 시간
};
```

### 캐싱 로직:
1. **TTL**: 3600초 (1시간)
2. **만료 확인**: 요청 시마다 만료 시간 검증
3. **자동 갱신**: 만료된 캐시는 새로운 API 호출로 갱신

## 🚨 보안 고려사항

### 장점:
- ✅ 환경 변수로 토큰 관리
- ✅ 입력 검증 (block_id/page_id 필수)
- ✅ 에러 처리 및 적절한 HTTP 상태 코드

### 개선 필요:
- 📝 **Rate Limiting**: API 호출 빈도 제한 고려
- 📝 **Access Control**: 필요시 인증 레이어 추가
- 📝 **Input Sanitization**: ID 형식 검증 강화

## 🎯 사용 예시

### HTML에서 사용:
```html
<!-- 이미지 -->
<img src="https://blog.namuori.net/api?block_id=218dcd44-779f-8010-bf5a-ddd655a2b9b6" />

<!-- 비디오 -->
<video controls>
  <source src="https://blog.namuori.net/api?block_id=218dcd44-779f-80b7-874e-cf89660a77b1">
</video>

<!-- PDF 임베드 -->
<embed src="https://blog.namuori.net/api?block_id=218dcd44-779f-8121-90fc-e873855c3adf" type="application/pdf" />
```

## ⚡ 성능 최적화

1. **캐시 히트율 향상**:
   - 1시간 TTL로 Notion API 호출 최소화
   - KV 스토리지 활용으로 빠른 응답

2. **CDN 활용**:
   - Cloudflare의 글로벌 CDN을 통한 지연시간 최소화
   - 에지에서 캐시 처리

## 🔍 디버깅 팁

```typescript
// 캐시 상태 확인
console.log('Cache entry:', await context.env.KV.get(blockId));

// API 응답 확인
console.log('Notion API response:', response);

// 에러 로깅
console.error('Error details:', error.message, error.stack);
```

## 📝 배포 설정

Cloudflare Pages에서 자동 배포되며, 다음 환경 변수가 필요합니다:

```bash
NOTION_TOKEN=notion_secret_...
CF_PAGES_URL=https://blog.namuori.net
```

## 🚧 알려진 제한사항

1. **Notion API 제한**: 분당 요청 제한 존재
2. **파일 크기**: 대용량 파일 처리 시 타임아웃 가능성
3. **External 파일**: 외부 호스팅 파일은 지원하지 않음

## 💡 향후 개선 방향

1. **에러 복구**: 실패한 요청에 대한 재시도 로직
2. **모니터링**: 성능 메트릭 및 에러 추적
3. **최적화**: 파일 타입별 다른 캐시 전략 적용