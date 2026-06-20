import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// ローカル開発中の場合、自動で Auth エミュレータのホスト環境変数をセット
if (process.env.NODE_ENV !== 'production') {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  console.log('[Firebase Admin] Auth Emulator Host に接続します: 127.0.0.1:9099');
}

// プロジェクトIDをクライアント側およびエミュレータ起動ID（astro-hybrid-stg）と統一します
const app = getApps().length === 0 
  ? initializeApp({ projectId: 'astro-hybrid-stg' }) 
  : getApp();

const adminAuth = getAuth(app);
export { adminAuth };
