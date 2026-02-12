import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 題目生成核心邏輯 (保留你要求的積分制) ---
const generateQuestion = () => {
  const categories = ['addition', 'multiplication', 'placeValue', 'measurement', 'logic'];
  const type = categories[Math.floor(Math.random() * categories.length)];

  switch (type) {
    case 'addition': // 簡單：10分
      const a1 = Math.floor(Math.random() * 50) + 10;
      const b1 = Math.floor(Math.random() * 40) + 5;
      return { 
        q: `${a1} + ${b1} = ?`, 
        a: a1 + b1, 
        unit: '', 
        points: 10, 
        level: '採集果實 (簡單)' 
      };

    case 'measurement': // 中等：15分
      const m = Math.floor(Math.random() * 8) + 2;
      return { 
        q: `${m} 公尺 = 幾公分？`, 
        a: m * 100, 
        unit: '公分', 
        points: 15, 
        level: '測量恐龍 (中等)' 
      };

    case 'placeValue': // 中等：20分
      const val = Math.floor(Math.random() * 900) + 100;
      const isHundreds = Math.random() > 0.5;
      const ansPlace = isHundreds ? Math.floor(val / 100) : Math.floor((val % 100) / 10);
      return { 
        q: `數字 ${val} 的${isHundreds ? '百' : '十'}位數是？`, 
        a: ansPlace, 
        unit: '', 
        points: 20, 
        level: '石板密碼 (中等)' 
      };

    case 'multiplication': // 困難：25分
      const m1 = Math.floor(Math.random() * 8) + 2;
      const m2 = Math.floor(Math.random() * 8) + 2;
      return { 
        q: `${m1} × ${m2} = ?`, 
        a: m1 * m2, 
        unit: '', 
        points: 25, 
        level: '猛獸對決 (困難)' 
      };

    case 'logic': // 挑戰：30分
      const total = Math.floor(Math.random() * 20) + 10;
      const evenTotal = total % 2 === 0 ? total : total + 1;
      return {
        q: `${evenTotal} 塊肉平分給 2 人，每人拿？`,
        a: evenTotal / 2,
        unit: '塊',
        points: 30,
        level: '部落分肉 (挑戰)' 
      };

    default:
      return { q: "10 + 10 = ?", a: 20, unit: '', points: 5, level: '熱身' };
  }
};

