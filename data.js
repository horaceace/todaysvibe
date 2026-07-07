// ============================================================
// Today's Vibe — Data Pools
// 300 adjectives × 200 nouns × 200 descriptions × 100 colors × 150 emojis × 99 numbers
// = ~17.8 billion possible unique vibes
// ============================================================

const ADJECTIVES = [
  // Cosmic / Celestial (30)
  "Cosmic","Lunar","Solar","Stellar","Galactic","Celestial","Astral","Ethereal","Heavenly",
  "Interstellar","Supernova","Nebular","Orbital","Twilight","Aurora","Eclipsing","Zenith",
  "Comet","Meteor","Constellation","Northern","Southern","Polaris","Andromeda","Orion",
  "Nova","Eventide","Daybreak","Meridian","Equinox",

  // Weather / Elemental (30)
  "Stormy","Thunderous","Electric","Glacial","Volcanic","Oceanic","Tidal","Seismic",
  "Torrential","Breezy","Misty","Foggy","Crystalline","Verdant","Blazing","Scorching",
  "Freezing","Tropical","Arctic","Monsoon","Cyclonic","Tempest","Gale","Drizzle",
  "Humid","Arid","Frostbitten","Sun-drenched","Rain-soaked","Wind-swept",

  // Precious / Mineral (25)
  "Golden","Silver","Bronze","Copper","Emerald","Ruby","Sapphire","Amethyst","Obsidian",
  "Ivory","Ebony","Crimson","Azure","Violet","Amber","Jade","Coral","Pearl","Opal",
  "Onyx","Diamond","Platinum","Titanium","Quartz","Topaz",

  // Energy / Intensity (30)
  "Chaotic","Serene","Wild","Gentle","Fierce","Soft","Sharp","Loud","Quiet",
  "Bright","Dark","Light","Heavy","Floating","Grounded","Intense","Mellow",
  "Magnetic","Radiant","Volatile","Steady","Explosive","Subtle","Overwhelming",
  "Whispering","Roaring","Pulsing","Vibrating","Humming","Buzzing",

  // Mood / Emotion (35)
  "Euphoric","Melancholic","Wistful","Gloomy","Blissful","Brooding","Ecstatic",
  "Pensive","Fiery","Tranquil","Restless","Content","Yearning","Nostalgic",
  "Hopeful","Defiant","Tender","Bold","Timid","Anxious","Fearless","Giddy",
  "Somber","Playful","Mischievous","Reverent","Irreverent","Curious","Awestruck",
  "Enchanted","Bewildered","Delirious","Lovesick","Homesick","Wanderlust",

  // Texture / Material (25)
  "Velvet","Silken","Glassy","Honeyed","Smoky","Neon","Chrome","Holographic",
  "Iridescent","Translucent","Liquid","Solid","Gaseous","Digital","Analog",
  "Quantum","Prismatic","Mirrored","Matte","Glossy","Metallic","Wooden","Stony",
  "Waxen","Inky",

  // Temporal (20)
  "Ancient","Futuristic","Timeless","Momentary","Eternal","Fleeting","Vintage",
  "Retro","Modern","Primal","Newborn","Prehistoric","Cyber","Medieval",
  "Victorian","Noir","Renaissance","Baroque","Industrial","Atomic",

  // Mystical / Arcane (25)
  "Mystic","Divine","Primal","Sacred","Profane","Blessed","Cursed","Enchanted",
  "Haunted","Holy","Demonic","Angelic","Mortal","Immortal","Arcane","Occult",
  "Runic","Ritual","Oracle","Prophetic","Fated","Karmic","Phantom","Spectral",
  "Otherworldly",

  // Movement / Flow (25)
  "Drifting","Surging","Spinning","Crashing","Flowing","Soaring","Sinking",
  "Rising","Falling","Wandering","Rushing","Lingering","Dancing","Racing",
  "Crawling","Flying","Swimming","Swaying","Swinging","Tumbling","Cascading",
  "Unfolding","Gliding","Spiraling","Meandering",

  // Sensory (25)
  "Sweet","Bitter","Spicy","Savory","Intoxicating","Soothing","Piercing",
  "Melodic","Symphonic","Discordant","Harmonious","Rhythmic","Lyrical",
  "Thunderous","Echoing","Resonant","Dissonant","Velvety","Crisp","Smooth",
  "Rough","Tender","Raw","Burnt","Fragrant",

  // Quirky / Specific (30)
  "Feral","Unhinged","Delulu","Gremlin","Goblin","Chaotic-good","Chaotic-evil",
  "Lawful-chaotic","Boujee","Scrungly","Blorbo","Cringe-but-free","Hot-mess",
  "Type-A","Type-B","Over-caffeinated","Under-slept","Overthinking","Undercooked",
  "Fully-sent","Half-awake","Main-character","Side-character","NPC","Boss-level",
  "Speedrun","Low-poly","HD","4K","8-bit"
];

