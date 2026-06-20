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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
      
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
      
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
    <div className="max-w-md w-full bg-slate-900 border border-slate-850 rounded-xl p-8">
      <div className="text-center mb-8">
        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs font-semibold tracking-wide uppercase">
          Firebase Authentication
        </span>
        <h1 className="text-2xl font-bold text-slate-100 mt-3 mb-2">
          会員限定ゲートウェイ
        </h1>
        <p className="text-slate-400 text-xs leading-relaxed">
          ログインするか、メールアドレスとパスワードを入力して新規登録を行ってください。
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
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded focus:border-slate-700 outline-none text-slate-100 text-sm transition"
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
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded focus:border-slate-700 outline-none text-slate-100 text-sm transition"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 text-xs rounded">
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <button 
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold rounded border border-slate-700 transition cursor-pointer text-center text-sm disabled:opacity-50"
          >
            {loading ? '処理中...' : 'ログインする'}
          </button>
          
          <button 
            onClick={handleSignUp}
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-semibold rounded border border-slate-800 transition cursor-pointer text-center text-sm disabled:opacity-50"
          >
            新規メンバー登録する
          </button>
        </div>
      </form>
    </div>
  );
}
