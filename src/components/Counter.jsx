import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl shadow-xl w-full max-w-xs mx-auto backdrop-blur-sm">
      <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-1">Interactive Island</span>
      <h3 className="text-lg font-bold text-slate-100 mb-2">React カウンター</h3>
      
      <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 my-4 font-mono transition-all duration-300">
        {count}
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={() => setCount(count - 1)}
          className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-semibold rounded-xl transition border border-slate-600 cursor-pointer text-sm"
        >
          - 1
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/15 cursor-pointer text-sm"
        >
          + 1
        </button>
      </div>
    </div>
  );
}
