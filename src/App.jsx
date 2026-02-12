import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 道具資料庫 (SSR 效果升級為：直接顯示答案！) ---
const ITEMS_DB = [
  // --- SSR (傳說級) 5種 - 效果：看見答案 ---
  { id: 1, name: '暴龍透視鏡', rarity: 'SSR', icon: '🦖', effect: '直接顯示答案', desc: '戴上它，數學難題變透明了！' },
  { id: 2, name: '先知的石板', rarity: 'SSR', icon: '🗿', effect: '直接顯示答案', desc: '上面早就刻好了正確解答。' },
  { id: 3, name: '黃金計算機', rarity: 'SSR', icon: '🧮', effect: '直接顯示答案', desc: '雖然是石頭做的，但算得超快。' },
  { id: 4, name: '智慧長老之靈', rarity: 'SSR', icon: '👻', effect: '直接顯示答案', desc: '長老在耳邊悄悄告訴你答案。' },
  { id: 5, name: '外星人頭盔', rarity: 'SSR', icon: '👽', effect: '直接顯示答案', desc: '來自未來的科技，秒解算式。' },
  
  // --- SR (稀有級) 10種 - 效果：分數+10 ---
  { id: 6, name: '黑曜石矛', rarity: 'SR', icon: '🗡️', effect: '分數+10', desc: '鋒利無比，狩獵必備。' },
  { id: 7, name: '劍齒虎皮', rarity: 'SR', icon: '🐯', effect: '分數+10', desc: '穿上去充滿勇氣！' },
  { id: 8, name: '琥珀項鍊', rarity: 'SR', icon: '📿', effect: '分數+10', desc: '凝結了時間的寶石。' },
  { id: 9, name: '雷龍蛋', rarity: 'SR', icon: '🥚', effect: '分數+10', desc: '充滿生命力的大蛋。' },
  { id: 10, name: '薩滿面具', rarity: 'SR', icon: '👺', effect: '分數+10', desc: '戴上後頭腦變靈活了。' },
  { id: 11, name: '巨大烤腿肉', rarity: 'SR', icon: '🍖', effect: '分數+10', desc: '吃飽了才有力氣算數！' },
  { id: 12, name: '精緻石輪', rarity: 'SR', icon: '⚙️', effect: '分數+10', desc: '滾動吧！科技的起點。' },
  { id: 13, name: '水晶蘑菇', rarity: 'SR', icon: '🍄', effect: '分數+10', desc: '發出智慧的光芒。' },
  { id: 14, name: '部落號角', rarity: 'SR', icon: '📯', effect: '分數+10', desc: '吹響勝利的聲音！' },
  { id: 15, name: '獸骨迴力鏢', rarity: 'SR', icon: '🪃', effect: '分數+10', desc: '百發百中的好幫手。' },

  // --- S (實用級) 15種 - 效果：分數+5 ---
  { id: 16, name: '堅固石碗', rarity: 'S', icon: '🥣', effect: '分數+5', desc: '磨得很光滑，很好用。' },
  { id: 17, name: '美味烤魚', rarity: 'S', icon: '🐟', effect: '分數+5', desc: '香噴噴的，補充體力。' },
  { id: 18, name: '乾燥木柴', rarity: 'S', icon: '🪵', effect: '分數+5', desc: '生火必備，帶來溫暖。' },
  { id: 19, name: '漂亮的鵝卵石', rarity: 'S', icon: '🪨', effect: '分數+5', desc: '圓潤可愛，帶來好運。' },
  { id: 20, name: '結實草鞋', rarity: 'S', icon: '👡', effect: '分數+5', desc: '走再遠的路也不怕。' },
  { id: 21, name: '幸運四葉草', rarity: 'S', icon: '🍀', effect: '分數+5', desc: '找到它，考試都考100分。' },
  { id: 22, name: '大片樹葉', rarity: 'S', icon: '🍃', effect: '分數+5', desc: '可以當雨傘，也能扇風。' },
  { id: 23, name: '堅硬果殼', rarity: 'S', icon: '🥥', effect: '分數+5', desc: '可以做成樂器喔。' },
  { id: 24, name: '彩色貝殼', rarity: 'S', icon: '🐚', effect: '分數+5', desc: '聽得到海浪的聲音。' },
  { id: 25, name: '強韌藤蔓', rarity: 'S', icon: '➰', effect: '分數+5', desc: '非常結實，很有用處。' },
  { id: 26, name: '石製湯匙', rarity: 'S', icon: '🥄', effect: '分數+5', desc: '喝湯更方便了。' },
  { id: 27, name: '野果籃', rarity: 'S', icon: '🧺', effect: '分數+5', desc: '裝滿了甜甜的果實。' },
  { id: 28, name: '鮮豔羽毛', rarity: 'S', icon: '🪶', effect: '分數+5', desc: '可以拿來做裝飾。' },
  { id: 29, name: '螢火蟲罐', rarity: 'S', icon: '🏺', effect: '分數+5', desc: '微弱的光芒，指引方向。' },
  { id: 30, name: '原始畫筆', rarity: 'S', icon: '🖌️', effect: '分數+5', desc: '在山洞牆壁畫畫吧！' },
];

