import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 從教材中提取的知識點題庫生成器
const generateQuestion = () => {
  const categories = ['addition', 'multiplication', 'placeValue', 'measurement'];
  const type = categories[Math.floor(Math.random() * categories.length)];

  switch (type) {
    case 'addition': // 參考 1_205 系列：100以內加減
      const a = Math.floor(Math.random() * 50) + 10;
      const b = Math.floor(Math.random() * 40) + 5;
      return { q: `${a} + ${b} = ?`, a: a + b, unit: '顆石幣' };
    case 'multiplication': // 參考 2_207 系列：九九乘法
      const m1 = Math.floor(Math.random() * 8) + 2;
      const m2 = Math.floor(Math.random() * 8) + 2;
      return { q: `${m1} x ${m2} = ?`, a: m1 * m2, unit: '隻翼龍' };
    case 'placeValue': // 參考 2_201 系列：三位數
      const val = Math.floor(Math.random() * 900) + 100;
      const digit = Math.random() > 0.5 ? '百' : '十';
      const ans = digit === '百' ? Math.floor(val / 100) : Math.floor((val % 100) / 10);
      return { q: `數字 ${val} 的${digit}位數是多少？`, a: ans, unit: '個石輪' };
    case 'measurement': // 參考 1_203 系列：長度換算
      const meter = Math.floor(Math.random() * 5) + 1;
      return { q: `${meter} 公尺等於幾公分？`, a: meter * 100, unit: '公分' };
    default:
      return { q: "20 + 30 = ?", a: 50, unit: '分' };
  }
};

const MathJungleGame = () => {
  const [currentQ, setCurrentQ] = useState(generateQuestion());
  const [userInput, setUserInput] = useState('');
  const [showTreasure, setShowTreasure] = useState(false);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState('原始人，準備好挑戰了嗎？');

  const checkAnswer = () => {
    if (parseInt(userInput) === currentQ.a) {
      setScore(score + 10);
      setShowTreasure(true);
      setMsg('喔吼！挖到寶了！');
    } else {
      setMsg('哎呀，力氣不夠，再算一次！');
      setUserInput('');
    }
  };

  const nextLevel = () => {
    setShowTreasure(false);
    setUserInput('');
    setCurrentQ(generateQuestion());
    setMsg('下一關來了，接招！');
  };

  return (
    <div className="min-h-screen bg-green-900 text-stone-100 flex flex-col items-center justify-center p-4 font-mono">
      {/* 頂部資訊 */}
      <div className="absolute top-8 flex justify-between w-full max-w-md px-6">
        <div className="bg-stone-700 border-4 border-stone-500 p-2 rounded-lg shadow-xl">
          🦴 積分: {score}
        </div>
        <div className="bg-stone-700 border-4 border-stone-500 p-2 rounded-lg shadow-xl">
          🌳 森林深度: Lv.{Math.floor(score / 50) + 1}
        </div>
      </div>

      {/* 主遊戲石板 */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-stone-300 w-full max-w-md p-8 rounded-3xl border-8 border-stone-600 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)] text-stone-800 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-4 bg-green-600 opacity-20"></div>
        
        <h2 className="text-2xl font-black mb-6 tracking-widest text-stone-600">摩登數學祭</h2>
        
        <div className="bg-stone-100 py-10 rounded-2xl border-4 border-dashed border-stone-400 mb-6 shadow-inner">
          <p className="text-sm text-stone-500 mb-2">請算出：</p>
          <p className="text-5xl font-black text-stone-900">{currentQ.q}</p>
        </div>

        <input
          type="number"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="輸入答案..."
          className="w-full text-center text-3xl p-4 bg-stone-200 border-4 border-stone-500 rounded-xl mb-4 focus:outline-none focus:ring-4 focus:ring-green-500"
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        />

        <button
          onClick={checkAnswer}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl text-xl shadow-[0_6px_0_0_#9a3412] active:shadow-none active:translate-y-1 transition-all"
        >
          擲出石斧！
        </button>

        <p className="mt-6 font-bold text-stone-600 italic">{msg}</p>
      </motion.div>

      {/* 寶物彈窗 - 確保這裡可以點擊繼續挑戰 */}
      <AnimatePresence>
        {showTreasure && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
          >
            <div className="bg-stone-200 border-8 border-yellow-600 p-8 rounded-3xl text-center max-w-xs relative">
              <div className="text-8xl mb-4">🎁</div>
              <h3 className="text-3xl font-black text-stone-800 mb-2">獲得寶物！</h3>
              <p className="text-stone-600 mb-6">獲得了 {currentQ.a} {currentQ.unit}！</p>
              
              <button
                onClick={nextLevel}
                className="bg-green-600 hover:bg-green-700 text-white font-black px-10 py-4 rounded-full text-xl shadow-[0_6px_0_0_#166534] active:shadow-none active:translate-y-1 transition-all"
              >
                繼續挑戰 ➔
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 裝飾背景元件 */}
      <div className="fixed bottom-0 left-0 text-6xl p-4 opacity-30 select-none">🌿</div>
      <div className="fixed bottom-0 right-0 text-6xl p-4 opacity-30 select-none">🪵</div>
      <div className="fixed top-20 right-10 text-4xl opacity-10 select-none">🦖</div>
    </div>
  );
};

export default MathJungleGame;
