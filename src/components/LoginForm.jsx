import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged 
} from 'firebase/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // すでにログインしている場合はダッシュボードへリダイレクト
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = '/membership/dashboard';
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('ログインに成功しました。リダイレクト中...');
      window.location.href = '/membership/dashboard';
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('アカウント登録が完了しました！ダッシュボードへ移動します。');
      window.location.href = '/membership/dashboard';
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'メールアドレスの形式が正しくありません。';
      case 'auth/user-disabled':
        return 'このアカウントは無効化されています。';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'メールアドレスまたはパスワードが間違っています。';
      case 'auth/email-already-in-use':
        return 'このメールアドレスは既に登録されています。';
      case 'auth/weak-password':
        return 'パスワードは6文字以上で指定してください。';
      default:
        return '認証エラーが発生しました。エミュレータが起動しているか確認してください。';
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <span className="px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-xs font-bold tracking-wide uppercase">
          Firebase Authentication
        </span>
        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mt-3 mb-2">
          会員限定ゲートウェイ
        </h1>
        <p className="text-slate-400 text-xs leading-relaxed">
          ログインするか、メールアドレスとパスワードを入力して新規登録を行ってください。（Authエミュレータに接続されます）
        </p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">メールアドレス</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@example.com"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 outline-none text-slate-100 text-sm transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">パスワード</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 outline-none text-slate-100 text-sm transition"
          />
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/30 border border-red-800/20 text-red-400 text-xs rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/20 text-emerald-400 text-xs rounded-xl">
            ✨ {message}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <button 
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:scale-98 text-white font-semibold rounded-xl transition shadow-lg shadow-teal-600/10 cursor-pointer text-center text-sm disabled:opacity-50"
          >
            {loading ? '処理中...' : 'ログインする'}
          </button>
          
          <button 
            onClick={handleSignUp}
            disabled={loading}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-semibold rounded-xl transition border border-slate-700/60 cursor-pointer text-center text-sm disabled:opacity-50"
          >
            新規メンバー登録する
          </button>
        </div>
      </form>
    </div>
  );
}
