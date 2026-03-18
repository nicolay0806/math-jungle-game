import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_DB = [
  { id: 1, name: '暴龍透視鏡', rarity: 'SSR', icon: '🦖', effect: '看穿答案 (消耗)', desc: '一次性神器，使用後消失。', source: 'gacha', type: 'consumable' },
  { id: 2, name: '先知的石板', rarity: 'SSR', icon: '🗿', effect: '看穿答案 (消耗)', desc: '上面刻著正解，用完會風化。', source: 'gacha', type: 'consumable' },
  { id: 3, name: '黃金計算機', rarity: 'SSR', icon: '🧮', effect: '看穿答案 (消耗)', desc: '古文明科技，電力僅供一次。', source: 'gacha', type: 'consumable' },
  { id: 4, name: '智慧長老之靈', rarity: 'SSR', icon: '👻', effect: '看穿答案 (消耗)', desc: '召喚長老代答，之後需休息。', source: 'gacha', type: 'consumable' },
  { id: 5, name: '外星人頭盔', rarity: 'SSR', icon: '👽', effect: '看穿答案 (消耗)', desc: '接收宇宙訊號，用過即丟。', source: 'gacha', type: 'consumable' },
  
  { id: 31, name: '滅世霸王牙', rarity: 'SSR', icon: '🦷', effect: '分數+20', desc: '魔王掉落。【霸王套裝A】', source: 'boss', type: 'equip' },
  { id: 32, name: '滅世霸王鱗', rarity: 'SSR', icon: '🛡️', effect: '分數+20', desc: '魔王掉落。【霸王套裝B】', source: 'boss', type: 'equip' },
  { id: 33, name: '滅世霸王角', rarity: 'SSR', icon: '🦏', effect: '分數+20', desc: '魔王掉落。【霸王套裝C】', source: 'boss', type: 'equip' },
  { id: 34, name: '星空隕石劍', rarity: 'SSR', icon: '☄️', effect: '分數+20', desc: '魔王掉落。【星空套裝A】', source: 'boss', type: 'equip' },
  { id: 35, name: '星空神明眼', rarity: 'SSR', icon: '👁️', effect: '分數+20', desc: '魔王掉落。【星空套裝B】', source: 'boss', type: 'equip' },
  { id: 36, name: '星空時空鐘', rarity: 'SSR', icon: '⏳', effect: '分數+20', desc: '魔王掉落。【星空套裝C】', source: 'boss', type: 'equip' },

  { id: 6, name: '黑曜石矛', rarity: 'SR', icon: '🗡️', effect: '分數+10', desc: '鋒利無比。 【狩獵套裝A】', source: 'gacha', type: 'equip' },
  { id: 7, name: '劍齒虎皮', rarity: 'SR', icon: '🐯', effect: '分數+10', desc: '充滿勇氣。 【狩獵套裝B】', source: 'gacha', type: 'equip' },
  { id: 8, name: '琥珀項鍊', rarity: 'SR', icon: '📿', effect: '分數+10', desc: '凝結時間。', source: 'gacha', type: 'equip' },
  { id: 9, name: '雷龍蛋', rarity: 'SR', icon: '🥚', effect: '分數+10', desc: '充滿生命力。', source: 'gacha', type: 'equip' },
  { id: 10, name: '薩滿面具', rarity: 'SR', icon: '👺', effect: '分數+10', desc: '通靈智慧。 【祭司套裝A】', source: 'gacha', type: 'equip' },
  { id: 11, name: '巨大烤腿肉', rarity: 'SR', icon: '🍖', effect: '分數+10', desc: '吃飽有力氣。', source: 'gacha', type: 'equip' },
  { id: 12, name: '精緻石輪', rarity: 'SR', icon: '⚙️', effect: '分數+10', desc: '科技起點。', source: 'gacha', type: 'equip' },
  { id: 13, name: '水晶蘑菇', rarity: 'SR', icon: '🍄', effect: '分數+10', desc: '發出光芒。 【祭司套裝B】', source: 'gacha', type: 'equip' },
  { id: 14, name: '部落號角', rarity: 'SR', icon: '📯', effect: '分數+10', desc: '吹響勝利。 【祭司套裝C】', source: 'gacha', type: 'equip' },
  { id: 15, name: '獸骨迴力鏢', rarity: 'SR', icon: '🪃', effect: '分數+10', desc: '百發百中。 【狩獵套裝C】', source: 'gacha', type: 'equip' },
  
  { id: 16, name: '堅固石碗', rarity: 'S', icon: '🥣', effect: '分數+5', desc: '磨得光滑。 【野餐套裝A】', source: 'gacha', type: 'equip' },
  { id: 17, name: '美味烤魚', rarity: 'S', icon: '🐟', effect: '分數+5', desc: '香噴噴的。', source: 'gacha', type: 'equip' },
  { id: 18, name: '乾燥木柴', rarity: 'S', icon: '🪵', effect: '分數+5', desc: '生火必備。', source: 'gacha', type: 'equip' },
  { id: 19, name: '漂亮的鵝卵石', rarity: 'S', icon: '🪨', effect: '分數+5', desc: '圓潤可愛。', source: 'gacha', type: 'equip' },
  { id: 20, name: '幸運四葉草', rarity: 'S', icon: '🍀', effect: '分數+5', desc: '考試100分。', source: 'gacha', type: 'equip' },
  { id: 21, name: '結實草鞋', rarity: 'S', icon: '👡', effect: '分數+5', desc: '走得更遠。', source: 'gacha', type: 'equip' },
  { id: 22, name: '大片樹葉', rarity: 'S', icon: '🍃', effect: '分數+5', desc: '可以遮雨。', source: 'gacha', type: 'equip' },
  { id: 23, name: '堅硬果殼', rarity: 'S', icon: '🥥', effect: '分數+5', desc: '做成樂器。', source: 'gacha', type: 'equip' },
  { id: 24, name: '彩色貝殼', rarity: 'S', icon: '🐚', effect: '分數+5', desc: '海浪聲音。', source: 'gacha', type: 'equip' },
  { id: 25, name: '強韌藤蔓', rarity: 'S', icon: '➰', effect: '分數+5', desc: '非常結實。', source: 'gacha', type: 'equip' },
  { id: 26, name: '石製湯匙', rarity: 'S', icon: '🥄', effect: '分數+5', desc: '喝湯方便。 【野餐套裝B】', source: 'gacha', type: 'equip' },
  { id: 27, name: '野果籃', rarity: 'S', icon: '🧺', effect: '分數+5', desc: '裝滿果實。 【野餐套裝C】', source: 'gacha', type: 'equip' },
];

