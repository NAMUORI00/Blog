---
title: "🔄 BPE (Byte Pair Encoding) - 빈도 기반 서브워드 구성"
date: "2025-07-15T04:08:00.000Z"
lastmod: "2025-07-23T06:19:00.000Z"
draft: false
series: []
tags: []
categories: []
authors:
  - "KYS"
NOTION_METADATA:
  object: "page"
  id: "231dcd44-779f-81be-9447-d613bef476f9"
  created_time: "2025-07-15T04:08:00.000Z"
  last_edited_time: "2025-07-23T06:19:00.000Z"
  created_by:
    object: "user"
    id: "f96e6171-8ea1-4a4a-82e4-72ba4441b8c0"
  last_edited_by:
    object: "user"
    id: "f96e6171-8ea1-4a4a-82e4-72ba4441b8c0"
  cover: null
  icon: null
  parent:
    type: "database_id"
    database_id: "218dcd44-779f-81dd-bf93-e4fadbccbfde"
  archived: false
  in_trash: false
  properties:
    series:
      id: "B%3C%3FS"
      type: "multi_select"
      multi_select: []
    draft:
      id: "JiWU"
      type: "checkbox"
      checkbox: false
    authors:
      id: "bK%3B%5B"
      type: "people"
      people: []
    custom-front-matter:
      id: "c~kA"
      type: "rich_text"
      rich_text: []
    tags:
      id: "jw%7CC"
      type: "multi_select"
      multi_select: []
    categories:
      id: "nbY%3F"
      type: "multi_select"
      multi_select: []
    Last edited time:
      id: "vbGE"
      type: "last_edited_time"
      last_edited_time: "2025-07-23T06:19:00.000Z"
    summary:
      id: "x%3AlD"
      type: "rich_text"
      rich_text: []
    Name:
      id: "title"
      type: "title"
      title:
        - type: "text"
          text:
            content: "🔄 BPE (Byte Pair Encoding) - 빈도 기반 서브워드 구성"
            link: null
          annotations:
            bold: false
            italic: false
            strikethrough: false
            underline: false
            code: false
            color: "default"
          plain_text: "🔄 BPE (Byte Pair Encoding) - 빈도 기반 서브워드 구성"
          href: null
  url: "https://www.notion.so/BPE-Byte-Pair-Encoding-231dcd44779f81be9447d613bef4\
    76f9"
  public_url: "https://namuori00.notion.site/BPE-Byte-Pair-Encoding-231dcd44779f8\
    1be9447d613bef476f9"
MANAGED_BY_NOTION_HUGO: true

---


# 🔄 BPE (Byte Pair Encoding) - 빈도 기반 서브워드 구성


## 역사적 발전 과정


```javascript
1994년 Gage: 데이터 압축 알고리즘으로 개발
├─ 목적: 파일 크기 최소화
├─ 방법: 가장 빈번한 바이트 쌍 병합
└─ 한계: 언어적 의미 고려 없음

2016년 Sennrich et al.: NMT에 적용하여 혁신적 성과
├─ 혁신: 언어 처리로 용도 전환
├─ 성과: WMT16에서 SOTA 달성
└─ 영향: 현재 주요 LLM의 표준 기법

현재 채택 모델: GPT-2, RoBERTa, BART, LLaMA
```


## 핵심 아이디어


> **"가장 빈번하게 나타나는 연속된 심볼 쌍을 반복적으로 병합하여 효율적인 서브워드 어휘를 구성한다"**


## 3가지 핵심 동기


### 1. OOV (Out-of-Vocabulary) 문제 완전 해결


```javascript
기존 방식의 한계:
• Word-level: 50K 어휘로 85% 커버리지
• 신조어, 오타, 변형어 처리 불가
• 도메인 특화 용어 누락

BPE의 해결책:
• 32K 토큰으로 99.9% 커버리지
• 문자 단위 분해로 모든 단어 표현 가능
• 점진적 병합으로 의미 단위 보존
```


### 2. 형태론적 변화 (Morphological Variations) 처리


```javascript
예시: 영어 동사 활용
play → [play]
playing → [play] + [ing]  
played → [play] + [ed]
plays → [play] + [s]

효과:
• 어간-접사 분리로 일반화 능력 향상
• 미등록 활용형 자동 처리
• 의미 단위별 임베딩 학습
```


### 3. 메모리 효율성


```javascript
기존 Word-level:
• 어휘 크기: 100K - 1M 단어
• 임베딩 테이블: 512 × 1M = 500M 파라미터
• 신규 단어마다 벡터 추가 필요

BPE:
• 어휘 크기: 32K 토큰 (고정)
• 임베딩 테이블: 512 × 32K = 16M 파라미터
• 새로운 단어도 기존 토큰 조합으로 처리
• 96% 메모리 절약
```


## ⛙️ BPE 알고리즘 - 단계별 구현 및 복잡도 분석


### 완전한 의사코드


```python
def train_bpe(corpus, num_merges):
    """BPE 모델 훈련"""
    # 1. 초기화: 모든 문자를 개별 토큰으로 분리
    vocab = {}
    for word in corpus:
        word_tokens = list(word) + ['</w>']  # 단어 끝 표시
        vocab[' '.join(word_tokens)] = corpus.count(word)
    
    merge_rules = []
    
    # 2. 지정된 횟수만큼 병합 반복
    for i in range(num_merges):
        # 2-1. 모든 인접 토큰 쌍의 빈도 계산
        pairs = {}
        for word, freq in vocab.items():
            symbols = word.split()
            for j in range(len(symbols) - 1):
                pair = (symbols[j], symbols[j + 1])
                pairs[pair] = pairs.get(pair, 0) + freq
        
        # 2-2. 최고 빈도 쌍 선택
        if not pairs:
            break
        best_pair = max(pairs, key=pairs.get)
        
        # 2-3. 선택된 쌍을 새로운 토큰으로 병합
        new_vocab = {}
        bigram = ' '.join(best_pair)
        replacement = ''.join(best_pair)
        
        for word in vocab:
            new_word = word.replace(bigram, replacement)
            new_vocab[new_word] = vocab[word]
        
        vocab = new_vocab
        merge_rules.append(best_pair)
        
        print(f"Merge {i+1}: {best_pair} → {replacement}")
    
    return merge_rules
```


### 계산 복잡도 심층 분석


**시간 복잡도: O(n² × V × M)**


```javascript
상세 분해:
• n: 코퍼스 크기 (문자 수)
• V: 현재 어휘 크기
• M: 병합 횟수 (보통 32K)

단계별 복잡도:
1. 초기화: O(n) - 문자 분리
2. 쌍 빈도 계산: O(n × V) - 모든 토큰 쌍 확인
3. 최고 빈도 쌍 선택: O(V²) - 모든 쌍 비교
4. 어휘 업데이트: O(n × V) - 모든 단어에서 병합 적용
5. M번 반복: × M

실제 수행 시간 (64GB 코퍼스):
• 단일 GPU (V100): 약 12시간
• 8-GPU 병렬: 약 2.5시간
• CPU 전용: 약 48시간
```


**공간 복잡도: O(V² + M)**


```javascript
메모리 구성요소:
• 어휘 사전: O(V) - 토큰별 빈도 저장
• 쌍 빈도 테이블: O(V²) - 모든 가능한 쌍
• 병합 규칙: O(M) - 순서대로 저장
• 임시 버퍼: O(V) - 업데이트 중 사용

실제 메모리 사용량 (32K 어휘):
• 어휘 사전: ~200MB
• 쌍 테이블: ~8GB (32K²)
• 병합 규칙: ~2MB
• 총 메모리: ~8.5GB
```