// --- 題目生成核心 ---
const generateQuestion = () => {
  const categories = ['addition', 'multiplication', 'placeValue', 'measurement', 'logic'];
  const type = categories[Math.floor(Math.random() * categories.length)];

  switch (type) {
    case 'addition': // 簡單：10分
      const a1 = Math.floor(Math.random() * 50) + 10;
      const b1 = Math.floor(Math.random() * 40) + 5;
      return { q: `${a1} + ${b1} = ?`, a: a1 + b1, unit: '', points: 10, level: '採集果實 (簡單)' };
    case 'measurement': // 中等：15分
      const m = Math.floor(Math.random() * 8) + 2;
      return { q: `${m} 公尺 = 幾公分？`, a: m * 100, unit: '公分', points: 15, level: '測量恐龍 (中等)' };
    case 'placeValue': // 中等：20分
      const val = Math.floor(Math.random() * 900) + 100;
      const isHundreds = Math.random() > 0.5;
      const ansPlace = isHundreds ? Math.floor(val / 100) : Math.floor((val % 100) / 10);
      return { q: `數字 ${val} 的${isHundreds ? '百' : '十'}位數是？`, a: ansPlace, unit: '', points: 20, level: '石板密碼 (中等)' };
    case 'multiplication': // 困難：25分
      const m1 = Math.floor(Math.random() * 8) + 2;
      const m2 = Math.floor(Math.random() * 8) + 2;
      return { q: `${m1} × ${m2} = ?`, a: m1 * m2, unit: '', points: 25, level: '猛獸對決 (困難)' };
    case 'logic': // 挑戰：30分
      const total = Math.floor(Math.random() * 20) + 10;
      const evenTotal = total % 2 === 0 ? total : total + 1;
      return { q: `${evenTotal} 塊肉平分給 2 人，每人拿？`, a: evenTotal / 2, unit: '塊', points: 30, level: '部落分肉 (挑戰)' };
    default:
      return { q: "10 + 10 = ?", a: 20, unit: '', points: 5, level: '熱身' };
  }
};

