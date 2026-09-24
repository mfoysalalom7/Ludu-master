/**
 * Ludo Royale - Data Persistence & Profile System
 * Manages player profile, progression, virtual coins, missions, achievements, and localization
 */

const LOCALIZATION = {
  en: {
    gameTitle: "Ludo Royale",
    play: "Play",
    passAndPlay: "Pass & Play",
    passAndPlayDesc: "Play locally with 2-4 friends",
    computer: "VS Computer",
    computerDesc: "Practice with smart AI opponents",
    online: "Online Match",
    onlineDesc: "Compete with global players",
    friends: "Play With Friends",
    friendsDesc: "Create or join custom room",
    profile: "Profile",
    shop: "Shop",
    missions: "Missions",
    achievements: "Achievements",
    settings: "Settings",
    rules: "Rules & Guide",
    dailyReward: "Daily Reward",
    claim: "Claim",
    claimed: "Claimed",
    coins: "Coins",
    level: "Level",
    wins: "Wins",
    losses: "Losses",
    winRate: "Win Rate",
    gamesPlayed: "Games Played",
    rollDice: "Roll Dice",
    yourTurn: "Your Turn!",
    waitingFor: "Waiting for",
    noLegalMoves: "No legal moves! Passing turn...",
    extraTurnSix: "Rolled a 6! Extra turn!",
    extraTurnCapture: "Captured token! Extra turn!",
    extraTurnFinish: "Token reached home! Extra turn!",
    gameOver: "Game Over",
    playAgain: "Play Again",
    mainMenu: "Main Menu",
    equipped: "Equipped",
    equip: "Equip",
    buy: "Unlock",
    notEnoughCoins: "Not enough coins!",
    roomCode: "Room Code",
    createRoom: "Create Room",
    joinRoom: "Join Room",
    enterRoomCode: "Enter 6-digit Code",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    playersCount: "Players",
    startGame: "Start Game",
    selectColor: "Select Color",
    language: "Language",
    soundFX: "Sound Effects",
    bgMusic: "Background Music",
    vibration: "Vibration Haptics"
  },
  bn: {
    gameTitle: "লুডো রয়্যাল",
    play: "খেলুন",
    passAndPlay: "পাস এবং খেলুন",
    passAndPlayDesc: "২-৪ জন বন্ধুর সাথে স্থানীয়ভাবে খেলুন",
    computer: "বনাম কম্পিউটার",
    computerDesc: "বুদ্ধিমান এআই প্রতিপক্ষের সাথে খেলুন",
    online: "অনলাইন ম্যাচ",
    onlineDesc: "বিশ্বব্যাপী খেলোয়াড়দের সাথে খেলুন",
    friends: "বন্ধুদের সাথে খেলুন",
    friendsDesc: "কাস্টম রুম তৈরি করুন বা যুক্ত হন",
    profile: "প্রোফাইল",
    shop: "দোকান",
    missions: "মিশন",
    achievements: "অর্জন",
    settings: "সেটিংস",
    rules: "নিয়মাবলী",
    dailyReward: "দৈনিক পুরস্কার",
    claim: "সংগ্রহ করুন",
    claimed: "সংগৃহীত",
    coins: "কয়েন",
    level: "লেভেল",
    wins: "জয়",
    losses: "পরাজয়",
    winRate: "জয়ের হার",
    gamesPlayed: "মোট খেলা",
    rollDice: "ছক্কা মারুন",
    yourTurn: "আপনার চাল!",
    waitingFor: "অপেক্ষা করছে",
    noLegalMoves: "কোনো বৈধ চাল নেই! চাল বদল হচ্ছে...",
    extraTurnSix: "৬ পড়েছে! অতিরিক্ত চাল!",
    extraTurnCapture: "ঘুঁটি খেয়েছেন! অতিরিক্ত চাল!",
    extraTurnFinish: "ঘুঁটি ঘরে পৌঁছেছে! অতিরিক্ত চাল!",
    gameOver: "খেলা সমাপ্ত",
    playAgain: "আবার খেলুন",
    mainMenu: "মূল মেনু",
    equipped: "ব্যবহৃত",
    equip: "ব্যবহার করুন",
    buy: "আনলক",
    notEnoughCoins: "পর্যাপ্ত কয়েন নেই!",
    roomCode: "রুম কোড",
    createRoom: "রুম তৈরি করুন",
    joinRoom: "রুমে যোগ দিন",
    enterRoomCode: "৬ সংখ্যার কোড লিখুন",
    easy: "সহজ",
    medium: "মাঝারি",
    hard: "কঠিন",
    playersCount: "খেলোয়াড় সংখ্যা",
    startGame: "খেলা শুরু করুন",
    selectColor: "রং নির্বাচন করুন",
    language: "ভাষা",
    soundFX: "শব্দ প্রভাব",
    bgMusic: "পটভূমি সঙ্গীত",
    vibration: "ভাইব্রেশন"
  },
  hi: {
    gameTitle: "लूडो रॉयल",
    play: "खेलें",
    passAndPlay: "पास और खेलें",
    passAndPlayDesc: "2-4 दोस्तों के साथ ऑफलाइन खेलें",
    computer: "बनाम कंप्यूटर",
    computerDesc: "स्मार्ट एआई के साथ मुकाबला करें",
    online: "ऑनलाइन मैच",
    onlineDesc: "दुनिया भर के खिलाड़ियों से मुकाबला करें",
    friends: "दोस्तों के साथ खेलें",
    friendsDesc: "कस्टम रूम बनाएं या जुड़ें",
    profile: "प्रोफ़ाइल",
    shop: "दुकान",
    missions: "मिशन",
    achievements: "उपलब्धियां",
    settings: "सेटिंग्स",
    rules: "खेल के नियम",
    dailyReward: "दैनिक पुरस्कार",
    claim: "प्राप्त करें",
    claimed: "प्राप्त किया",
    coins: "सिक्के",
    level: "स्तर",
    wins: "जीत",
    losses: "हार",
    winRate: "जीत दर",
    gamesPlayed: "कुल खेल",
    rollDice: "पासा फेंकें",
    yourTurn: "आपकी बारी!",
    waitingFor: "प्रतीक्षा में",
    noLegalMoves: "कोई वैध चाल नहीं! बारी आगे बढ़ रही है...",
    extraTurnSix: "६ आया! अतिरिक्त बारी!",
    extraTurnCapture: "गोटी काटी! अतिरिक्त बारी!",
    extraTurnFinish: "गोटी घर पहुंची! अतिरिक्त बारी!",
    gameOver: "खेल समाप्त",
    playAgain: "फिर से खेलें",
    mainMenu: "मुख्य मेनू",
    equipped: "सक्रिय",
    equip: "चुनें",
    buy: "अनलॉक",
    notEnoughCoins: "पर्याप्त सिक्के नहीं हैं!",
    roomCode: "रूम कोड",
    createRoom: "रूम बनाएं",
    joinRoom: "रूम से जुड़ें",
    enterRoomCode: "६ अंकों का कोड दर्ज करें",
    easy: "सरल",
    medium: "मध्यम",
    hard: "कठिन",
    playersCount: "खिलाड़ियों की संख्या",
    startGame: "खेल शुरू करें",
    selectColor: "रंग चुनें",
    language: "भाषा",
    soundFX: "ध्वनि प्रभाव",
    bgMusic: "पृष्ठभूमि संगीत",
    vibration: "कंपन"
  }
};

