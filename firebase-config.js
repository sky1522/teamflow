// Firebase 설정
// Firebase Console (https://console.firebase.google.com/)에서 프로젝트를 만들고
// 아래 설정값을 자신의 프로젝트 설정으로 교체하세요

const firebaseConfig = {
    // 여기에 Firebase 프로젝트 설정을 입력하세요
    // Firebase Console > 프로젝트 설정 > 일반 > 내 앱 > Firebase SDK snippet > 구성
    
    apiKey: "AIzaSyDXal0txghgtJw4qYJ1tJ4A4WZAvg1V6oM",
    authDomain: "teamflow-dbf41.firebaseapp.com",
    databaseURL: "https://teamflow-dbf41-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "teamflow-dbf41",
    storageBucket: "teamflow-dbf41.firebasestorage.app",
    messagingSenderId: "817457533524",
    appId: "1:817457533524:web:1b15a4b3ff33cb14f613c1",
    measurementId: "G-B61WXENSGV"
};

// Firebase 초기화
try {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase 초기화 성공");
} catch (error) {
    console.error("❌ Firebase 초기화 실패:", error);
    alert("Firebase 설정이 필요합니다. firebase-config.js 파일을 확인하세요.");
}

// Firebase 서비스
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

// Google 인증 Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
