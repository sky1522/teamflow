# 🔥 Firebase 설정 가이드

TeamFlow를 사용하기 위한 Firebase 설정을 단계별로 안내합니다.

## 📋 목차
1. [Firebase 프로젝트 생성](#1-firebase-프로젝트-생성)
2. [Authentication 설정](#2-authentication-설정)
3. [Realtime Database 설정](#3-realtime-database-설정)
4. [Storage 설정](#4-storage-설정)
5. [설정값 적용](#5-설정값-적용)
6. [보안 규칙 설정](#6-보안-규칙-설정)

---

## 1. Firebase 프로젝트 생성

### 단계 1: Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. Google 계정으로 로그인

### 단계 2: 새 프로젝트 만들기
1. **"프로젝트 추가"** 또는 **"Create a project"** 클릭
2. 프로젝트 이름 입력 (예: `TeamFlow` 또는 `MyTeamProject`)
3. **"계속"** 클릭

### 단계 3: Google Analytics 설정 (선택사항)
1. Google Analytics 사용 여부 선택
   - 개발 단계에서는 비활성화 권장
   - 프로덕션에서는 활성화 권장
2. **"프로젝트 만들기"** 클릭
3. 프로젝트 생성 완료 대기 (약 30초)

---

## 2. Authentication 설정

### 단계 1: Authentication 활성화
1. 좌측 메뉴에서 **"Authentication"** 클릭
2. **"시작하기"** 또는 **"Get started"** 클릭

### 단계 2: 이메일/비밀번호 로그인 활성화
1. **"Sign-in method"** 탭 클릭
2. **"이메일/비밀번호"** 또는 **"Email/Password"** 클릭
3. **첫 번째 스위치** 활성화 (이메일/비밀번호)
4. **"저장"** 클릭

### 단계 3: Google 로그인 활성화
1. 같은 페이지에서 **"Google"** 클릭
2. 스위치 활성화
3. **프로젝트 지원 이메일** 선택 (본인 이메일)
4. **"저장"** 클릭

✅ **완료!** 이제 사용자가 이메일 또는 Google로 로그인할 수 있습니다.

---

## 3. Realtime Database 설정

### 단계 1: Database 생성
1. 좌측 메뉴에서 **"Realtime Database"** 클릭
2. **"데이터베이스 만들기"** 또는 **"Create Database"** 클릭

### 단계 2: 위치 선택
1. Database 위치 선택
   - **한국/일본 사용자**: `asia-southeast1` (싱가포르) 권장
   - **미국 사용자**: `us-central1` 권장
2. **"다음"** 클릭

### 단계 3: 보안 규칙 선택
1. **"테스트 모드로 시작"** 선택
   - ⚠️ 개발 단계에서만 사용
   - 30일 후 자동으로 비활성화됨
2. **"사용 설정"** 클릭
3. Database 생성 완료 대기

### 단계 4: Database URL 확인
1. Database 페이지 상단에 URL 표시됨
   - 예: `https://your-project-default-rtdb.firebaseio.com/`
2. 이 URL을 나중에 사용하므로 복사해두세요

---

## 4. Storage 설정

### 단계 1: Storage 활성화
1. 좌측 메뉴에서 **"Storage"** 클릭
2. **"시작하기"** 또는 **"Get started"** 클릭

### 단계 2: 보안 규칙 확인
1. 기본 보안 규칙 확인 (테스트 모드)
2. **"다음"** 클릭

### 단계 3: 위치 선택
1. Realtime Database와 동일한 위치 선택 권장
2. **"완료"** 클릭
3. Storage 생성 완료 대기

✅ **완료!** 이제 파일을 업로드할 수 있습니다.

---

## 5. 설정값 적용

### 단계 1: Firebase 설정 정보 가져오기
1. 좌측 메뉴 상단의 **⚙️ (설정 아이콘)** 클릭
2. **"프로젝트 설정"** 클릭
3. 아래로 스크롤하여 **"내 앱"** 섹션으로 이동

### 단계 2: 웹 앱 등록 (처음인 경우)
1. **"</>" (웹 아이콘)** 클릭
2. 앱 닉네임 입력 (예: `TeamFlow Web`)
3. ~~"Firebase 호스팅 설정"은 체크하지 않음~~
4. **"앱 등록"** 클릭

### 단계 3: 설정 정보 복사
1. **"Firebase SDK 구성"** 섹션에서 설정 정보 확인
2. 다음과 같은 형태의 정보가 표시됨:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

3. 전체 내용을 복사

### 단계 4: 프로젝트에 적용
1. 프로젝트 폴더에서 `firebase-config.js` 파일 열기
2. 기존 설정값을 복사한 내용으로 교체:

```javascript
const firebaseConfig = {
    apiKey: "여기에_본인의_API_KEY",
    authDomain: "여기에_본인의_AUTH_DOMAIN",
    databaseURL: "여기에_본인의_DATABASE_URL",
    projectId: "여기에_본인의_PROJECT_ID",
    storageBucket: "여기에_본인의_STORAGE_BUCKET",
    messagingSenderId: "여기에_본인의_SENDER_ID",
    appId: "여기에_본인의_APP_ID"
};
```

3. 파일 저장

---

## 6. 보안 규칙 설정

### Realtime Database 보안 규칙

1. **Realtime Database** 메뉴로 이동
2. **"규칙"** 또는 **"Rules"** 탭 클릭
3. 다음 규칙으로 교체:

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

4. **"게시"** 또는 **"Publish"** 클릭

### Storage 보안 규칙

1. **Storage** 메뉴로 이동
2. **"Rules"** 탭 클릭
3. 다음 규칙으로 교체:

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

4. **"게시"** 또는 **"Publish"** 클릭

---

## ✅ 설정 완료 확인

### 체크리스트
- [ ] Firebase 프로젝트 생성됨
- [ ] Authentication 활성화 (이메일 + Google)
- [ ] Realtime Database 생성됨
- [ ] Storage 활성화됨
- [ ] firebase-config.js에 설정값 입력됨
- [ ] 보안 규칙 설정됨

### 테스트
1. `index.html` 파일을 브라우저로 열기
2. 회원가입 시도
3. 로그인 성공 확인
4. 팀 생성 시도
5. 할일 추가 시도

---

## 🚨 문제 해결

### "Firebase initialization failed" 오류
**원인**: `firebase-config.js` 설정이 올바르지 않음

**해결**:
1. Firebase Console에서 설정값 다시 확인
2. `firebase-config.js`의 모든 값이 정확히 입력되었는지 확인
3. 따옴표, 쉼표 등 문법 오류 확인

### "Permission denied" 오류
**원인**: Database 또는 Storage 보안 규칙 문제

**해결**:
1. Firebase Console > Realtime Database > Rules 확인
2. Firebase Console > Storage > Rules 확인
3. 위의 보안 규칙이 정확히 설정되었는지 확인
4. "게시" 버튼을 눌렀는지 확인

### Google 로그인이 안됨
**원인**: Google 로그인이 활성화되지 않음

**해결**:
1. Firebase Console > Authentication > Sign-in method
2. Google 제공업체가 "사용 설정됨"인지 확인
3. 프로젝트 지원 이메일이 설정되었는지 확인

### Database URL을 찾을 수 없음
**원인**: Realtime Database가 생성되지 않음

**해결**:
1. Firebase Console > Realtime Database
2. "데이터베이스 만들기" 버튼이 보이면 아직 생성되지 않은 것
3. Database 생성 후 URL 확인

---

## 💰 비용 안내

### 무료 플랜 (Spark Plan)
- Authentication: 무제한
- Realtime Database: 1GB 저장소, 10GB/월 다운로드
- Storage: 5GB 저장소, 1GB/일 다운로드
- **소규모 팀에 충분함**

### 유료 플랜 (Blaze Plan)
- 사용한 만큼 지불
- 무료 할당량 초과 시에만 과금
- 대규모 팀이나 많은 파일 업로드 시 필요

---

## 🔐 보안 강화 (프로덕션용)

### 1. Database 규칙 강화
팀 멤버만 해당 팀 데이터에 접근 가능하도록:

```json
{
  "rules": {
    "todos": {
      "$teamId": {
        ".read": "root.child('teamMembers').child($teamId).child(auth.uid).exists()",
        ".write": "root.child('teamMembers').child($teamId).child(auth.uid).exists()"
      }
    }
  }
}
```

### 2. Storage 규칙 강화
파일 크기 제한 및 타입 검증:

```
match /teams/{teamId}/{allPaths=**} {
  allow read: if request.auth != null;
  allow write: if request.auth != null 
              && request.resource.size < 10 * 1024 * 1024  // 10MB 제한
              && request.resource.contentType.matches('image/.*|application/pdf|application/msword|.*');
}
```

### 3. API Key 보호
- 환경 변수 사용
- .gitignore에 firebase-config.js 추가
- 프로덕션 배포 시 환경 변수로 설정

---

## 📞 추가 도움

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firebase Authentication 가이드](https://firebase.google.com/docs/auth)
- [Realtime Database 가이드](https://firebase.google.com/docs/database)
- [Storage 가이드](https://firebase.google.com/docs/storage)

---

**설정이 완료되었습니다! 🎉**

이제 TeamFlow를 사용할 준비가 되었습니다!
