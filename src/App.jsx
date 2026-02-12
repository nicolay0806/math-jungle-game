import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- V8.0 道具資料庫 (維持 V7.1 設定) ---
const ITEMS_DB = [
  // --- SSR (傳說級) ---
  { id: 1, name: '暴龍透視鏡', rarity: 'SSR', icon: '🦖', effect: '看穿答案 (消耗)', desc: '一次性神器，使用後消失。' },
  { id: 2, name: '先知的石板', rarity: 'SSR', icon: '🗿', effect: '看穿答案 (消耗)', desc: '上面刻著正解，用完會風化。' },
  { id: 3, name: '黃金計算機', rarity: 'SSR', icon: '🧮', effect: '看穿答案 (消耗)', desc: '古文明科技，電力僅供一次。' },
  { id: 4, name: '智慧長老之靈', rarity: 'SSR', icon: '👻', effect: '看穿答案 (消耗)', desc: '召喚長老代答，之後需休息。' },
  { id: 5, name: '外星人頭盔', rarity: 'SSR', icon: '👽', effect: '看穿答案 (消耗)', desc: '接收宇宙訊號，用過即丟。' },
  // --- SR (稀有級) ---
  { id: 6, name: '黑曜石矛', rarity: 'SR', icon: '🗡️', effect: '分數+10', desc: '鋒利無比，狩獵必備。' },
  { id: 7, name: '劍齒虎皮', rarity: 'SR', icon: '🐯', effect: '分數+10', desc: '穿上去充滿勇氣！' },
  { id: 8, name: '琥珀項鍊', rarity: 'SR', icon: '📿', effect: '分數+10', desc: '凝結了時間的寶石。' },
  { id: 9, name: '雷龍蛋', rarity: 'SR', icon: '🥚', effect: '分數+10', desc: '充滿生命力的大蛋。' },
  { id: 10, name: '薩滿面具', rarity: 'SR', icon: '👺', effect: '分數+10', desc: '戴上後頭腦變靈活了。' },
  // --- S (實用級) ---
  { id: 16, name: '堅固石碗', rarity: 'S', icon: '🥣', effect: '分數+5', desc: '磨得很光滑，很好用。' },
  { id: 17, name: '美味烤魚', rarity: 'S', icon: '🐟', effect: '分數+5', desc: '香噴噴的，補充體力。' },
  { id: 18, name: '乾燥木柴', rarity: 'S', icon: '🪵', effect: '分數+5', desc: '生火必備，帶來溫暖。' },
  { id: 19, name: '漂亮的鵝卵石', rarity: 'S', icon: '🪨', effect: '分數+5', desc: '圓潤可愛，帶來好運。' },
  { id: 20, name: '幸運四葉草', rarity: 'S', icon: '🍀', effect: '分數+5', desc: '找到它，考試都考100分。' },
];

