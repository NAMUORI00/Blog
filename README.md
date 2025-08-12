# 나무오리(NAMUORI00)의 기술 블로그

안녕하세요! 개발자 김유석(나무오리, [@NAMUORI00](https://github.com/NAMUORI00))의 개인 블로그 소스코드 저장소입니다.

이 블로그는 [notion-hugo](https://github.com/plane-dot/notion-hugo)를 사용하여 Notion에 작성된 글들을 정적 웹사이트로 빌드하여 [blog.namuori.net](https://blog.namuori.net)으로 배포하며, Cloudflare Pages를 통해 호스팅됩니다.

기술적인 내용, 개인적인 생각, 학습 과정 등을 기록하고 공유하는 공간입니다.

## 사용된 기술

### Hugo Theme
이 블로그는 [github-style](https://github.com/MeiK2333/github-style) Hugo 테마를 사용합니다.

**Theme Attribution:**
- **Original Theme:** [github-style](https://github.com/MeiK2333/github-style) by [MeiK2333](https://github.com/MeiK2333)
- **License:** MIT License
- **Modifications:** This repository includes a customized version of the theme for personal use

The original theme is licensed under the MIT License. Copyright (c) 2019 MeiK2333. We maintain this attribution as required by the license terms.

## 환경 변수

Gitalk 댓글 기능은 GitHub OAuth 앱 자격 증명을 필요로 합니다. Hugo는 다음 환경 변수에서 값을 읽어옵니다:

- `HUGO_PARAMS_GITALK_CLIENTID` – GitHub OAuth App Client ID
- `HUGO_PARAMS_GITALK_CLIENTSECRET` – GitHub OAuth App Client Secret

로컬 개발 시 이 변수들을 `.env` 파일이나 셸에 설정하세요. `.env`는 `.gitignore`에 추가되어 있으므로 민감한 값이 저장소에 커밋되지 않습니다.

### 관련 링크

-   **블로그:** [https://blog.namuori.net](https://blog.namuori.net)
-   **GitHub:** [NAMUORI00](https://github.com/NAMUORI00)
-   **개인 웹사이트:** [https://namuori.net](https://namuori.net)

방문해주셔서 감사합니다!