const MathJungleGame = () => {
  const [currentQ, setCurrentQ] = useState(generateQuestion());
  const [userInput, setUserInput] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [msg, setMsg] = useState('Yabba Dabba Doo！準備好了嗎？');

  // 檢查答案
  const checkAnswer = () => {
    const userVal = parseInt(userInput);
    if (userVal === currentQ.a) {
      const finalPoints = currentQ.points + (combo * 5); // 連擊加分更多
      setScore(score + finalPoints);
      setCombo(combo + 1);
      setShowReward(true);
      setMsg('答對啦！晚餐有著落了！');
    } else {
      setMsg('哎呀！被石頭絆倒了，再試一次！');
      setCombo(0);
      setUserInput('');
    }
  };

  const nextLevel = () => {
    setShowReward(false);
    setUserInput('');
    setCurrentQ(generateQuestion());
    setMsg('下一隻猛獸來了！小心！');
  };

  return (
    <div className="min-h-screen bg-amber-100 text-stone-800 flex flex-col items-center justify-center p-4 font-mono overflow-hidden relative selection:bg-orange-300">
      
      {/* --- 背景裝飾元素 (摩登原始人風) --- */}
      {/* 遠景山脈 */}
      <div className="absolute bottom-0 w-full h-1/3 bg-stone-300 rounded-t-[50%] scale-150 z-0 opacity-50"></div>
      {/* 飄浮的雲/恐龍 */}
      <div className="absolute top-10 left-10 text-6xl opacity-40 animate-bounce duration-[3000ms]">☁️</div>
      <div className="absolute top-20 right-20 text-8xl opacity-20 -rotate-12 select-none">🦕</div>
      <div className="absolute bottom-10 left-5 text-6xl opacity-30 rotate-12 select-none">🍖</div>
      <div className="absolute bottom-20 right-10 text-5xl opacity-30 select-none">🌵</div>

      {/* --- 頂部計分板 (像掛在樹上的木牌) --- */}
      <div className="w-full max-w-lg flex justify-between items-start mb-6 z-10 gap-4">
        {/* 分數板 */}
        <div className="flex-1 bg-orange-200 border-4 border-stone-800 p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(40,40,40,1)] flex flex-col items-center transform -rotate-2">
          <span className="text-xs font-bold text-stone-600 uppercase tracking-widest">Score</span>
          <span className="text-3xl font-black text-stone-900 flex items-center gap-2">
            🦴 {score}
          </span>
        </div>
        
        {/* 連擊板 */}
        <div className="flex-1 bg-orange-200 border-4 border-stone-800 p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(40,40,40,1)] flex flex-col items-center transform rotate-2">
          <span className="text-xs font-bold text-stone-600 uppercase tracking-widest">Combo</span>
          <span className="text-3xl font-black text-red-600 flex items-center gap-2">
            🔥 {combo}
          </span>
        </div>
      </div>

      {/* --- 遊戲主石板 --- */}
      <motion.div 
        key={currentQ.q}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-stone-200 w-full max-w-md p-8 rounded-[2rem] border-[6px] border-stone-700 shadow-[10px_10px_0px_0px_rgba(60,60,60,0.5)] relative z-10"
      >
        {/* 骨頭裝飾釘子 */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-stone-400 rounded-full border-2 border-stone-600"></div>
        <div className="absolute top-4 right-4 w-4 h-4 bg-stone-400 rounded-full border-2 border-stone-600"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-stone-400 rounded-full border-2 border-stone-600"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 bg-stone-400 rounded-full border-2 border-stone-600"></div>

        {/* 難度標籤 (豹紋風格) */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-orange-400 text-stone-900 px-6 py-2 rounded-xl text-lg font-black border-4 border-stone-800 shadow-sm rotate-1 whitespace-nowrap">
           {currentQ.level} (+{currentQ.points}) 
        </div>

        {/* 題目區 */}
        <div className="mt-8 mb-8 text-center">
          <h2 className="text-4xl font-black text-stone-800 mb-2 drop-shadow-sm" style={{ fontFamily: 'Arial Black, sans-serif' }}>
            {currentQ.q}
          </h2>
          {currentQ.unit && (
            <p className="text-stone-500 font-bold text-lg">({currentQ.unit})</p>
          )}
        </div>

        {/* 輸入框 (像刻在石頭上) */}
        <div className="relative">
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="?"
            className="w-full text-center text-5xl font-black py-4 bg-stone-300 border-b-8 border-stone-400 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-orange-500 transition-all mb-6"
            onKeyPress={(e) => e.key === 'Enter' && !showReward && checkAnswer()}
          />
        </div>

        {/* 擲石斧按鈕 */}
        <button
          onClick={checkAnswer}
          disabled={showReward}
          className="w-full group relative bg-orange-500 hover:bg-orange-400 text-white font-black py-4 rounded-2xl text-2xl border-4 border-stone-800 shadow-[0_6px_0_0_#292524] active:shadow-none active:translate-y-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="drop-shadow-md">擲出石斧！🪓</span>
        </button>

        {/* 訊息回饋 */}
        <p className="text-center text-stone-600 mt-6 font-bold text-lg min-h-[1.5rem]">
          {msg}
        </p>
      </motion.div>

      {/* --- 寶箱彈窗 (獲得獵物) --- */}
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0, transition: { type: "spring", bounce: 0.5 } }}
              className="bg-yellow-100 w-full max-w-sm p-8 rounded-[3rem] text-center border-[8px] border-orange-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
            >
              {/* 慶祝彩帶 */}
              <div className="text-7xl mb-4 animate-bounce">🍗</div>
              
              <h3 className="text-4xl font-black text-stone-800 mb-2 uppercase" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                HOORAY!
              </h3>
              
              <div className="bg-white/50 p-4 rounded-xl mb-6 border-2 border-yellow-300">
                <p className="text-stone-600 font-bold text-lg">獲得獵物積分</p>
                <p className="text-5xl font-black text-orange-600">
                  +{currentQ.points + (combo * 5)}
                </p>
              </div>

              <button
                onClick={nextLevel}
                className="w-full bg-green-500 hover:bg-green-400 text-white font-black py-4 rounded-2xl text-xl border-4 border-green-800 shadow-[0_6px_0_0_#166534] active:shadow-none active:translate-y-2 transition-all"
              >
                繼續狩獵 ➜
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-2 right-2 text-stone-400 text-xs font-bold opacity-50">
        Math Flintstones v2.0
      </div>
    </div>
  );
};

export default MathJungleGame;