// --- V8.0 超級題庫生成器 (根據裝備數量決定難度) ---
const generateQuestion = (isBoss, equipCount) => {
  // 難度等級：0(沒裝備), 1(1件), 2(2件), 3(3件滿裝/魔王)
  const difficulty = isBoss ? 3 : Math.min(equipCount, 3);
  
  let types = [];
  
  // --- Level 0: 基礎題 (適合新手) ---
  if (difficulty === 0) {
    types = ['add_simple', 'sub_simple', 'shape_basic', 'clock_hour'];
  } 
  // --- Level 1: 進階題 (有 1 件裝備) ---
  else if (difficulty === 1) {
    types = ['add_100', 'sub_100', 'mul_basic', 'length_cm', 'money_basic', 'clock_half'];
  } 
  // --- Level 2: 高手題 (有 2 件裝備) ---
  else if (difficulty === 2) {
    types = ['mul_advance', 'length_mix', 'fraction_basic', 'date_week', 'place_value_1000', 'money_calc'];
  } 
  // --- Level 3: 挑戰題 (滿裝/魔王關) ---
  else {
    types = ['mul_word', 'fraction_compare', 'geometry_edge', 'logic_gap', 'time_duration', 'division_concept'];
  }

  const type = types[Math.floor(Math.random() * types.length)];

  switch (type) {
    // --- Lv 0 題庫 ---
    case 'add_simple': // 20以內加法
      const a0 = Math.floor(Math.random() * 10) + 1;
      const b0 = Math.floor(Math.random() * 10) + 1;
      return { q: `${a0} + ${b0} = ?`, a: a0 + b0, unit: '', points: 10, level: '採集果實 (Lv.0)' };
    case 'sub_simple': // 20以內減法
      const s1 = Math.floor(Math.random() * 10) + 10;
      const s2 = Math.floor(Math.random() * 9) + 1;
      return { q: `${s1} - ${s2} = ?`, a: s1 - s2, unit: '', points: 10, level: '驅趕小蟲 (Lv.0)' };
    case 'shape_basic': // 形狀辨識
      const shapes = [
        { name: '三角形', sides: 3 }, { name: '正方形', sides: 4 }, { name: '長方形', sides: 4 }
      ];
      const sh = shapes[Math.floor(Math.random() * shapes.length)];
      return { q: `${sh.name}有幾個角？`, a: sh.sides, unit: '個', points: 10, level: '石板圖形 (Lv.0)' };
    case 'clock_hour': // 整點報時
      const h = Math.floor(Math.random() * 12) + 1;
      return { q: `長針指著12，短針指著${h}，是幾點？`, a: h, unit: '點', points: 10, level: '日晷時間 (Lv.0)' };

    // --- Lv 1 題庫 ---
    case 'add_100': // 100內加法
      const a1 = Math.floor(Math.random() * 40) + 10;
      const b1 = Math.floor(Math.random() * 40) + 10;
      return { q: `${a1} + ${b1} = ?`, a: a1 + b1, unit: '', points: 15, level: '搬運石塊 (Lv.1)' };
    case 'mul_basic': // 基礎乘法 (2,5,10)
      const mBase = [2, 5, 10][Math.floor(Math.random() * 3)];
      const mN = Math.floor(Math.random() * 9) + 1;
      return { q: `${mBase} × ${mN} = ?`, a: mBase * mN, unit: '', points: 15, level: '基礎狩獵 (Lv.1)' };
    case 'length_cm': // 長度直觀
      const cm = Math.floor(Math.random() * 20) + 5;
      return { q: `橡皮擦長 ${cm} 公分，兩塊接起來多長？`, a: cm * 2, unit: '公分', points: 15, level: '測量工具 (Lv.1)' };
    case 'money_basic': // 錢幣算術
      const price = Math.floor(Math.random() * 4) + 1; // 1-4個10元
      return { q: `${price} 個 10 元硬幣是多少錢？`, a: price * 10, unit: '元', points: 15, level: '部落交易 (Lv.1)' };

    // --- Lv 2 題庫 ---
    case 'mul_advance': // 進階乘法 (3,4,6,7,8,9)
      const ma1 = Math.floor(Math.random() * 7) + 3; // 3-9
      const ma2 = Math.floor(Math.random() * 8) + 2;
      return { q: `${ma1} × ${ma2} = ?`, a: ma1 * ma2, unit: '', points: 20, level: '猛獸乘法 (Lv.2)' };
    case 'place_value_1000': // 1000以內位值
      const pv = Math.floor(Math.random() * 800) + 100;
      return { q: `${pv} 的百位數是多少？`, a: Math.floor(pv / 100), unit: '', points: 20, level: '長老密碼 (Lv.2)' };
    case 'length_mix': // 公尺公分換算
      const m_mix = Math.floor(Math.random() * 5) + 2;
      return { q: `${m_mix} 公尺等於幾公分？`, a: m_mix * 100, unit: '公分', points: 20, level: '巨獸測量 (Lv.2)' };
    case 'fraction_basic': // 基礎分數 (1/2, 1/4)
      const totalF = [4, 8, 12, 16][Math.floor(Math.random() * 4)];
      return { q: `${totalF} 顆蘋果的 二分之一 是幾顆？`, a: totalF / 2, unit: '顆', points: 20, level: '平分食物 (Lv.2)' };

    // --- Lv 3 題庫 (魔王級) ---
    case 'mul_word': // 乘法應用
      const legs = 4;
      const count = Math.floor(Math.random() * 5) + 4; // 4-8隻
      return { q: `${count} 隻獅子共有幾條腿？`, a: count * legs, unit: '條', points: 30, level: '獅群來襲 (Lv.3)' };
    case 'time_duration': // 時間經過
      const start = Math.floor(Math.random() * 5) + 1;
      const dur = Math.floor(Math.random() * 3) + 2;
      return { q: `現在 ${start} 點，過 ${dur} 小時是幾點？`, a: start + dur, unit: '點', points: 30, level: '守夜時間 (Lv.3)' };
    case 'geometry_edge': // 立體圖形邊/面
      const solids = [
        { n: '正方體', f: '面', a: 6 },
        { n: '正方體', f: '邊', a: 12 },
        { n: '正方體', f: '頂點', a: 8 }
      ];
      const sol = solids[Math.floor(Math.random() * solids.length)];
      return { q: `${sol.n}有幾個${sol.f}？`, a: sol.a, unit: '個', points: 30, level: '神廟建築 (Lv.3)' };
    case 'division_concept': // 分裝概念
      const totalD = Math.floor(Math.random() * 5 + 2) * 6; // 12-42
      const perBag = 6;
      return { q: `${totalD} 個貝殼，每 ${perBag} 個裝一袋，可裝幾袋？`, a: totalD / perBag, unit: '袋', points: 30, level: '物資分配 (Lv.3)' };

    default:
      return { q: "10 + 10 = ?", a: 20, unit: '', points: 5, level: '熱身' };
  }
};

