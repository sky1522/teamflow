# 🚀 TeamFlow - 팀 프로젝트 관리 도구

팀원들과 함께 프로젝트를 효율적으로 관리할 수 있는 협업 도구입니다.

## ✨ 주요 기능

### 👤 사용자 관리
- **이메일/비밀번호 로그인** 또는 **Google 로그인**
- 개인 프로필 관리

### 👥 팀 관리
- **팀 생성** - 새로운 팀 만들기
- **팀 참여** - 팀 코드로 기존 팀에 참여
- **팀원 초대** - 팀 코드 공유로 팀원 추가
- **역할 관리** - 관리자/멤버 역할 구분

### 📅 일정 관리
- **달력 뷰** - 직관적인 달력으로 일정 확인
- **날짜별 할일** - 과거/현재/미래 할일 관리
- **할일 상태** - 진행중/완료 상태 관리
- **실시간 동기화** - 팀원들과 실시간으로 일정 공유

### 📁 파일 공유
- **파일 첨부** - 할일에 파일 첨부 가능
- **파일 다운로드** - 공유된 파일 다운로드

### 💬 실시간 채팅
- **팀 채팅** - 팀원들과 실시간 대화
- **즉시 반영** - 메시지 즉시 전송 및 수신

### 📝 댓글 시스템
- **할일 댓글** - 각 할일에 댓글 작성
- **소통 강화** - 팀원들과 의견 교환

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase
  - Firebase Authentication (인증)
  - Firebase Realtime Database (실시간 데이터베이스)
  - Firebase Storage (파일 저장소)

## 📦 설치 및 설정

### 1. Firebase 프로젝트 만들기

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "TeamFlow")
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

### 2. Firebase 설정

#### Authentication 설정
1. Firebase Console > "Authentication" 메뉴
2. "시작하기" 클릭
3. 로그인 방법 탭에서 다음을 활성화:
   - **이메일/비밀번호** - 사용 설정
   - **Google** - 사용 설정 (프로젝트 지원 이메일 입력)

#### Realtime Database 설정
1. Firebase Console > "Realtime Database" 메뉴
2. "데이터베이스 만들기" 클릭
3. 위치 선택 (예: asia-southeast1)
4. **테스트 모드로 시작** 선택 (개발용)
   - ⚠️ 나중에 프로덕션 환경에서는 보안 규칙을 설정하세요

