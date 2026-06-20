import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-850 rounded-xl w-full max-w-xs mx-auto">
      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Interactive Island</span>
      <h3 className="text-sm font-bold text-slate-300 mb-2">React カウンター</h3>
      
      <div className="text-4xl font-bold text-slate-100 my-3 font-mono">
        {count}
      </div>

      <div className="flex gap-2 w-full">
        <button
          onClick={() => setCount(count - 1)}
          className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 font-medium rounded border border-slate-800 cursor-pointer text-xs transition-colors"
        >
          - 1
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium rounded border border-slate-700 cursor-pointer text-xs transition-colors"
        >
          + 1
        </button>
      </div>
    </div>
  );
}