const NOUNS = [
  // Forces / Energies (30)
  "Hurricane","Thunder","Sunshine","Moonlight","Starlight","Energy","Frequency",
  "Wavelength","Vibration","Radiation","Current","Voltage","Gravity","Magnetism",
  "Friction","Momentum","Inertia","Entropy","Resonance","Echo","Pulse","Heartbeat",
  "Rhythm","Melody","Harmony","Discord","Crescendo","Reverb","Static","Signal",

  // Celestial (20)
  "Comet","Meteor","Eclipse","Supernova","Nebula","Galaxy","Universe","Multiverse",
  "Constellation","Void","Abyss","Horizon","Zenith","Atmosphere","Stratosphere",
  "Ionosphere","Orbit","Axis","Equator","Meridian",

  // Nature / Elements (30)
  "Storm","Fire","Ice","Wind","Ocean","Forest","Desert","Mountain","River",
  "Waterfall","Avalanche","Volcano","Earthquake","Tsunami","Cyclone","Tornado",
  "Blizzard","Monsoon","Drought","Flood","Wildfire","Aurora","Rainbow","Sunset",
  "Sunrise","Midnight","Dawn","Dusk","Frost","Bloom",

  // Realms / Spaces (20)
  "Dimension","Realm","Kingdom","Garden","Labyrinth","Maze","Frontier","Territory",
  "Wilderness","Sanctuary","Haven","Citadel","Temple","Ruins","Battlefield",
  "Playground","Wonderland","Dreamscape","Nightscape","Liminal-space",

  // Abstract Concepts (30)
  "Chaos","Order","Magic","Miracle","Disaster","Revolution","Evolution","Revelation",
  "Sensation","Manifestation","Riddle","Secret","Mystery","Prophecy","Legend",
  "Myth","Fable","Destiny","Fate","Fortune","Karma","Paradox","Anomaly","Glitch",
  "Matrix","Simulation","Algorithm","Code","Cipher","Blueprint",

  // States of Being (20)
  "Euphoria","Melancholy","Nostalgia","Bliss","Anguish","Ecstasy","Serenity",
  "Frenzy","Trance","Haze","Daze","Flow-state","Daydream","Reverie","Insomnia",
  "Adrenaline","Dopamine","Serotonin","Cortisol","Oxytocin",

  // Creatures / Spirits (15)
  "Phoenix","Dragon","Wolf","Tiger","Fox","Owl","Raven","Serpent","Panther",
  "Kraken","Siren","Ghost","Spirit","Demon","Angel",

  // Pop / Internet Culture (15)
  "Main-character","Side-quest","Boss-battle","Cutscene","Speedrun","Glitch",
  "Easter-egg","DLC","Patch-note","Hotfix","Loading-screen","Screenshot",
  "Meme","Vibe-check","Reality-check",

  // Quirky (20)
  "Brainrot","Brain-blast","Thought-spiral","Hyperfixation","Intrusive-thought",
  "Shower-thought","2am-thought","Call-of-the-void","Deja-vu","Synchronicity",
  "Coincidence","Plot-twist","Cliffhanger","Origin-story","Character-arc",
  "Redemption-arc","Villain-era","Healing-era","Flop-era","Comeback"
];