5. 보안 규칙 설정 (Rules 탭):
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "teams": {
      ".read": "auth != null",
      "$teamId": {
        ".write": "auth != null"
      }
    },
    "teamMembers": {
      ".read": "auth != null",
      "$teamId": {
        ".write": "auth != null"
      }
    },
    "userTeams": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "todos": {
      "$teamId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    "chat": {
      "$teamId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    "comments": {
      "$teamId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

#### Storage 설정
1. Firebase Console > "Storage" 메뉴
2. "시작하기" 클릭
3. **테스트 모드로 시작** 선택 (개발용)
4. 위치 선택
5. 보안 규칙 설정 (Rules 탭):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /teams/{teamId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Firebase 설정값 가져오기

1. Firebase Console > 프로젝트 설정 (⚙️ 아이콘)
2. "내 앱" 섹션에서 웹 앱 추가 (</>  아이콘)
3. 앱 닉네임 입력 (예: "TeamFlow Web")
4. "앱 등록" 클릭
5. **Firebase SDK 구성** 정보 복사

### 4. 프로젝트에 Firebase 설정 적용

`firebase-config.js` 파일을 열고 Firebase SDK 구성 정보로 교체:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};
```

### 5. 실행

1. 프로젝트 폴더에서 `index.html` 파일을 브라우저로 열기
   - 또는 로컬 서버 사용 (권장):
   ```bash
   # Python 3이 설치되어 있는 경우
   python -m http.server 8000
   
   # Node.js가 설치되어 있는 경우
   npx http-server
   ```
2. 브라우저에서 `http://localhost:8000` 접속

## 📖 사용 방법

### 1️⃣ 회원가입 및 로그인
1. 이메일/비밀번호로 회원가입 또는 Google 계정으로 로그인
2. 로그인 성공 시 메인 화면으로 이동

### 2️⃣ 팀 만들기
1. 우측 상단 사용자 메뉴 클릭
2. "새 팀 만들기" 선택
3. 팀 이름과 설명 입력
4. 팀 생성 완료 - 6자리 팀 코드 자동 생성

### 3️⃣ 팀 참여하기
1. 우측 상단 사용자 메뉴 클릭
2. "팀 참여하기" 선택
3. 팀 관리자로부터 받은 6자리 팀 코드 입력
4. 팀에 멤버로 참여 완료

### 4️⃣ 팀원 초대하기
1. 왼쪽 팀 정보 카드에서 "초대" 버튼 클릭
2. 팀 코드 복사
3. 팀원에게 팀 코드 공유

### 5️⃣ 일정 관리
1. 왼쪽 달력에서 날짜 클릭
2. 중앙 영역에서 할일 입력
3. 필요시 파일 첨부 (📎 버튼)
4. "추가" 버튼으로 할일 생성
5. 체크박스로 완료/미완료 상태 변경
6. 할일 클릭하여 댓글 작성 가능

### 6️⃣ 채팅
1. 오른쪽 채팅 영역에서 메시지 입력
2. "전송" 버튼으로 메시지 전송
3. 팀원들과 실시간으로 대화

## 🔒 보안 주의사항

### 개발 환경
- 현재 설정은 개발/테스트 환경용입니다
- Firebase 보안 규칙이 느슨하게 설정되어 있습니다

### 프로덕션 환경 적용 시
1. **Firebase 보안 규칙 강화**
   - 팀 멤버만 해당 팀 데이터 접근 가능하도록 설정
   - 사용자별 권한 확인

2. **API Key 보호**
   - 환경 변수 사용
   - .gitignore에 설정 파일 추가

3. **HTTPS 사용**
   - 프로덕션 환경에서는 반드시 HTTPS 사용

## 🎨 커스터마이징

### 색상 변경
`style.css` 파일 상단의 CSS 변수를 수정:

```css
:root {
    --primary-color: #667eea;  /* 메인 색상 */
    --secondary-color: #764ba2; /* 보조 색상 */
    --success-color: #10b981;   /* 성공 색상 */
    --warning-color: #f59e0b;   /* 경고 색상 */
    --danger-color: #ef4444;    /* 위험 색상 */
}
```

### 기능 확장
- 할일 우선순위 추가
- 할일 카테고리/태그 기능
- 팀별 공지사항
- 개인 알림 설정
- 파일 용량 제한 설정
- 검색 기능

## 🐛 문제 해결

### Firebase 초기화 실패
- `firebase-config.js` 파일의 설정값 확인
- Firebase Console에서 웹 앱이 등록되었는지 확인

### 로그인 실패
- Firebase Authentication이 활성화되었는지 확인
- 이메일/비밀번호 또는 Google 로그인이 활성화되었는지 확인

### 데이터 로딩 실패
- Firebase Realtime Database가 생성되었는지 확인
- 보안 규칙이 올바르게 설정되었는지 확인

### 파일 업로드 실패
- Firebase Storage가 활성화되었는지 확인
- 보안 규칙이 올바르게 설정되었는지 확인
- 파일 크기 제한 확인

## 💡 향후 개선 사항

- [ ] 모바일 앱 (React Native / Flutter)
- [ ] 이메일 알림
- [ ] 팀별 대시보드
- [ ] 통계 및 리포트
- [ ] 할일 반복 설정
- [ ] 캘린더 동기화 (Google Calendar 등)
- [ ] 다국어 지원
- [ ] 다크 모드
- [ ] 오프라인 지원 (PWA)

## 📄 라이선스

이 프로젝트는 자유롭게 사용, 수정, 배포할 수 있습니다.

## 🙏 도움이 필요하신가요?

문제가 발생하거나 질문이 있으시면:
1. Firebase Console에서 오류 로그 확인
2. 브라우저 개발자 도구 콘솔 확인
3. Firebase 설정이 올바른지 재확인

---

**즐거운 협업 되세요! 🚀**
