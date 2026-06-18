import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        // 未ログイン状態ならログインページへ自動リダイレクト
        window.location.href = '/membership/login';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/membership/login';
    } catch (err) {
      console.error('Sign out failed: ', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm mt-4">認証ステータスを確認中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      
      {/* <!-- 装飾的な背景の光彩 --> */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6">
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold tracking-wide uppercase">
          会員制ダッシュボード
        </span>
        <span className="text-xs text-emerald-500 flex items-center gap-1 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          セッション保護中
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-100">
            おかえりなさい！
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            このページは認証されたメンバーのみが閲覧できる保護された領域です。
          </p>
        </div>

        {/* ユーザー情報カード */}
        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3 font-sans">
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">ログイン中のメールアドレス</span>
            <span className="text-sm font-semibold text-slate-200">{user.email}</span>
          </div>
          <div className="border-t border-slate-900 pt-2">
            <span className="text-xs text-slate-500 block mb-0.5">Firebase ユーザーID (UID)</span>
            <span className="text-xs font-mono text-slate-400 break-all">{user.uid}</span>
          </div>
        </div>

        <div className="p-4 bg-teal-950/20 border border-teal-800/20 text-teal-400 text-xs rounded-2xl leading-relaxed">
          🔒 **セキュリティ解説**: クライアントサイドでの Firebase Auth 監視により、未認証ユーザーがこのルート（`/membership/dashboard`）にアクセスした場合は、即座にログイン画面へと追い返すガード処理を行っています。
        </div>

        {/* 操作エリア */}
        <div className="pt-2">
          <button 
            onClick={handleSignOut}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700/80 active:scale-98 text-slate-200 font-semibold rounded-xl transition border border-slate-700/60 cursor-pointer text-center text-sm"
          >
            安全にログアウトする
          </button>
        </div>
      </div>
    </div>
  );
}