const MathJungleGame = () => {
  // --- 狀態初始化 ---
  const [score, setScore] = useState(100); 
  const [combo, setCombo] = useState(0);
  const [inventory, setInventory] = useState([]); 
  const [equippedItems, setEquippedItems] = useState([]); 
  // 初始題目 (無魔王, 0裝備)
  const [currentQ, setCurrentQ] = useState(generateQuestion(false, 0));
  
  const [userInput, setUserInput] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [showBossVictory, setShowBossVictory] = useState(false);
  const [msg, setMsg] = useState('裝備越多，挑戰越難！加油！');
  
  const [view, setView] = useState('game'); 
  const [gachaResult, setGachaResult] = useState(null); 

  // --- 魔王關狀態 ---
  const [totalSolved, setTotalSolved] = useState(0); 
  const [isBossActive, setIsBossActive] = useState(false); 
  const [bossStreak, setBossStreak] = useState(0); 
  const BOSS_TARGET = 10;
  const BOSS_TRIGGER_COUNT = 50; 

  // --- SSR 自動解題 ---
  useEffect(() => {
    const activeSSR = equippedItems.find(id => ITEMS_DB.find(i => i.id === id).rarity === 'SSR');
    if (activeSSR) {
      setUserInput(currentQ.a);
      setMsg(`✨ 神器發威！${ITEMS_DB.find(i => i.id === activeSSR).name} 顯示了答案！`);
    }
  }, [currentQ, equippedItems]); 

  // --- 計算加分 ---
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
      const bonus = getTotalBonus();
      const finalPoints = currentQ.points + (combo * 5) + bonus;
      setScore(score + finalPoints);
      
      const usedSSRId = equippedItems.find(id => ITEMS_DB.find(i => i.id === id).rarity === 'SSR');
      let rewardMsg = bonus > 0 ? `(+${bonus}分)！獲得 ${finalPoints} 石幣！` : `獲得 ${finalPoints} 石幣！`;

      if (usedSSRId) {
        // SSR 損壞邏輯
        const itemIndexInInv = inventory.indexOf(usedSSRId);
        if (itemIndexInInv > -1) {
          const newInv = [...inventory];
          newInv.splice(itemIndexInInv, 1);
          setInventory(newInv);
        }
        setEquippedItems(equippedItems.filter(id => id !== usedSSRId));
        rewardMsg = `神器碎裂了... 但你贏了！`;
      }

      if (isBossActive) {
        const newBossStreak = bossStreak + 1;
        setBossStreak(newBossStreak);
        
        if (newBossStreak >= BOSS_TARGET) {
          setIsBossActive(false);
          setBossStreak(0);
          setShowBossVictory(true); 
          setMsg("傳說達成！擊敗了魔王！");
          const ssrItems = ITEMS_DB.filter(i => i.rarity === 'SSR');
          const rewardSSR = ssrItems[Math.floor(Math.random() * ssrItems.length)];
          setInventory(prev => [...prev, rewardSSR.id]);
        } else {
          setShowReward(true);
          setCombo(combo + 1);
          setMsg(`魔王受傷了！(${newBossStreak}/${BOSS_TARGET}) ` + rewardMsg);
        }
      } else {
        const newTotal = totalSolved + 1;
        setTotalSolved(newTotal);
        setCombo(combo + 1);
        
        if (newTotal > 0 && newTotal % BOSS_TRIGGER_COUNT === 0) {
          setIsBossActive(true);
          setBossStreak(0);
          setMsg("⚠️ 警告！巨大的腳步聲接近了！ ⚠️");
          setTimeout(() => alert("吼！！！魔王出現了！必須連續答對 10 題才能擊退牠！"), 100);
        } else {
          setShowReward(true);
          setMsg(`答對啦！` + rewardMsg);
        }
      }
    } else {
      setCombo(0);
      setUserInput('');
      if (isBossActive) {
        setBossStreak(0); 
        setMsg('😱 慘了！被魔王打飛！進度歸零！(0/10)');
      } else {
        setMsg('哎呀！被石頭絆倒了，再試一次！');
      }
    }
  };

  const nextLevel = () => {
    setShowReward(false);
    setShowBossVictory(false);
    setUserInput('');
    // 關鍵修改：傳入目前的裝備數量來決定下一題難度
    setCurrentQ(generateQuestion(isBossActive, equippedItems.length)); 
    if (!isBossActive && !showBossVictory) {
       setMsg('下一隻猛獸來了！小心！');
    }
  };

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

  const renderGame = () => {
    const hasSSR = equippedItems.some(id => ITEMS_DB.find(i => i.id === id).rarity === 'SSR');
    const totalBonus = getTotalBonus();
    const bgClass = isBossActive ? 'bg-red-900 border-red-500' : (hasSSR ? 'bg-purple-100 border-purple-500' : 'bg-stone-200 border-stone-700');
    const btnClass = isBossActive ? 'bg-red-600 border-red-900 hover:bg-red-500' : (hasSSR ? 'bg-purple-600 border-purple-900 hover:bg-purple-500' : 'bg-orange-500 border-stone-800 hover:bg-orange-400');

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md flex flex-col items-center relative z-10">
        {isBossActive && (
          <div className="w-full mb-4">
            <div className="flex justify-between items-end mb-1 px-2">
              <span className="text-red-600 font-black text-xl animate-pulse">👹 暴龍王來襲！</span>
              <span className="text-stone-600 font-bold">連擊: {bossStreak} / {BOSS_TARGET}</span>
            </div>
            <div className="w-full h-6 bg-stone-300 rounded-full border-4 border-stone-600 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(bossStreak / BOSS_TARGET) * 100}%` }} className="h-full bg-red-500" />
            </div>
          </div>
        )}

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
            {equippedItems.length === 0 && <div className="text-stone-400 text-sm font-bold flex items-center">裝備越多，題目越難喔！</div>}
          </div>
        )}

        <div className={`w-full p-8 rounded-[2rem] border-[6px] shadow-[10px_10px_0px_0px_rgba(60,60,60,0.5)] relative transition-colors duration-500 ${bgClass}`}>
          {isBossActive && <div className="absolute inset-0 border-4 border-red-500 rounded-[1.5rem] animate-pulse pointer-events-none opacity-50"></div>}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-orange-400 text-stone-900 px-6 py-2 rounded-xl text-lg font-black border-4 border-stone-800 shadow-sm rotate-1 whitespace-nowrap">
             {currentQ.level} (+{currentQ.points}) 
          </div>
          <div className="mt-8 mb-8 text-center relative z-10">
            <h2 className={`text-3xl font-black mb-2 leading-tight ${isBossActive ? 'text-red-900' : 'text-stone-800'}`}>{currentQ.q}</h2>
            {currentQ.unit && <p className="text-stone-500 font-bold text-lg">({currentQ.unit})</p>}
          </div>
          <div className="relative z-10">
            <input type="number" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="?" className={`w-full text-center text-5xl font-black py-4 border-b-8 rounded-xl transition-all mb-6 ${hasSSR ? 'bg-yellow-100 text-purple-600 border-purple-400' : 'bg-stone-300 text-stone-700 border-stone-400'}`} />
            {hasSSR && <div className="absolute right-4 top-6 text-2xl animate-pulse">✨</div>}
          </div>
          <button onClick={checkAnswer} disabled={showReward || showBossVictory} className={`w-full text-white font-black py-4 rounded-2xl text-2xl border-4 shadow-[0_6px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-2 transition-all ${btnClass}`}>
            {hasSSR ? '神力解放 (消耗)' : (isBossActive ? '攻擊魔王！⚔️' : `擲出石斧！${totalBonus > 0 ? `(+${totalBonus})` : ''}`)}
          </button>
        </div>
        <p className={`mt-6 font-bold px-4 py-2 rounded-full min-h-[3rem] flex items-center text-center ${isBossActive ? 'bg-red-200 text-red-800' : 'bg-white/50 text-stone-600'}`}>
          {msg}
        </p>
        {!isBossActive && (
          <div className="mt-2 text-xs font-bold text-stone-400">距離魔王來襲: {BOSS_TRIGGER_COUNT - (totalSolved % BOSS_TRIGGER_COUNT)} 題</div>
        )}
      </motion.div>
    );
  };

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
      <div className="absolute top-10 left-10 text-6xl opacity-40 animate-bounce duration-[3000ms]">{isBossActive ? '🌋' : '☁️'}</div>
      <div className="absolute bottom-20 right-10 text-8xl opacity-20 -rotate-12 select-none">{isBossActive ? '🦖' : '🦕'}</div>
      <div className="w-full max-w-lg flex justify-between items-center mb-6 z-20 px-2">
        <div className="bg-stone-800 text-yellow-400 px-4 py-2 rounded-xl border-4 border-stone-600 shadow-md font-black text-xl flex items-center gap-2">💰 {score}</div>
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
      <div className="fixed bottom-2 right-2 text-stone-400 text-xs font-bold opacity-50">Math Flintstones v8.0 Difficulty Patch</div>
    </div>
  );
};

export default MathJungleGame;