const SETS_DB = [
  { name: '狩獵王套裝', ids: [6, 7, 15], bonus: 50, desc: '集齊狩獵三寶，攻擊力提升！' },
  { name: '大祭司套裝', ids: [10, 13, 14], bonus: 50, desc: '獲得祖靈的智慧，加成爆表！' },
  { name: '快樂野餐套裝', ids: [16, 26, 27], bonus: 30, desc: '吃飽喝足，算術更有精神！' },
  { name: '滅世霸王套裝', ids: [31, 32, 33], bonus: 100, desc: '集齊霸王三寶，震撼叢林！' },
  { name: '星空神話套裝', ids: [34, 35, 36], bonus: 100, desc: '集齊星空三寶，宇宙加持！' }
];

const generateQuestion = (isBoss, equipCount) => {
  const difficulty = isBoss ? 5 : Math.min(equipCount * 2, 5);
  let types = [];
  
  if (difficulty <= 1) { 
    types = ['add_2digit', 'sub_2digit', 'mul_basic', 'money_basic'];
  } else if (difficulty <= 3) { 
    types = ['add_3digit', 'sub_borrow', 'mul_advance', 'length_calc', 'place_value_adv'];
  } else { 
    types = ['add_mix_3', 'sub_big', 'mul_2d_1d', 'div_basic', 'time_elapse_hard', 'mix_op'];
  }

  const type = types[Math.floor(Math.random() * types.length)];

  switch (type) {
    case 'add_2digit': 
      const a1 = Math.floor(Math.random() * 80) + 10;
      const b1 = Math.floor(Math.random() * 80) + 10;
      return { q: `${a1} + ${b1} = ?`, a: a1 + b1, unit: '', points: 15, level: '部落採集 (Lv.1)' };
    case 'sub_2digit': 
      const s1 = Math.floor(Math.random() * 50) + 40;
      const s2 = Math.floor(Math.random() * 30) + 10;
      return { q: `${s1} - ${s2} = ?`, a: s1 - s2, unit: '', points: 15, level: '驅趕野獸 (Lv.1)' };
    case 'mul_basic': 
      const mBase = [2, 5, 10][Math.floor(Math.random() * 3)];
      const mN = Math.floor(Math.random() * 9) + 1;
      return { q: `${mBase} × ${mN} = ?`, a: mBase * mN, unit: '', points: 15, level: '基礎狩獵 (Lv.1)' };
    case 'money_basic': 
      const price = Math.floor(Math.random() * 9) + 1; 
      return { q: `${price} 個 10 元是幾元？`, a: price * 10, unit: '元', points: 15, level: '交易算術 (Lv.1)' };
    case 'add_3digit': 
      const a3 = Math.floor(Math.random() * 400) + 100;
      const b3 = Math.floor(Math.random() * 400) + 100;
      return { q: `${a3} + ${b3} = ?`, a: a3 + b3, unit: '', points: 25, level: '搬運巨石 (Lv.3)' };
    case 'sub_borrow': 
      const sb1 = Math.floor(Math.random() * 80) + 15; 
      const sb2 = Math.floor(Math.random() * 9) + 6; 
      const finalSb1 = sb1 - (sb1%10) + 2; 
      return { q: `${finalSb1} - ${sb2} = ?`, a: finalSb1 - sb2, unit: '', points: 25, level: '精準射擊 (Lv.3)' };
    case 'mul_advance': 
      const ma1 = Math.floor(Math.random() * 4) + 6; 
      const ma2 = Math.floor(Math.random() * 8) + 2;
      return { q: `${ma1} × ${ma2} = ?`, a: ma1 * ma2, unit: '', points: 25, level: '猛獸乘法 (Lv.3)' };
    case 'length_calc': 
      const m = Math.floor(Math.random() * 5) + 1;
      const cm = Math.floor(Math.random() * 50) + 10;
      return { q: `${m}公尺 + ${cm}公分 = ? 公分`, a: m*100 + cm, unit: '公分', points: 30, level: '長度換算 (Lv.3)' };
    case 'place_value_adv':
      const pv = Math.floor(Math.random() * 900) + 100;
      const digit = Math.random() > 0.5 ? '百' : '十';
      const ans = digit === '百' ? Math.floor(pv / 100) : Math.floor((pv % 100) / 10);
      return { q: `${pv} 的${digit}位數是多少？`, a: ans, unit: '', points: 25, level: '長老密碼 (Lv.3)' };
    case 'add_mix_3': 
      const n1 = Math.floor(Math.random() * 50) + 10;
      const n2 = Math.floor(Math.random() * 50) + 10;
      const n3 = Math.floor(Math.random() * 20) + 5;
      return { q: `${n1} + ${n2} + ${n3} = ?`, a: n1 + n2 + n3, unit: '', points: 40, level: '連鎖反應 (Lv.5)' };
    case 'sub_big': 
      const subA = Math.floor(Math.random() * 500) + 400;
      const subB = Math.floor(Math.random() * 300) + 100;
      return { q: `${subA} - ${subB} = ?`, a: subA - subB, unit: '', points: 40, level: '巨獸扣血 (Lv.5)' };
    case 'mul_2d_1d': 
      const mulA = Math.floor(Math.random() * 10) + 10; 
      const mulB = Math.floor(Math.random() * 4) + 2; 
      return { q: `${mulA} × ${mulB} = ?`, a: mulA * mulB, unit: '', points: 50, level: '暴龍乘法 (Lv.5)' };
    case 'div_basic': 
      const divB = Math.floor(Math.random() * 8) + 2;
      const divAns = Math.floor(Math.random() * 9) + 1;
      const divA = divB * divAns;
      return { q: `${divA} ÷ ${divB} = ?`, a: divAns, unit: '', points: 45, level: '平均分配 (Lv.5)' };
    case 'mix_op': 
      const mo1 = Math.floor(Math.random() * 8) + 2;
      const mo2 = Math.floor(Math.random() * 8) + 2;
      const mo3 = Math.floor(Math.random() * 20) + 1;
      return { q: `${mo1} × ${mo2} + ${mo3} = ?`, a: mo1 * mo2 + mo3, unit: '', points: 50, level: '祭司考驗 (Lv.5)' };
    case 'time_elapse_hard': 
      const tStart = Math.floor(Math.random() * 8) + 1; 
      return { q: `${tStart}點半 再過 30 分鐘是幾點？`, a: tStart + 1, unit: '點', points: 40, level: '星象觀測 (Lv.5)' };

    default:
      return { q: "10 + 10 = ?", a: 20, unit: '', points: 5, level: '熱身' };
  }
};