const DESCRIPTIONS = [
  // Go with the flow (25)
  "trust the chaos. it knows the way.",
  "go with the flow. the flow is correct.",
  "you're exactly where you need to be.",
  "don't overthink it. or do. either way, you'll be fine.",
  "the universe has your back today.",
  "let things unfold. you're not in a hurry.",
  "surrender to the vibe. resistance is exhausting.",
  "today, let the current carry you.",
  "effortless. that's the energy. embody it.",
  "you don't need to have it all figured out.",
  "the plan is: there is no plan. enjoy that.",
  "go where the energy takes you.",
  "floating is a valid form of movement.",
  "today is not for solving. it's for being.",
  "release the need to control everything.",
  "sometimes the best move is no move.",
  "drift. wander. meander. it's allowed.",
  "you're not lost. you're exploring.",
  "the detour IS the destination today.",
  "let the day surprise you.",
  "don't force it. if it's yours, it'll find you.",
  "patience is today's superpower.",
  "let it be messy. mess is honest.",
  "you don't owe anyone productivity today.",
  "rest is productive. remember that.",

  // Main character energy (25)
  "you're the main character today. act accordingly.",
  "walk like you're in a movie montage.",
  "everyone's looking. give them something to see.",
  "today, you're the plot twist.",
  "main character energy: ACTIVATED.",
  "the spotlight found you. don't hide.",
  "you're not a side character in anyone's story.",
  "stride into rooms like you own them.",
  "today you're unforgettable. lean into it.",
  "your entrance is queued. make it count.",
  "head up. shoulders back. you're THAT person today.",
  "the camera is on you. smile.",
  "you're the protagonist. the story bends to you.",
  "even your mistakes look iconic today.",
  "romanticize your own life. you're the lead.",
  "main character doesn't mean perfect. it means PRESENT.",
  "your arc today: glow, conquer, repeat.",
  "every coincidence today is a plot device for you.",
  "the soundtrack of today was written for you.",
  "you're in your prime. this is the good part.",
  "NPC energy? not today. not ever.",
  "center frame. center stage. center of gravity.",
  "your presence is a gift. unwrap it.",
  "today is YOUR episode. everyone else is guest starring.",
  "turn the volume up on yourself today.",

  // Chaos gremlin (25)
  "chaos mode: ENGAGED. good luck everyone.",
  "you're a little unhinged today. that's valid.",
  "bring the chaos. the fun kind.",
  "today you're a beautiful disaster.",
  "controlled demolition of your own plans. enjoy.",
  "hot mess express has arrived. all aboard.",
  "your inner gremlin is awake. feed it snacks.",
  "today's agenda: cause problems on purpose.",
  "chaos isn't a pit. chaos is a playground.",
  "you're not a mess. you're a mosaic.",
  "today, your unpredictability is your charm.",
  "feral but make it fashion.",
  "you woke up and chose violence. respect.",
  "today: zero thoughts, all vibes.",
  "the intrusive thoughts are winning. let them.",
  "organized chaos is still chaos. lean in.",
  "your brain today: 47 open tabs, music playing, can't find which one.",
  "goblin mode: maximum efficiency through minimum effort.",
  "today you contain multitudes. loud multitudes.",
  "the filter between brain and mouth is ON BREAK.",
  "you're a Category 5 event. board up the windows.",
  "today's aesthetic: beautiful garbage fire.",
  "winging it is a strategy. you're proving that.",
  "spontaneous combustion of plans. it's fine, everything's fine.",
  "the raccoon of your soul is rummaging through the trash. let it.",

  // Soft / Gentle (25)
  "softness is strength. today proves it.",
  "be gentle with yourself. you're doing great.",
  "tender heart, strong boundaries. that's the combo.",
  "you don't have to be tough today. soft is powerful.",
  "today is for gentle things: tea, sunlight, deep breaths.",
  "protect your peace. it's the most valuable thing.",
  "you're allowed to be soft. the world is hard enough.",
  "kindness is your superpower today. use it.",
  "let people be wrong about you. you know who you are.",
  "today, your sensitivity is a gift, not a weakness.",
  "hold space for yourself first.",
  "you're not too much. you never were.",
  "gentle doesn't mean weak. it means intentional.",
  "nurture yourself like you nurture others.",
  "your softness has survived everything. respect it.",
  "today: low volume, high presence.",
  "quiet confidence. the loudest kind.",
  "you don't need to prove anything to anyone.",
  "rest in your own gentleness. it's earned.",
  "a soft heart in a hard world is an act of rebellion.",
  "today, let things touch you. that's living.",
  "vulnerability is courage in disguise.",
  "be the calm you wish to see in the world.",
  "soft launch your best self today.",
  "tenderness is not fragility. it's resilience.",

  // Hustle / Fire (25)
  "today you're unstoppable. don't question it.",
  "the grind is real and you ARE the grind.",
  "light the fire. then become it.",
  "momentum is on your side. push.",
  "you're not tired. you're just warming up.",
  "today is for DOING. thinking was yesterday.",
  "full throttle. no brakes. you'll sleep later.",
  "your ambition is showing. don't cover it up.",
  "attack the day before it attacks you.",
  "lock in. the world is not ready.",
  "today's pace: SPRINT. tomorrow: also SPRINT.",
  "you've been preparing for this without knowing.",
  "hungry. focused. dangerous (in a good way).",
  "no distractions. you're on a mission.",
  "your future self is begging you to start today.",
  "the mountain isn't going to climb itself.",
  "today you match your ambition with action.",
  "rise and GRIND. then grind some more.",
  "excuses are cancelled today. so is hesitation.",
  "you're closer than you think. keep going.",
  "be the energy you want to attract.",
  "today: all gas, no brakes, good music.",
  "your potential is knocking. open the door.",
  "the best time was yesterday. the second best is NOW.",
  "move like you can't lose.",

  // Mystic / Intuitive (25)
  "trust your intuition. it knows before you do.",
  "the signs are everywhere today. pay attention.",
  "you're more psychic than you give yourself credit for.",
  "something is trying to reach you. listen.",
  "your gut feeling is the most intelligent thing about you.",
  "the veil is thin today. notice the coincidences.",
  "you're picking up on frequencies others miss.",
  "today, let your soul lead. your brain can rest.",
  "the universe is winking at you. wink back.",
  "you already know the answer. stop asking.",
  "synchronicities are not random today.",
  "your dreams last night were trying to tell you something.",
  "today you're a channel for something bigger.",
  "trust the pull. it's not random.",
  "the magic is not out there. it's in your noticing.",
  "deja vu today is a checkpoint. you're on track.",
  "your ancestors are cheering for you. hear them.",
  "the cards are in your favor. you don't need to shuffle.",
  "today, you see through the noise.",
  "intuition is just your brain processing faster than your mouth.",
  "you're magnetic today. watch what comes to you.",
  "the right people will find you. stay visible.",
  "close your eyes. the answer is there.",
  "you're not imagining it. it IS a sign.",
  "today's message will arrive in threes. watch for it.",

  // Weirdly specific (25)
  "the vibe of freshly washed sheets on a Sunday.",
  "you're giving '3am gas station snack run' energy.",
  "today you're the feeling of finding money in an old jacket.",
  "the energy of a cat knocking something off a table. deliberate chaos.",
  "you're the smell of rain on hot pavement.",
  "today you're the last fry at the bottom of the bag. lucky.",
  "vibe: the moment before a sneeze that never comes.",
  "you're giving 'accidentally sent a screenshot to the person you were talking about.'",
  "today: the satisfaction of peeling off a sticker in one piece.",
  "you're the feeling of a canceled meeting you forgot about.",
  "vibe: that one perfectly ripe avocado.",
  "you're giving 'remembered your password on the first try.'",
  "today you're the cold side of the pillow.",
  "the energy of a WiFi connection that just WORKS.",
  "you're the feeling of a typo that made the message better.",
  "today: the last person chosen in dodgeball. but you win the game.",
  "you're giving 'found the missing sock' relief.",
  "vibe: a pen that writes really smoothly on the first stroke.",
  "you're the feeling of someone saying your name correctly on the first try.",
  "today you're the unexpected B-side that's better than the single.",
  "the energy of a green light when you're already late.",
  "you're giving 'perfectly toasted marshmallow' vibes.",
  "today: the moment when a song ends exactly as you park.",
  "you're the feeling of a zipper that doesn't get stuck.",
  "vibe: the other sock just turned up. everything's fine."
];