const DEFAULT_PROFILE = {
  name: "RoyalePlayer",
  avatar: "👑",
  level: 1,
  xp: 0,
  coins: 2500,
  stats: {
    played: 0,
    won: 0,
    lost: 0,
    captures: 0,
    sixes: 0
  },
  settings: {
    sound: true,
    music: true,
    vibration: true,
    language: "en",
    quality: "high"
  },
  inventory: {
    themes: ["classic"],
    dice: ["classic"],
    tokens: ["gem"],
    frames: ["none"],
    equippedTheme: "classic",
    equippedDice: "classic",
    equippedToken: "gem",
    equippedFrame: "none"
  },
  daily: {
    lastClaimDate: null,
    streak: 0
  },
  missions: [
    { id: "m1", title: "Roll three 6s in matches", target: 3, current: 0, reward: 200, completed: false, claimed: false },
    { id: "m2", title: "Capture 2 opponent tokens", target: 2, current: 0, reward: 350, completed: false, claimed: false },
    { id: "m3", title: "Win 1 match in any mode", target: 1, current: 0, reward: 500, completed: false, claimed: false }
  ],
  achievements: [
    { id: "a1", icon: "⚔️", title: "First Blood", desc: "Capture your first opponent token", progress: 0, target: 1, reward: 250, completed: false, claimed: false },
    { id: "a2", icon: "🎲", title: "Sixer Master", desc: "Roll a six 20 times", progress: 0, target: 20, reward: 500, completed: false, claimed: false },
    { id: "a3", icon: "🏆", title: "Ludo Champion", desc: "Win 5 matches", progress: 0, target: 5, reward: 1000, completed: false, claimed: false },
    { id: "a4", icon: "👑", title: "Royale Legend", desc: "Reach Player Level 5", progress: 1, target: 5, reward: 2000, completed: false, claimed: false }
  ]
};

