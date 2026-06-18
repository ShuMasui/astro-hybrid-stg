import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// エミュレータを使用するため、設定値はデモ用のダミー値で問題ありません
const firebaseConfig = {
  apiKey: "AIzaSyDH3rAheNfzPxX7PIbDD6wgcNttROh0xwU",
  authDomain: "astro-hybrid-stg.firebaseapp.com",
  projectId: "astro-hybrid-stg",
  storageBucket: "astro-hybrid-stg.firebasestorage.app",
  messagingSenderId: "770975578599",
  appId: "1:770975578599:web:c071781bd065a38403a542",
  measurementId: "G-6TBYJKYND9"
};

// AstroのSSR対応（サーバー側で多重初期化されるのを防ぐ）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// ブラウザ環境かつローカルホストの場合、自動的にAuthエミュレータ（ポート9099）へ接続
if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    console.log("[Firebase] Auth Emulator に接続しました: http://127.0.0.1:9099");
  }
}

export { app, auth };
