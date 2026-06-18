import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// エミュレータを使用するため、設定値はデモ用のダミー値で問題ありません
const firebaseConfig = {
  apiKey: "demo-astro-auth-key",
  authDomain: "demo-astro-auth.firebaseapp.com",
  projectId: "demo-astro-auth",
  storageBucket: "demo-astro-auth.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcdef"
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
