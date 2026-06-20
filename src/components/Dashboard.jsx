import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Dashboard({ serverUser }) {
  // サーバーサイドで事前に検証済みのユーザー情報がある場合、それを使って初期表示（ローディングのチラつきを防ぐ）
  const [user, setUser] = useState(serverUser);
  const [loading, setLoading] = useState(!serverUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // トークンを最新のものに同期してクッキーを更新
        const token = await currentUser.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
        setLoading(false);
      } else {
        // 未ログイン状態ならクッキーを削除してログインページへ自動リダイレクト
        document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
        window.location.href = '/membership/login';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // ログアウト時にクッキーを破棄
      document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
      window.location.href = '/membership/login';
    } catch (err) {
      console.error('Sign out failed: ', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md w-full bg-slate-900 border border-slate-850 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs mt-4">認証ステータスを確認中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-slate-900 border border-slate-850 rounded-xl p-8">
      
      <div className="flex justify-between items-center mb-6 text-xs">
        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded">
          会員制ダッシュボード
        </span>
        <span className="text-slate-500">
          JWTによるサーバー検証済
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">
            おかえりなさい！
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            サーバーサイド（Astro Frontmatter）で JWT を検証し、安全にレンダリングされたダッシュボードです。
          </p>
        </div>

        {/* ユーザー情報カード */}
        <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">ログイン中のメールアドレス</span>
            <span className="font-semibold text-slate-300">{user.email}</span>
          </div>
          <div className="border-t border-slate-850 pt-2">
            <span className="text-slate-500 block mb-0.5">Firebase ユーザーID (UID)</span>
            <span className="font-mono text-slate-400 break-all">{user.uid}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-850 text-slate-400 text-xs rounded-xl leading-relaxed">
          🛡️ **セキュリティ解説**: ブラウザのCookie（`__session`）に保存された JWT を、Astro サーバーがリクエスト受信時に `firebase-admin` を使って検証しています。検証結果は直接 React へ引き渡され、画面のちらつきなく即座にロードされます。
        </div>

        {/* 操作エリア */}
        <div className="pt-2">
          <button 
            onClick={handleSignOut}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold rounded border border-slate-700 transition cursor-pointer text-center text-sm"
          >
            安全にログアウトする
          </button>
        </div>
      </div>
    </div>
  );
}