// 提取本機記憶的輔助函式
const getSavedState = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

const MathJungleGame = () => {
  // --- 狀態初始化改為讀取本機記憶 ---
  const [score, setScore] = useState(() => getSavedState('mathJungle_score', 100)); 
  const [combo, setCombo] = useState(0);
  const [inventory, setInventory] = useState(() => getSavedState('mathJungle_inventory', [])); 
  const [equippedItems, setEquippedItems] = useState(() => getSavedState('mathJungle_equippedItems', [])); 
  const [totalSolved, setTotalSolved] = useState(() => getSavedState('mathJungle_totalSolved', 0)); 
  
  const [userInput, setUserInput] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [showBossVictory, setShowBossVictory] = useState(false);
  const [bossRewardItem, setBossRewardItem] = useState(null); 
  const [msg, setMsg] = useState('準備好開始狩獵了嗎？');
  const [view, setView] = useState('game'); 
  const [gachaResult, setGachaResult] = useState(null); 
  const [questionHistory, setQuestionHistory] = useState([]);
  const [currentQ, setCurrentQ] = useState({ q: '準備開始！', a: 0, unit: '', points: 0, level: '' });

  const [isBossActive, setIsBossActive] = useState(false); 
  const [bossStreak, setBossStreak] = useState(0); 
  const BOSS_TARGET = 10;
  const BOSS_TRIGGER_COUNT = 30;

  // --- 自動存檔機制 ---
  useEffect(() => {
    localStorage.setItem('mathJungle_score', JSON.stringify(score));
    localStorage.setItem('mathJungle_inventory', JSON.stringify(inventory));
    localStorage.setItem('mathJungle_equippedItems', JSON.stringify(equippedItems));
    localStorage.setItem('mathJungle_totalSolved', JSON.stringify(totalSolved));
  }, [score, inventory, equippedItems, totalSolved]);

  const resetProgress = () => {
    if (window.confirm('確定要刪除所有進度，重新開始嗎？這個動作無法復原喔！')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    generateUniqueQuestion(false);
  }, []);

  const generateUniqueQuestion = (bossMode = false) => {
    let newQ;
    let attempts = 0;
    do {
      newQ = generateQuestion(bossMode, equippedItems.length);
      attempts++;
    } while (questionHistory.includes(newQ.q) && attempts < 20);

    setQuestionHistory(prev => {
      const newHistory = [...prev, newQ.q];
      if (newHistory.length > 5) newHistory.shift();
      return newHistory;
    });
    setCurrentQ(newQ);
  };

  useEffect(() => {
    const activeConsumableSSR = equippedItems.find(id => {
      const item = ITEMS_DB.find(i => i.id === id);
      return item.rarity === 'SSR' && item.type === 'consumable';
    });
    
    if (activeConsumableSSR) {
      setUserInput('');
      setMsg(`神力準備就緒！請直接點擊解放神力！`);
    }
  }, [equippedItems]);

  const calculatePoints = () => {
    let itemBonus = 0;
    let setBonus = 0;
    let activeSetNames = [];
    equippedItems.forEach(id => {
      const item = ITEMS_DB.find(i => i.id === id);
      if (item.rarity === 'SSR' && item.type === 'equip') itemBonus += 20; 
      if (item.rarity === 'SR') itemBonus += 10;
      if (item.rarity === 'S') itemBonus += 5;
    });
    SETS_DB.forEach(set => {
      if (set.ids.every(reqId => equippedItems.includes(reqId))) {
        setBonus += set.bonus;
        activeSetNames.push(set.name);
      }
    });
    return { itemBonus, setBonus, activeSetNames };
  };

  const checkAnswer = () => {
    let currentEquip = [...equippedItems];
    const usedConsumableId = currentEquip.find(id => {
      const item = ITEMS_DB.find(i => i.id === id);
      return item.rarity === 'SSR' && item.type === 'consumable';
    });

    const userVal = parseInt(userInput);
    let isCorrect = false;

    if (usedConsumableId || userVal === currentQ.a) {
      isCorrect = true;
    }

    if (isCorrect) {
      if (usedConsumableId) {
        setUserInput(currentQ.a);
      }

      const { itemBonus, setBonus, activeSetNames } = calculatePoints();
      const finalPoints = currentQ.points + (combo * 5) + itemBonus + setBonus;
      setScore(score + finalPoints);
      
      let detailMsg = '';
      if (activeSetNames.length > 0) detailMsg += `【${activeSetNames.join('+')}】啟動！`;
      if (setBonus > 0) detailMsg += ` 套裝+${setBonus}分！`;
      else if (itemBonus > 0) detailMsg += ` 道具+${itemBonus}分！`;
      
      if (usedConsumableId) {
        const itemIndexInInv = inventory.indexOf(usedConsumableId);
        if (itemIndexInInv > -1) {
          const newInv = [...inventory];
          newInv.splice(itemIndexInInv, 1);
          setInventory(newInv);
        }
        currentEquip = currentEquip.filter(id => id !== usedConsumableId);
        detailMsg = `神器碎裂了... 原來答案是 ${currentQ.a}！`;
      }

      let bossCounterMsg = '';
      if (isBossActive) {
        if (Math.random() < 0.3) { 
          if (currentEquip.length > 0 && Math.random() < 0.5) { 
            const dropIdx = Math.floor(Math.random() * currentEquip.length);
            const lostId = currentEquip[dropIdx];
            currentEquip.splice(dropIdx, 1);
            
            const invIndex = inventory.indexOf(lostId);
            if (invIndex > -1) {
              const newInv = [...inventory];
              newInv.splice(invIndex, 1);
              setInventory(newInv);
            }
            
            const itemName = ITEMS_DB.find(i => i.id === lostId).name;
            bossCounterMsg = `魔王猛烈反擊！你的裝備【${itemName}】被打飛消失了！`;
          } else {
            bossCounterMsg = `魔王用力甩尾！還好你閃開了！`;
          }
        }
      }

      setEquippedItems(currentEquip);

      if (isBossActive) {
        const newBossStreak = bossStreak + 1;
        setBossStreak(newBossStreak);
        if (newBossStreak >= BOSS_TARGET) {
          setIsBossActive(false);
          setBossStreak(0);
          
          const bossSSRs = ITEMS_DB.filter(i => i.rarity === 'SSR' && i.source === 'boss');
          const rewardSSR = bossSSRs[Math.floor(Math.random() * bossSSRs.length)];
          setBossRewardItem(rewardSSR);
          setInventory(prev => [...prev, rewardSSR.id]);

          setShowBossVictory(true); 
          setMsg("傳說達成！擊敗了魔王！");
        } else {
          setShowReward(true);
          setCombo(combo + 1);
          let finalMsg = `魔王受傷了！(${newBossStreak}/${BOSS_TARGET})`;
          if (bossCounterMsg) finalMsg += `\n${bossCounterMsg}`;
          else finalMsg += `\n${detailMsg}`;
          setMsg(finalMsg);
        }
      } else {
        const newTotal = totalSolved + 1;
        setTotalSolved(newTotal);
        setCombo(combo + 1);
        if (newTotal > 0 && newTotal % BOSS_TRIGGER_COUNT === 0) {
          setIsBossActive(true);
          setBossStreak(0);
          setMsg("警告！暴龍王出現了！");
          setUserInput('');
          generateUniqueQuestion(true); 
        } else {
          setShowReward(true);
          setMsg(`答對啦！` + detailMsg);
        }
      }
    } else {
      setCombo(0);
      setUserInput('');
      if (isBossActive) {
        setBossStreak(0); 
        setMsg('慘了！被魔王打飛！進度歸零！(0/10)');
      } else {
        setMsg('哎呀！被石頭絆倒了，再試一次！');
      }
    }
  };

  const nextLevel = () => {
    setShowReward(false);
    setShowBossVictory(false);
    setBossRewardItem(null); 
    setUserInput('');
    generateUniqueQuestion(isBossActive); 
    if (!isBossActive && !showBossVictory) {
       setMsg('下一隻猛獸來了！小心！');
    } else if (isBossActive) {
       setMsg('魔王生氣了！快攻擊！');
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
    const pool = ITEMS_DB.filter(i => i.rarity === rarity && i.source === 'gacha');
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
    const hasConsumableSSR = equippedItems.some(id => {
      const item = ITEMS_DB.find(i => i.id === id);
      return item.rarity === 'SSR' && item.type === 'consumable';
    });

    const { itemBonus, setBonus, activeSetNames } = calculatePoints();
    const totalBonus = itemBonus + setBonus;
    
    const bgClass = isBossActive ? 'bg-red-900 border-red-500' : (hasConsumableSSR ? 'bg-purple-100 border-purple-500' : 'bg-stone-200 border-stone-700');
    const btnClass = isBossActive ? 'bg-red-600 border-red-900 hover:bg-red-500' : (hasConsumableSSR ? 'bg-purple-600 border-purple-900 hover:bg-purple-500' : 'bg-orange-500 border-stone-800 hover:bg-orange-400');

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md flex flex-col items-center relative z-10">
        {activeSetNames.length > 0 && (
          <div className="absolute -top-24 w-full text-center">
             {activeSetNames.map(name => (
               <div key={name} className="inline-block bg-yellow-400 text-red-900 font-black px-4 py-1 rounded-full border-4 border-red-900 shadow-lg mb-1 animate-bounce">
                 {name} 啟動！ (+{SETS_DB.find(s=>s.name===name).bonus})
               </div>
             ))}
          </div>
        )}

        {isBossActive && (
          <div className="w-full mb-4">
            <div className="flex justify-between items-end mb-1 px-2">
              <span className="text-red-600 font-black text-xl animate-pulse">暴龍王來襲！</span>
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
              const isInActiveSet = SETS_DB.some(set => activeSetNames.includes(set.name) && set.ids.includes(id));
              return (
                <motion.div key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl shadow-md relative ${isInActiveSet ? 'bg-yellow-200 border-orange-500 ring-2 ring-yellow-400' : 'bg-stone-800 border-stone-500'}`}>
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
            <h2 className={`text-3xl font-black mb-2 leading-tight ${isBossActive ? 'text-yellow-400 drop-shadow-md' : 'text-stone-800'}`}>{currentQ.q}</h2>
            {currentQ.unit && <p className={`${isBossActive ? 'text-red-200' : 'text-stone-500'} font-bold text-lg`}>({currentQ.unit})</p>}
          </div>
          <div className="relative z-10">
            <input 
              type="number" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              readOnly={hasConsumableSSR}
              placeholder={hasConsumableSSR ? "神力鎖定" : "?"} 
              className={`w-full text-center text-5xl font-black py-4 border-b-8 rounded-xl transition-all mb-6 ${hasConsumableSSR ? 'bg-yellow-100 text-purple-600 border-purple-400' : 'bg-stone-300 text-stone-700 border-stone-400'}`} 
            />
          </div>
          <button onClick={checkAnswer} disabled={showReward || showBossVictory} className={`w-full text-white font-black py-4 rounded-2xl text-2xl border-4 shadow-[0_6px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-2 transition-all ${btnClass}`}>
            {hasConsumableSSR ? '神力解放 (消耗)' : (isBossActive ? '攻擊魔王！' : `擲出石斧！${totalBonus > 0 ? `(+${totalBonus})` : ''}`)}
          </button>
        </div>
        <p className={`mt-6 font-bold px-4 py-2 rounded-full min-h-[3rem] flex items-center text-center whitespace-pre-line ${isBossActive ? 'bg-red-200 text-red-800' : 'bg-white/50 text-stone-600'}`}>
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
      <div className="text-9xl mb-6 animate-pulse"></div>
      <p className="mb-6 font-bold text-stone-600">一次 100 石幣 / 保證有獎</p>
      <button onClick={handleGacha} className="w-full bg-green-600 text-white font-black py-4 rounded-2xl text-xl border-b-8 border-green-800 active:border-b-0 active:translate-y-2 mb-4">抽一顆蛋 (-100)</button>
      <button onClick={() => setView('game')} className="text-stone-500 font-bold underline">回到遊戲</button>
      <AnimatePresence>
        {gachaResult && (
          <motion.div initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 z-20">
            <div className={`text-sm font-bold mb-2 ${gachaResult.rarity === 'SSR' ? 'text-purple-600' : gachaResult.rarity === 'SR' ? 'text-red-500' : 'text-green-600'}`}>{gachaResult.rarity === 'SSR' ? '傳說' : gachaResult.rarity === 'SR' ? '稀有' : '實用'}</div>
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
          <span>部落背包</span>
          <div className="text-sm bg-stone-800 text-white px-3 py-1 rounded-lg">裝備: {equippedItems.length}/3</div>
        </h2>
        <div className="flex justify-between w-full mb-4">
          <button onClick={resetProgress} className="text-red-500 font-bold underline">刪除存檔重玩</button>
          <button onClick={() => setView('game')} className="text-stone-500 font-bold underline">回到遊戲</button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 w-full">
          {uniqueItems.length === 0 ? (
            <div className="text-center text-stone-400 mt-20">背包空空的...<br/>快去抽蛋！</div>
          ) : (
            uniqueItems.map(id => {
              const item = ITEMS_DB.find(i => i.id === id);
              const ownedCount = inventory.filter(i => i === id).length;
              const equippedCount = equippedItems.filter(i => i === id).length;
              const isMaxEquipped = equippedItems.length >= 3;
              const setInfo = SETS_DB.find(set => set.ids.includes(id));

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
                    {setInfo && <div className="text-[10px] text-purple-600 font-bold bg-purple-100 inline-block px-1 rounded mt-1">集齊: {setInfo.name}</div>}
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
      <div className="w-full max-w-lg flex justify-between items-center mb-6 z-20 px-2">
        <div className="bg-stone-800 text-yellow-400 px-4 py-2 rounded-xl border-4 border-stone-600 shadow-md font-black text-xl flex items-center gap-2"> {score}</div>
        <div className="flex gap-2">
          <button onClick={() => setView('gacha')} disabled={isBossActive} className={`text-white px-3 py-2 rounded-xl border-b-4 font-bold active:translate-y-1 shadow-md ${isBossActive ? 'bg-gray-500 border-gray-700 opacity-50' : 'bg-green-600 border-green-800'}`}> 抽蛋</button>
          <button onClick={() => setView('bag')} disabled={isBossActive} className={`text-white px-3 py-2 rounded-xl border-b-4 font-bold active:translate-y-1 shadow-md relative ${isBossActive ? 'bg-gray-500 border-gray-700 opacity-50' : 'bg-blue-600 border-blue-800'}`}>
            背包
            {equippedItems.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{equippedItems.length}</span>}
          </button>
        </div>
      </div>
      {view === 'game' && renderGame()}
      {view === 'gacha' && renderGacha()}
      {view === 'bag' && renderBag()}
      
      <AnimatePresence>
        {showReward && !isBossActive && !showBossVictory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-yellow-100 w-full max-w-sm p-8 rounded-[3rem] text-center border-[8px] border-orange-500 shadow-2xl">
              <h3 className="text-4xl font-black text-stone-800 mb-2">過關！</h3>
              <p className="text-stone-600 font-bold mb-6">{msg}</p>
              <button onClick={nextLevel} className="w-full bg-green-500 text-white font-black py-4 rounded-2xl text-xl border-4 border-green-800 shadow-lg active:translate-y-2">繼續狩獵</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReward && isBossActive && !showBossVictory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-red-100 w-full max-w-sm p-8 rounded-[3rem] text-center border-[8px] border-red-600 shadow-2xl">
              <h3 className="text-4xl font-black text-red-900 mb-2">攻擊成功！</h3>
              <p className="text-red-700 font-bold mb-6 whitespace-pre-line">{msg}</p>
              <button onClick={nextLevel} className="w-full bg-red-600 text-white font-black py-4 rounded-2xl text-xl border-4 border-red-900 shadow-lg active:translate-y-2">繼續攻擊</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBossVictory && bossRewardItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5, rotate: 360 }} animate={{ scale: 1, rotate: 0 }} className="bg-purple-100 w-full max-w-sm p-8 rounded-[3rem] text-center border-[8px] border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.8)] relative">
              <div className="absolute inset-0 bg-purple-300 opacity-20 animate-pulse rounded-[2.5rem]"></div>
              <h3 className="text-3xl font-black text-purple-900 mb-2 z-10 relative">魔王擊破！</h3>
              <p className="text-stone-600 font-bold mb-4 z-10 relative">太強了！這是給勇者的保底獎勵</p>
              
              <div className="bg-white p-6 rounded-xl border-4 border-purple-300 mb-6 z-10 relative shadow-inner">
                <p className="text-purple-600 font-black text-sm mb-2">獲得魔王專屬傳說神器</p>
                <div className="text-7xl mb-2 animate-bounce">{bossRewardItem.icon}</div>
                <p className="text-2xl font-black text-stone-800">{bossRewardItem.name}</p>
                <p className="text-xs text-stone-500 mt-1">{bossRewardItem.desc}</p>
                <p className="text-xs text-green-600 mt-2 font-bold">(已放入背包)</p>
              </div>
              
              <button onClick={nextLevel} className="w-full relative z-10 bg-purple-600 text-white font-black py-4 rounded-2xl text-xl border-4 border-purple-900 shadow-lg active:translate-y-2">收下裝備</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MathJungleGame;