class StorageManager {
  constructor() {
    this.key = "LUDO_ROYALE_DATA_V1";
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          stats: { ...DEFAULT_PROFILE.stats, ...(parsed.stats || {}) },
          settings: { ...DEFAULT_PROFILE.settings, ...(parsed.settings || {}) },
          inventory: { ...DEFAULT_PROFILE.inventory, ...(parsed.inventory || {}) },
          daily: { ...DEFAULT_PROFILE.daily, ...(parsed.daily || {}) }
        };
      }
    } catch (_) {}
    return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }

  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (_) {}
  }

  get t() {
    const lang = this.data.settings.language || "en";
    return LOCALIZATION[lang] || LOCALIZATION.en;
  }

  addCoins(amount) {
    this.data.coins = Math.max(0, this.data.coins + amount);
    this.save();
    return this.data.coins;
  }

  addXP(amount) {
    this.data.xp += amount;
    const nextLevelXP = this.data.level * 300;
    let leveledUp = false;
    while (this.data.xp >= nextLevelXP) {
      this.data.xp -= nextLevelXP;
      this.data.level += 1;
      leveledUp = true;
      this.addCoins(this.data.level * 150);
      this.updateAchievement("a4", this.data.level);
    }
    this.save();
    return { level: this.data.level, xp: this.data.xp, leveledUp };
  }

  recordMatch(won, captures = 0, sixes = 0) {
    this.data.stats.played += 1;
    if (won) {
      this.data.stats.won += 1;
      this.addXP(250);
      this.addCoins(300);
      this.updateMission("m3", 1);
    } else {
      this.data.stats.lost += 1;
      this.addXP(80);
      this.addCoins(50);
    }
    this.data.stats.captures += captures;
    this.data.stats.sixes += sixes;

    if (captures > 0) {
      this.updateMission("m2", captures);
      this.updateAchievement("a1", this.data.stats.captures);
    }
    if (sixes > 0) {
      this.updateMission("m1", sixes);
      this.updateAchievement("a2", this.data.stats.sixes);
    }
    this.updateAchievement("a3", this.data.stats.won);

    this.save();
  }

  updateMission(id, progress) {
    const m = this.data.missions.find(x => x.id === id);
    if (m && !m.completed) {
      m.current = Math.min(m.target, m.current + progress);
      if (m.current >= m.target) {
        m.completed = true;
      }
      this.save();
    }
  }

  claimMission(id) {
    const m = this.data.missions.find(x => x.id === id);
    if (m && m.completed && !m.claimed) {
      m.claimed = true;
      this.addCoins(m.reward);
      this.save();
      return m.reward;
    }
    return 0;
  }

  updateAchievement(id, val) {
    const a = this.data.achievements.find(x => x.id === id);
    if (a && !a.completed) {
      a.progress = Math.min(a.target, val);
      if (a.progress >= a.target) {
        a.completed = true;
      }
      this.save();
    }
  }

  claimAchievement(id) {
    const a = this.data.achievements.find(x => x.id === id);
    if (a && a.completed && !a.claimed) {
      a.claimed = true;
      this.addCoins(a.reward);
      this.save();
      return a.reward;
    }
    return 0;
  }

  canClaimDailyReward() {
    const today = new Date().toDateString();
    return this.data.daily.lastClaimDate !== today;
  }

  claimDailyReward() {
    if (!this.canClaimDailyReward()) return null;
    const today = new Date().toDateString();
    let streak = this.data.daily.streak || 0;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (this.data.daily.lastClaimDate === yesterday) {
      streak = (streak % 7) + 1;
    } else {
      streak = 1;
    }

    const reward = streak * 150 + 100;
    this.data.daily.lastClaimDate = today;
    this.data.daily.streak = streak;
    this.addCoins(reward);
    this.save();
    return { streak, reward };
  }
}

window.storageManager = new StorageManager();