const MathJungleGame = () => {
  const [currentQ, setCurrentQ] = useState(generateQuestion());
  const [userInput, setUserInput] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(1000); // 預設給1000好測試
  const [combo, setCombo] = useState(0);
  const [msg, setMsg] = useState('Yabba Dabba Doo！');
  
  // --- 轉蛋與背包狀態 ---
  const [view, setView] = useState('game'); // 'game', 'gacha', 'bag'
  const [inventory, setInventory] = useState([]); // 擁有的道具ID
  const [equippedItem, setEquippedItem] = useState(null); // 裝備中的道具ID
  const [gachaResult, setGachaResult] = useState(null); // 抽蛋結果

  // --- 神器效果：自動填入答案 ---
  useEffect(() => {
    if (equippedItem) {
      const item = ITEMS_DB.find(i => i.id === equippedItem);
      // 如果裝備的是 SSR，直接把答案填進去！
      if (item.rarity === 'SSR') {
        setUserInput(currentQ.a);
        setMsg(`✨ 神器發威！${item.name} 告訴了你答案！`);
      }
    }
  }, [currentQ, equippedItem]); // 當題目變更或換裝備時觸發

  // 計算分數加成
  const getBonusPoints = () => {
    if (!equippedItem) return 0;
    const item = ITEMS_DB.find(i => i.id === equippedItem);
    // SSR 雖然直接給答案，但不額外加分了(因為已經無敵)，SR和S繼續加分
    if (item.rarity === 'SR') return 10;
    if (item.rarity === 'S') return 5;
    return 0;
  };

  // 檢查答案
  const checkAnswer = () => {
    const userVal = parseInt(userInput);
    if (userVal === currentQ.a) {
      const bonus = getBonusPoints();
      const finalPoints = currentQ.points + (combo * 5) + bonus;
      setScore(score + finalPoints);
      setCombo(combo + 1);
      setShowReward(true);
      setMsg(bonus > 0 ? `道具加持(+${bonus})！獲得 ${finalPoints} 石幣！` : `答對啦！獲得 ${finalPoints} 石幣！`);
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

  // --- 抽蛋邏輯 ---
  const handleGacha = () => {
    if (score < 100) {
      setMsg("石幣不夠啦！快去算數學賺錢！");
      return;
    }
    setScore(score - 100);
    
    // 機率：SSR 5%, SR 25%, S 70%
    const rand = Math.random() * 100;
    let rarity = 'S';
    if (rand < 5) rarity = 'SSR';
    else if (rand < 30) rarity = 'SR';

    const pool = ITEMS_DB.filter(i => i.rarity === rarity);
    const item = pool[Math.floor(Math.random() * pool.length)];

    setInventory([...inventory, item.id]); 
    setGachaResult(item);
  };

  // --- 渲染遊戲主畫面 ---
  const renderGame = () => {
    const equippedItemData = equippedItem ? ITEMS_DB.find(i => i.id === equippedItem) : null;
    const isSSR = equippedItemData?.rarity === 'SSR';

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="w-full max-w-md flex flex-col items-center relative z-10"
      >
        {/* 裝備顯示 */}
        {equippedItemData && (
          <div className={`absolute -top-16 right-0 p-2 rounded-xl border-2 text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce ${isSSR ? 'bg-purple-900 text-yellow-300 border-yellow-400' : 'bg-stone-800 text-yellow-400 border-yellow-600'}`}>
            <span>裝備中: {equippedItemData.icon} {equippedItemData.name}</span>
            <span>{isSSR ? '✨ 自動解題 ✨' : `+${getBonusPoints()}分`}</span>
          </div>
        )}

        {/* 題目卡片 */}
        <div className={`w-full p-8 rounded-[2rem] border-[6px] shadow-[10px_10px_0px_0px_rgba(60,60,60,0.5)] relative transition-colors duration-500 ${isSSR ? 'bg-purple-100 border-purple-500' : 'bg-stone-200 border-stone-700'}`}>
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-orange-400 text-stone-900 px-6 py-2 rounded-xl text-lg font-black border-4 border-stone-800 shadow-sm rotate-1 whitespace-nowrap">
             {currentQ.level} (+{currentQ.points}) 
          </div>

          <div className="mt-8 mb-8 text-center">
            <h2 className="text-4xl font-black text-stone-800 mb-2">{currentQ.q}</h2>
            {currentQ.unit && <p className="text-stone-500 font-bold text-lg">({currentQ.unit})</p>}
          </div>

          <div className="relative">
            <input
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="?"
              className={`w-full text-center text-5xl font-black py-4 border-b-8 rounded-xl transition-all mb-6 ${isSSR ? 'bg-yellow-100 text-purple-600 border-purple-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-stone-300 text-stone-700 border-stone-400'}`}
            />
            {isSSR && <div className="absolute right-4 top-6 text-2xl animate-pulse">✨</div>}
          </div>

          <button
            onClick={checkAnswer}
            disabled={showReward}
            className={`w-full text-white font-black py-4 rounded-2xl text-2xl border-4 shadow-[0_6px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-2 transition-all ${isSSR ? 'bg-purple-600 border-purple-900 hover:bg-purple-500' : 'bg-orange-500 border-stone-800 hover:bg-orange-400'}`}
          >
            {isSSR ? '神力解放！⚡' : '擲出石斧！🪓'}
          </button>
        </div>
        <p className="mt-6 font-bold text-stone-600 bg-white/50 px-4 py-2 rounded-full">{msg}</p>
      </motion.div>
    );
  };

  // --- 渲染抽蛋機畫面 ---
  const renderGacha = () => (
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full max-w-md bg-stone-200 p-6 rounded-3xl border-8 border-stone-700 relative z-10 text-center">
      <h2 className="text-3xl font-black text-stone-800 mb-4">恐龍蛋轉蛋機</h2>
      <div className="text-9xl mb-6 animate-pulse">🥚</div>
      <p className="mb-6 font-bold text-stone-600">一次 100 石幣 / 保證有獎</p>
      
      <button 
        onClick={handleGacha}
        className="w-full bg-green-600 text-white font-black py-4 rounded-2xl text-xl border-b-8 border-green-800 active:border-b-0 active:translate-y-2 mb-4"
      >
        抽一顆蛋 (-100💰)
      </button>
      
      <button onClick={() => setView('game')} className="text-stone-500 font-bold underline">回到遊戲</button>

      {/* 抽蛋結果彈窗 */}
      <AnimatePresence>
        {gachaResult && (
          <motion.div 
            initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }}
            className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 z-20"
          >
            <div className={`text-sm font-bold mb-2 ${gachaResult.rarity === 'SSR' ? 'text-purple-600' : gachaResult.rarity === 'SR' ? 'text-red-500' : 'text-green-600'}`}>
              {gachaResult.rarity === 'SSR' ? '✨ 傳說 ✨' : gachaResult.rarity === 'SR' ? '🔥 稀有 🔥' : '🌱 實用 🌱'}
            </div>
            <div className="text-8xl mb-4">{gachaResult.icon}</div>
            <h3 className="text-2xl font-black text-stone-800 mb-2">{gachaResult.name}</h3>
            <p className="text-stone-600 mb-2">{gachaResult.desc}</p>
            <p className="text-orange-600 font-bold mb-6 text-xl">{gachaResult.effect}</p>
            <button onClick={() => setGachaResult(null)} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold border-b-4 border-orange-700 active:border-b-0">收下道具</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // --- 渲染背包畫面 ---
  const renderBag = () => {
    // 過濾出獨特的道具ID並計算數量
    const uniqueItems = [...new Set(inventory)].map(id => {
      const item = ITEMS_DB.find(i => i.id === id);
      const count = inventory.filter(i => i === id).length;
      return { ...item, count };
    });

    return (
      <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="w-full max-w-md bg-stone-200 p-6 rounded-3xl border-8 border-stone-700 h-[70vh] flex flex-col z-10">
        <h2 className="text-2xl font-black text-stone-800 mb-4 flex justify-between items-center">
          <span>🎒 部落背包</span>
          <button onClick={() => setView('game')} className="text-sm bg-stone-400 text-white px-3 py-1 rounded-lg">關閉</button>
        </h2>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {uniqueItems.length === 0 ? (
            <div className="text-center text-stone-400 mt-20">背包空空的...<br/>快去抽蛋！</div>
          ) : (
            uniqueItems.map(item => (
              <div key={item.id} className={`p-3 rounded-xl border-4 flex items-center gap-3 ${equippedItem === item.id ? 'bg-yellow-100 border-orange-400' : 'bg-white border-stone-300'}`}>
                <div className="text-4xl">{item.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1 rounded ${item.rarity === 'SSR' ? 'bg-purple-600 text-white' : item.rarity === 'SR' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>{item.rarity}</span>
                    <span className="font-bold text-stone-800">{item.name}</span>
                    <span className="text-xs text-stone-400">x{item.count}</span>
                  </div>
                  <div className="text-xs text-stone-500">{item.desc}</div>
                  <div className="text-xs text-purple-600 font-bold">{item.effect}</div>
                </div>
                
                <button 
                  onClick={() => setEquippedItem(equippedItem === item.id ? null : item.id)}
                  className={`text-xs px-3 py-2 rounded-lg font-bold shadow-sm active:translate-y-1 transition-all ${equippedItem === item.id ? 'bg-red-500 text-white border-b-4 border-red-700' : 'bg-green-500 text-white border-b-4 border-green-700'}`}
                >
                  {equippedItem === item.id ? '卸下' : '裝備'}
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-amber-100 text-stone-800 flex flex-col items-center justify-center p-4 font-mono overflow-hidden relative selection:bg-orange-300">
      
      {/* 背景裝飾 */}
      <div className="absolute top-10 left-10 text-6xl opacity-40 animate-bounce duration-[3000ms]">☁️</div>
      <div className="absolute bottom-20 right-10 text-8xl opacity-20 -rotate-12 select-none">🦕</div>

      {/* 頂部導航欄 */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6 z-20 px-2">
        <div className="bg-stone-800 text-yellow-400 px-4 py-2 rounded-xl border-4 border-stone-600 shadow-md font-black text-xl flex items-center gap-2">
          💰 {score}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('gacha')} className="bg-green-600 text-white px-3 py-2 rounded-xl border-b-4 border-green-800 font-bold active:translate-y-1 shadow-md">
            🥚 抽蛋
          </button>
          <button onClick={() => setView('bag')} className="bg-blue-600 text-white px-3 py-2 rounded-xl border-b-4 border-blue-800 font-bold active:translate-y-1 shadow-md">
            🎒 背包
          </button>
        </div>
      </div>

      {/* 畫面切換 */}
      {view === 'game' && renderGame()}
      {view === 'gacha' && renderGacha()}
      {view === 'bag' && renderBag()}

      {/* 獎勵彈窗 */}
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.5 }} animate={{ scale: 1 }}
              className="bg-yellow-100 w-full max-w-sm p-8 rounded-[3rem] text-center border-[8px] border-orange-500 shadow-2xl"
            >
              <div className="text-7xl mb-4 animate-bounce">🍗</div>
              <h3 className="text-4xl font-black text-stone-800 mb-2">HOORAY!</h3>
              <p className="text-stone-600 font-bold mb-6">賺到了石幣！</p>
              <button onClick={nextLevel} className="w-full bg-green-500 text-white font-black py-4 rounded-2xl text-xl border-4 border-green-800 shadow-lg active:translate-y-2">
                繼續狩獵 ➜
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-2 right-2 text-stone-400 text-xs font-bold opacity-50">Math Flintstones v5.0 God Mode</div>
    </div>
  );
};

export default MathJungleGame;
