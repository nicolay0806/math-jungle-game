import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 道具資料庫 ---
const ITEMS_DB = [
  // --- SSR (傳說級) - 消耗品：一次性顯示答案 ---
  { id: 1, name: '暴龍透視鏡', rarity: 'SSR', icon: '🦖', effect: '看穿答案 (消耗)', desc: '一次性神器，使用後消失。' },
  { id: 2, name: '先知的石板', rarity: 'SSR', icon: '🗿', effect: '看穿答案 (消耗)', desc: '上面刻著正解，用完會風化。' },
  { id: 3, name: '黃金計算機', rarity: 'SSR', icon: '🧮', effect: '看穿答案 (消耗)', desc: '古文明科技，電力僅供一次。' },
  { id: 4, name: '智慧長老之靈', rarity: 'SSR', icon: '👻', effect: '看穿答案 (消耗)', desc: '召喚長老代答，之後需休息。' },
  { id: 5, name: '外星人頭盔', rarity: 'SSR', icon: '👽', effect: '看穿答案 (消耗)', desc: '接收宇宙訊號，用過即丟。' },
  
  // --- SR (稀有級) - 裝備：分數+10 ---
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

  // --- S (實用級) - 裝備：分數+5 ---
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
const generateQuestion = (isBoss = false) => {
  const categories = ['addition', 'multiplication', 'placeValue', 'measurement', 'logic'];
  const type = categories[Math.floor(Math.random() * categories.length)];

  // 魔王關卡題目可以稍微難一點點，或是保持原樣
  switch (type) {
    case 'addition': 
      const a1 = Math.floor(Math.random() * 50) + 10;
      const b1 = Math.floor(Math.random() * 40) + 5;
      return { q: `${a1} + ${b1} = ?`, a: a1 + b1, unit: '', points: 10, level: isBoss ? '魔王試煉' : '採集果實' };
    case 'measurement': 
      const m = Math.floor(Math.random() * 8) + 2;
      return { q: `${m} 公尺 = 幾公分？`, a: m * 100, unit: '公分', points: 15, level: isBoss ? '魔王試煉' : '測量恐龍' };
    case 'placeValue': 
      const val = Math.floor(Math.random() * 900) + 100;
      const isHundreds = Math.random() > 0.5;
      const ansPlace = isHundreds ? Math.floor(val / 100) : Math.floor((val % 100) / 10);
      return { q: `數字 ${val} 的${isHundreds ? '百' : '十'}位數是？`, a: ansPlace, unit: '', points: 20, level: isBoss ? '魔王試煉' : '石板密碼' };
    case 'multiplication': 
      const m1 = Math.floor(Math.random() * 8) + 2;
      const m2 = Math.floor(Math.random() * 8) + 2;
      return { q: `${m1} × ${m2} = ?`, a: m1 * m2, unit: '', points: 25, level: isBoss ? '魔王試煉' : '猛獸對決' };
    case 'logic': 
      const total = Math.floor(Math.random() * 20) + 10;
      const evenTotal = total % 2 === 0 ? total : total + 1;
      return { q: `${evenTotal} 塊肉平分給 2 人，每人拿？`, a: evenTotal / 2, unit: '塊', points: 30, level: isBoss ? '魔王試煉' : '部落分肉' };
    default:
      return { q: "10 + 10 = ?", a: 20, unit: '', points: 5, level: '熱身' };
  }
};

const MathJungleGame = () => {
  const [currentQ, setCurrentQ] = useState(generateQuestion());
  const [userInput, setUserInput] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [showBossVictory, setShowBossVictory] = useState(false); // 魔王勝利彈窗
  const [score, setScore] = useState(1000); 
  const [combo, setCombo] = useState(0);
  const [msg, setMsg] = useState('Yabba Dabba Doo！');
  
  // --- 狀態管理 ---
  const [view, setView] = useState('game'); 
  const [inventory, setInventory] = useState([]); 
  const [equippedItems, setEquippedItems] = useState([]); 
  const [gachaResult, setGachaResult] = useState(null); 

  // --- 魔王關卡狀態 ---
  const [totalSolved, setTotalSolved] = useState(0); // 總答對題數
  const [isBossActive, setIsBossActive] = useState(false); // 是否在打魔王
  const [bossStreak, setBossStreak] = useState(0); // 魔王關連續答對題數 (目標10)
  const BOSS_TARGET = 10;
  const BOSS_TRIGGER_COUNT = 50; 

  // --- SSR 效果：自動填入答案 ---
  useEffect(() => {
    const activeSSR = equippedItems.find(id => ITEMS_DB.find(i => i.id === id).rarity === 'SSR');
    if (activeSSR) {
      setUserInput(currentQ.a);
      setMsg(`✨ 神器發威！${ITEMS_DB.find(i => i.id === activeSSR).name} 顯示了答案！`);
    }
  }, [currentQ, equippedItems]); 

  // --- 計算裝備加分 ---
  const getTotalBonus = () => {
    let bonus = 0;
    equippedItems.forEach(id => {
      const item = ITEMS_DB.find(i => i.id === id);
      if (item.rarity === 'SR') bonus += 10;
      if (item.rarity === 'S') bonus += 5;
    });
    return bonus;
  };

  // --- 檢查答案 ---
  const checkAnswer = () => {
    const userVal = parseInt(userInput);
    if (userVal === currentQ.a) {
      // --- 答對邏輯 ---
      const bonus = getTotalBonus();
      const finalPoints = currentQ.points + (combo * 5) + bonus;
      setScore(score + finalPoints);
      
      // 處理 SSR 消耗
      const usedSSRId = equippedItems.find(id => ITEMS_DB.find(i => i.id === id).rarity === 'SSR');
      let rewardMsg = bonus > 0 ? `(+${bonus}分)！獲得 ${finalPoints} 石幣！` : `獲得 ${finalPoints} 石幣！`;

      if (usedSSRId) {
        const itemIndexInInv = inventory.indexOf(usedSSRId);
        if (itemIndexInInv > -1) {
          const newInv = [...inventory];
          newInv.splice(itemIndexInInv, 1);
          setInventory(newInv);
        }
        setEquippedItems(equippedItems.filter(id => id !== usedSSRId));
        rewardMsg = `神器碎裂了... 但你答對了！`;
      }

      // --- 魔王關卡邏輯 ---
      if (isBossActive) {
        const newBossStreak = bossStreak + 1;
        setBossStreak(newBossStreak);
        
        if (newBossStreak >= BOSS_TARGET) {
          // 擊敗魔王！
          setIsBossActive(false);
          setBossStreak(0);
          setShowBossVictory(true); // 顯示魔王獎勵
          setMsg("傳說達成！擊敗了魔王！");
          
          // 送一個 SSR
          const ssrItems = ITEMS_DB.filter(i => i.rarity === 'SSR');
          const rewardSSR = ssrItems[Math.floor(Math.random() * ssrItems.length)];
          setInventory(prev => [...prev, rewardSSR.id]);
        } else {
          // 魔王關還沒過，繼續
          setShowReward(true);
          setCombo(combo + 1);
          setMsg(`魔王受傷了！(${newBossStreak}/${BOSS_TARGET}) ` + rewardMsg);
        }
      } else {
        // --- 普通關卡邏輯 ---
        const newTotal = totalSolved + 1;
        setTotalSolved(newTotal);
        setCombo(combo + 1);
        
        // 檢查是否觸發魔王
        if (newTotal > 0 && newTotal % BOSS_TRIGGER_COUNT === 0) {
          setIsBossActive(true);
          setBossStreak(0);
          setMsg("⚠️ 警告！巨大的腳步聲接近了！ ⚠️");
          // 這裡不顯示普通獎勵彈窗，直接切換到魔王介面會比較順，或者顯示一個警告彈窗
          setTimeout(() => alert("吼！！！魔王出現了！必須連續答對 10 題才能擊退牠！"), 100);
        } else {
          setShowReward(true);
          setMsg(`答對啦！` + rewardMsg);
        }
      }

    } else {
      // --- 答錯邏輯 ---
      setCombo(0);
      setUserInput('');
      
      if (isBossActive) {
        setBossStreak(0); // 魔王關答錯，進度歸零！
        setMsg('😱 慘了！被魔王打飛！進度歸零！(0/10)');
        // 加入震動特效邏輯可選
      } else {
        setMsg('哎呀！被石頭絆倒了，再試一次！');
      }
    }
  };

  const nextLevel = () => {
    setShowReward(false);
    setShowBossVictory(false);
    setUserInput('');
    setCurrentQ(generateQuestion(isBossActive)); // 如果是魔王關，產生新題目
    if (!isBossActive && !showBossVictory) {
       setMsg('下一隻猛獸來了！小心！');
    }
  };

  // --- 抽蛋邏輯 ---
  const handleGacha = () => {
    if (score < 100) {
      setMsg("石幣不夠啦！快去算數學賺錢！");
      return;
    }
    setScore(score - 100);
    const rand = Math.random() * 100;
    let rarity = 'S';
    if (rand < 5) rarity = 'SSR';
    else if (rand < 30) rarity = 'SR';
    const pool = ITEMS_DB.filter(i => i.rarity === rarity);
    const item = pool[Math.floor(Math.random() * pool.length)];
    setInventory([...inventory, item.id]); 
    setGachaResult(item);
  };

  // --- 裝備/卸下邏輯 ---
  const toggleEquip = (itemId) => {
    const isEquipped = equippedItems.includes(itemId);
    if (isEquipped) {
      const index = equippedItems.indexOf(itemId);
      const newEquipped = [...equippedItems];
      newEquipped.splice(index, 1);
      setEquippedItems(newEquipped);
    } else {
      if (equippedItems.length >= 3) {
        alert("身上最多只能掛 3 個裝備喔！");
        return;
      }
      const ownedCount = inventory.filter(id => id === itemId).length;
      const equippedCount = equippedItems.filter(id => id === itemId).length;
      if (equippedCount < ownedCount) {
        setEquippedItems([...equippedItems, itemId]);
      } else {
        alert("你沒有更多這個道具了！");
      }
    }
  };

  // --- 渲染遊戲主畫面 ---
  const renderGame = () => {
    const hasSSR = equippedItems.some(id => ITEMS_DB.find(i => i.id === id).rarity === 'SSR');
    const totalBonus = getTotalBonus();
    
    // 背景顏色判斷
    const bgClass = isBossActive ? 'bg-red-900 border-red-500' : (hasSSR ? 'bg-purple-100 border-purple-500' : 'bg-stone-200 border-stone-700');
    const btnClass = isBossActive ? 'bg-red-600 border-red-900 hover:bg-red-500' : (hasSSR ? 'bg-purple-600 border-purple-900 hover:bg-purple-500' : 'bg-orange-500 border-stone-800 hover:bg-orange-400');

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md flex flex-col items-center relative z-10">
        
        {/* 魔王關專屬 UI */}
        {isBossActive && (
          <div className="w-full mb-4">
            <div className="flex justify-between items-end mb-1 px-2">
              <span className="text-red-600 font-black text-xl animate-pulse">👹 暴龍王來襲！</span>
              <span className="text-stone-600 font-bold">連擊: {bossStreak} / {BOSS_TARGET}</span>
            </div>
            <div className="w-full h-6 bg-stone-300 rounded-full border-4 border-stone-600 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${(bossStreak / BOSS_TARGET) * 100}%` }}
                className="h-full bg-red-500"
              />
            </div>
          </div>
        )}

        {/* 裝備欄 */}
        {!isBossActive && (
          <div className="flex gap-2 mb-4 min-h-[50px]">
            {equippedItems.map((id, index) => {
              const item = ITEMS_DB.find(i => i.id === id);
              return (
                <motion.div key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl shadow-md bg-stone-800 border-stone-500 relative">
                  {item.icon}
                  {item.rarity === 'SSR' && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span></span>}
                </motion.div>
              );
            })}
            {equippedItems.length === 0 && <div className="text-stone-400 text-sm font-bold flex items-center">尚未裝備道具...</div>}
          </div>
        )}

        {/* 題目卡片 */}
        <div className={`w-full p-8 rounded-[2rem] border-[6px] shadow-[10px_10px_0px_0px_rgba(60,60,60,0.5)] relative transition-colors duration-500 ${bgClass}`}>
          {/* 魔王關特效 */}
          {isBossActive && <div className="absolute inset-0 border-4 border-red-500 rounded-[1.5rem] animate-pulse pointer-events-none opacity-50"></div>}

          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-orange-400 text-stone-900 px-6 py-2 rounded-xl text-lg font-black border-4 border-stone-800 shadow-sm rotate-1 whitespace-nowrap">
             {currentQ.level} (+{currentQ.points}) 
          </div>

          <div className="mt-8 mb-8 text-center relative z-10">
            <h2 className={`text-4xl font-black mb-2 ${isBossActive ? 'text-red-900' : 'text-stone-800'}`}>{currentQ.q}</h2>
            {currentQ.unit && <p className="text-stone-500 font-bold text-lg">({currentQ.unit})</p>}
          </div>

          <div className="relative z-10">
            <input
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="?"
              className={`w-full text-center text-5xl font-black py-4 border-b-8 rounded-xl transition-all mb-6 ${hasSSR ? 'bg-yellow-100 text-purple-600 border-purple-400' : 'bg-stone-300 text-stone-700 border-stone-400'}`}
            />
            {hasSSR && <div className="absolute right-4 top-6 text-2xl animate-pulse">✨</div>}
          </div>

          <button
            onClick={checkAnswer}
            disabled={showReward || showBossVictory}
            className={`w-full text-white font-black py-4 rounded-2xl text-2xl border-4 shadow-[0_6px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-2 transition-all ${btnClass}`}
          >
            {hasSSR ? '神力解放 (消耗)' : (isBossActive ? '攻擊魔王！⚔️' : `擲出石斧！${totalBonus > 0 ? `(+${totalBonus})` : ''}`)}
          </button>
        </div>
        
        {/* 訊息欄 */}
        <p className={`mt-6 font-bold px-4 py-2 rounded-full min-h-[3rem] flex items-center text-center ${isBossActive ? 'bg-red-200 text-red-800' : 'bg-white/50 text-stone-600'}`}>
          {msg}
        </p>

        {/* 總進度顯示 */}
        {!isBossActive && (
          <div className="mt-2 text-xs font-bold text-stone-400">
            距離魔王來襲: {BOSS_TRIGGER_COUNT - (totalSolved % BOSS_TRIGGER_COUNT)} 題
          </div>
        )}
      </motion.div>
    );
  };

  // 其他渲染函數保持不變 (Gacha, Bag...)
  const renderGacha = () => (
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full max-w-md bg-stone-200 p-6 rounded-3xl border-8 border-stone-700 relative z-10 text-center">
      <h2 className="text-3xl font-black text-stone-800 mb-4">恐龍蛋轉蛋機</h2>
      <div className="text-9xl mb-6 animate-pulse">🥚</div>
      <p className="mb-6 font-bold text-stone-600">一次 100 石幣 / 保證有獎</p>
      <button onClick={handleGacha} className="w-full bg-green-600 text-white font-black py-4 rounded-2xl text-xl border-b-8 border-green-800 active:border-b-0 active:translate-y-2 mb-4">抽一顆蛋 (-100💰)</button>
      <button onClick={() => setView('game')} className="text-stone-500 font-bold underline">回到遊戲</button>
      <AnimatePresence>
        {gachaResult && (
          <motion.div initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 z-20">
            <div className={`text-sm font-bold mb-2 ${gachaResult.rarity === 'SSR' ? 'text-purple-600' : gachaResult.rarity === 'SR' ? 'text-red-500' : 'text-green-600'}`}>{gachaResult.rarity === 'SSR' ? '✨ 傳說 ✨' : gachaResult.rarity === 'SR' ? '🔥 稀有 🔥' : '🌱 實用 🌱'}</div>
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

  const renderBag = () => {
    const uniqueItems = [...new Set(inventory)].sort((a,b) => a - b);
    return (
      <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="w-full max-w-md bg-stone-200 p-6 rounded-3xl border-8 border-stone-700 h-[70vh] flex flex-col z-10">
        <h2 className="text-2xl font-black text-stone-800 mb-2 flex justify-between items-center">
          <span>🎒 部落背包</span>
          <div className="text-sm bg-stone-800 text-white px-3 py-1 rounded-lg">裝備: {equippedItems.length}/3</div>
        </h2>
        <button onClick={() => setView('game')} className="text-stone-500 font-bold underline mb-4 self-end">回到遊戲</button>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {uniqueItems.length === 0 ? (
            <div className="text-center text-stone-400 mt-20">背包空空的...<br/>快去抽蛋！</div>
          ) : (
            uniqueItems.map(id => {
              const item = ITEMS_DB.find(i => i.id === id);
              const ownedCount = inventory.filter(i => i === id).length;
              const equippedCount = equippedItems.filter(i => i === id).length;
              const isMaxEquipped = equippedItems.length >= 3;
              return (
                <div key={id} className={`p-3 rounded-xl border-4 flex items-center gap-3 bg-white border-stone-300`}>
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1 rounded ${item.rarity === 'SSR' ? 'bg-purple-600 text-white' : item.rarity === 'SR' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>{item.rarity}</span>
                      <span className="font-bold text-stone-800">{item.name}</span>
                      <span className="text-xs text-stone-400">擁:{ownedCount}</span>
                    </div>
                    <div className="text-xs text-stone-500">{item.desc}</div>
                    <div className="text-xs text-orange-600 font-bold">{item.effect}</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    {equippedCount > 0 && <span className="text-xs font-bold text-green-600">已裝:{equippedCount}</span>}
                    <button 
                      onClick={() => toggleEquip(id)}
                      className={`text-xs px-3 py-2 rounded-lg font-bold shadow-sm active:translate-y-1 transition-all ${
                        equippedCount > 0 ? 'bg-red-500 text-white border-b-4 border-red-700' : (isMaxEquipped ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-500 text-white border-b-4 border-green-700')
                      }`}
                    >
                      {equippedCount > 0 ? '卸下' : '裝備'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-mono overflow-hidden relative selection:bg-orange-300 transition-colors duration-1000 ${isBossActive ? 'bg-red-950' : 'bg-amber-100'}`}>
      
      {/* 背景裝飾 */}
      <div className="absolute top-10 left-10 text-6xl opacity-40 animate-bounce duration-[3000ms]">{isBossActive ? '🌋' : '☁️'}</div>
      <div className="absolute bottom-20 right-10 text-8xl opacity-20 -rotate-12 select-none">{isBossActive ? '🦖' : '🦕'}</div>

      <div className="w-full max-w-lg flex justify-between items-center mb-6 z-20 px-2">
        <div className="bg-stone-800 text-yellow-400 px-4 py-2 rounded-xl border-4 border-stone-600 shadow-md font-black text-xl flex items-center gap-2">
          💰 {score}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('gacha')} disabled={isBossActive} className={`text-white px-3 py-2 rounded-xl border-b-4 font-bold active:translate-y-1 shadow-md ${isBossActive ? 'bg-gray-500 border-gray-700 opacity-50' : 'bg-green-600 border-green-800'}`}>🥚 抽蛋</button>
          <button onClick={() => setView('bag')} disabled={isBossActive} className={`text-white px-3 py-2 rounded-xl border-b-4 font-bold active:translate-y-1 shadow-md relative ${isBossActive ? 'bg-gray-500 border-gray-700 opacity-50' : 'bg-blue-600 border-blue-800'}`}>
            🎒 背包
            {equippedItems.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{equippedItems.length}</span>}
          </button>
        </div>
      </div>

      {view === 'game' && renderGame()}
      {view === 'gacha' && renderGacha()}
      {view === 'bag' && renderBag()}

      {/* 普通獎勵彈窗 */}
      <AnimatePresence>
        {showReward && !isBossActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-yellow-100 w-full max-w-sm p-8 rounded-[3rem] text-center border-[8px] border-orange-500 shadow-2xl">
              <div className="text-7xl mb-4 animate-bounce">🍗</div>
              <h3 className="text-4xl font-black text-stone-800 mb-2">HOORAY!</h3>
              <p className="text-stone-600 font-bold mb-6">{msg}</p>
              <button onClick={nextLevel} className="w-full bg-green-500 text-white font-black py-4 rounded-2xl text-xl border-4 border-green-800 shadow-lg active:translate-y-2">繼續狩獵 ➜</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 魔王獎勵彈窗 (SSR) */}
      <AnimatePresence>
        {showBossVictory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5, rotate: 360 }} animate={{ scale: 1, rotate: 0 }} className="bg-purple-100 w-full max-w-sm p-8 rounded-[3rem] text-center border-[8px] border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.8)] relative">
              <div className="absolute inset-0 bg-purple-300 opacity-20 animate-pulse rounded-[2.5rem]"></div>
              <div className="text-8xl mb-4 animate-bounce">👑</div>
              <h3 className="text-3xl font-black text-purple-900 mb-2">魔王擊破！</h3>
              <p className="text-stone-600 font-bold mb-2">太強了！這是給勇者的獎勵</p>
              <div className="bg-white p-4 rounded-xl border-4 border-purple-300 mb-6">
                <p className="text-purple-600 font-black text-xl">✨ 獲得隨機 SSR 道具 ✨</p>
                <p className="text-xs text-stone-400">(已放入背包)</p>
              </div>
              <button onClick={nextLevel} className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl text-xl border-4 border-purple-900 shadow-lg active:translate-y-2">收下神器 ➜</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 答對但還在打魔王時的過場 (不顯示彈窗，只閃一下) */}
      {isBossActive && showReward && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.8 }} className="text-9xl font-black text-green-400 drop-shadow-lg">
            HIT!
          </motion.div>
        </div>
      )}

      <div className="fixed bottom-2 right-2 text-stone-400 text-xs font-bold opacity-50">Math Flintstones v7.0 Boss Rush</div>
    </div>
  );
};

export default MathJungleGame;