const COLORS = [
  "#8B5CF6","#A78BFA","#C084FC","#D8B4FE","#E9D5FF",    // Purples
  "#6366F1","#818CF8","#A5B4FC","#C7D2FE","#E0E7FF",    // Indigos
  "#3B82F6","#60A5FA","#93C5FD","#BFDBFE","#DBEAFE",    // Blues
  "#06B6D4","#22D3EE","#67E8F9","#A5F3FC","#CFFAFE",    // Cyans
  "#10B981","#34D399","#6EE7B7","#A7F3D0","#D1FAE5",    // Emeralds
  "#84CC16","#A3E635","#BEF264","#D9F99D","#ECFCCB",    // Limes
  "#F59E0B","#FBBF24","#FCD34D","#FDE68A","#FEF3C7",    // Ambers
  "#F97316","#FB923C","#FDBA74","#FED7AA","#FFEDD5",    // Oranges
  "#EF4444","#F87171","#FCA5A5","#FECACA","#FEE2E2",    // Reds
  "#EC4899","#F472B6","#F9A8D4","#FBCFE8","#FCE7F3",    // Pinks
  "#14B8A6","#2DD4BF","#5EEAD4","#99F6E4","#CCFBF1",    // Teals
  "#F43F5E","#FB7185","#FDA4AF","#FECDD3","#FFE4E6",    // Roses
  "#8B5CF6","#7C3AED","#6D28D9","#5B21B6","#4C1D95",    // Deep Purples
  "#2563EB","#1D4ED8","#1E40AF","#1E3A8A","#172554",    // Deep Blues
  "#DC2626","#B91C1C","#991B1B","#7F1D1D","#450A0A",    // Deep Reds
  "#FBBF24","#F59E0B","#D97706","#B45309","#92400E",    // Golds
  "#A3A3A3","#737373","#525252","#404040","#171717",    // Grays
  "#FF6B6B","#FFE66D","#4ECDC4","#45B7D1","#96CEB4",    // Playful
  "#FF8A5C","#EA526F","#2EC4B6","#20A4F3","#011627",    // Bold
  "#FF006E","#FB5607","#FFBE0B","#8338EC","#3A86FF"     // Vibrant
];

const EMOJIS = [
  "🌀","🌊","🔥","⚡","🌟","✨","💫","⭐","🌙","☀️",
  "🌈","🦋","🌻","🍀","🌹","🌸","💐","🌺","🍄","🌿",
  "🕊️","🐉","🦊","🐺","🦉","🐈","🦁","🐉","🦄","🦚",
  "💎","🔮","🎭","🎪","🎲","🎯","🎸","🎵","🎶","🎧",
  "💜","💙","💚","💛","🧡","❤️","🩷","🩵","🤍","🖤",
  "☕","🍵","🧋","🍜","🍕","🧁","🍩","🥑","🍉","🧊",
  "🏔️","🏝️","🌋","🏙️","🌃","🏰","🗼","🎡","🚀","🛸",
  "👑","💍","🗝️","📿","🪬","🧿","⚱️","🏺","🕯️","📜",
  "🫧","💭","🧩","🪞","🎀","🪻","🪷","🌪️","🫠","🫶",
  "💅","🧠","👁️","🫀","🦴","👻","🤖","👾","🎃","💀",
  "♠️","♣️","♥️","♦️","🃏","🎴","🀄","🎋","🎍","🏮",
  "🪐","☄️","🌌","🌠","🌅","🌄","🎆","🎇","✨","💥",
  "🧿","🪬","🔱","⚜️","🪶","🪽","🐚","🪸","🪨","💠",
  "🕶️","🎩","🧢","👒","👟","🧣","🧤","👜","💼","⌚",
  "📸","🎬","🎤","🎹","🥁","🎺","🎷","🎻","🪕","🎼"
];

// Use a seeded PRNG (mulberry32) for deterministic daily results
function seededRandom(seed) {
  let s = seed | 0;
  return function() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDateSeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function pickFrom(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}
