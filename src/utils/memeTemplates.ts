import { MemeTemplate } from '../types';

/**
 * High-quality SVG-based meme templates.
 * These are self-contained vector meme artworks that load instantly with zero CORS issues,
 * allowing flawless canvas export and editing.
 */

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake-hotline',
    title: 'Drake Hotline Bling',
    category: 'trending',
    description: 'Rejecting something in the top panel, enthusiastically approving in the bottom panel.',
    defaultTopText: 'WRITING 50 LINES OF BOILERPLATE',
    defaultBottomText: 'CLICKING MAGIC AI CAPTION',
    defaultLayout: 'classic',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.25"/>
          </filter>
        </defs>
        <!-- Background Grid / Two panels -->
        <rect width="800" height="800" fill="#18181b"/>
        <!-- Top Panel: Dislike / Reject -->
        <rect x="0" y="0" width="380" height="395" fill="#fef3c7"/>
        <rect x="380" y="0" width="420" height="395" fill="#ffffff"/>
        <!-- Drake Top Figure -->
        <g transform="translate(40, 20)">
          <!-- Jacket -->
          <path d="M 60 220 C 60 180, 100 130, 160 120 C 220 130, 260 180, 260 220 L 290 360 L 30 360 Z" fill="#ea580c"/>
          <!-- Head -->
          <circle cx="160" cy="110" r="55" fill="#a16207"/>
          <!-- Beard & hair -->
          <path d="M 115 110 C 115 65, 205 65, 205 110 C 205 155, 115 155, 115 110" fill="#271d15" opacity="0.3"/>
          <path d="M 120 100 C 120 70, 200 70, 200 100 L 195 95 C 170 70, 150 70, 125 95 Z" fill="#1c1917"/>
          <path d="M 130 135 C 145 155, 175 155, 190 135 C 190 160, 130 160, 130 135" fill="#1c1917"/>
          <!-- Closed grimacing eyes & hand push away -->
          <path d="M 135 112 Q 145 106 155 112" stroke="#1c1917" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M 165 112 Q 175 106 185 112" stroke="#1c1917" stroke-width="4" fill="none" stroke-linecap="round"/>
          <!-- Rejecting Hand gesture (palm up/away) -->
          <rect x="220" y="160" width="70" height="35" rx="15" transform="rotate(-30 220 160)" fill="#a16207"/>
          <circle cx="260" cy="140" r="22" fill="#a16207"/>
          <circle cx="280" cy="130" r="14" fill="#a16207"/>
          <!-- Expression / head tilt -->
          <path d="M 150 132 Q 160 138 170 132" stroke="#451a03" stroke-width="4" fill="none"/>
        </g>
        <line x1="0" y1="398" x2="800" y2="398" stroke="#000000" stroke-width="6"/>

        <!-- Bottom Panel: Like / Approving -->
        <rect x="0" y="402" width="380" height="398" fill="#fef3c7"/>
        <rect x="380" y="402" width="420" height="398" fill="#ffffff"/>
        <!-- Drake Bottom Figure -->
        <g transform="translate(40, 420)">
          <!-- Jacket -->
          <path d="M 50 220 C 50 180, 100 130, 170 120 C 230 130, 270 180, 270 220 L 300 360 L 20 360 Z" fill="#ea580c"/>
          <!-- Head smiling -->
          <circle cx="170" cy="105" r="55" fill="#a16207"/>
          <path d="M 130 95 C 130 65, 210 65, 210 95 L 205 90 C 180 65, 160 65, 135 90 Z" fill="#1c1917"/>
          <path d="M 140 130 C 155 155, 185 155, 200 130 C 200 155, 140 155, 140 130" fill="#1c1917"/>
          <!-- Happy smiling eyes & teeth -->
          <path d="M 145 105 Q 155 115 165 105" stroke="#1c1917" stroke-width="4" fill="none"/>
          <path d="M 175 105 Q 185 115 195 105" stroke="#1c1917" stroke-width="4" fill="none"/>
          <path d="M 155 128 Q 170 142 185 128 Z" fill="#ffffff"/>
          <!-- Pointing Finger Hand -->
          <path d="M 230 190 L 330 160 L 340 185 L 250 220 Z" fill="#ea580c"/>
          <circle cx="345" cy="170" r="18" fill="#a16207"/>
          <rect x="345" y="162" width="55" height="18" rx="8" transform="rotate(-10 345 162)" fill="#a16207"/>
        </g>
        <line x1="380" y1="0" x2="380" y2="800" stroke="#000000" stroke-width="4"/>
      </svg>
    `),
  },
  {
    id: 'distracted-boyfriend',
    title: 'Distracted Boyfriend',
    category: 'trending',
    description: 'Man walking with girlfriend but turning around to admire another passing option.',
    defaultTopText: 'NEW JAVASCRIPT FRAMEWORK',
    defaultBottomText: 'MY CURRENT PRODUCTION STACK',
    defaultLayout: 'classic',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600">
        <!-- Street sunny background -->
        <rect width="900" height="600" fill="#bae6fd"/>
        <rect y="380" width="900" height="220" fill="#78716c"/>
        <rect y="370" width="900" height="15" fill="#a8a29e"/>
        <line x1="0" y1="480" x2="900" y2="480" stroke="#fbbf24" stroke-width="8" stroke-dasharray="40 30"/>

        <!-- Passing Girl in Red (Left foreground) -->
        <g transform="translate(140, 180)">
          <ellipse cx="60" cy="50" rx="35" ry="40" fill="#fbcfe8"/>
          <!-- Long brown hair flowing -->
          <path d="M 25 40 C 20 100, 40 180, 80 200 C 60 140, 80 70, 70 30 Z" fill="#78350f"/>
          <!-- Red Dress -->
          <path d="M 35 90 Q 60 80 85 90 L 115 280 L 10 280 Z" fill="#dc2626"/>
          <circle cx="65" cy="45" r="30" fill="#fed7aa"/>
          <path d="M 68 42 Q 78 40 82 45" stroke="#451a03" stroke-width="3" fill="none"/>
        </g>

        <!-- Boyfriend in Blue Plaid (Center, turned back) -->
        <g transform="translate(420, 140)">
          <!-- Legs walking right -->
          <path d="M 60 300 L 40 450 L 80 450 L 90 320 L 130 450 L 170 450 L 120 300 Z" fill="#1e3a8a"/>
          <!-- Blue Shirt with torso twisted left -->
          <path d="M 40 140 Q 90 120 150 140 L 140 310 L 40 310 Z" fill="#0284c7"/>
          <!-- Head completely turned looking backwards left -->
          <circle cx="45" cy="85" r="42" fill="#fed7aa"/>
          <path d="M 20 70 C 25 40, 75 40, 80 70 Z" fill="#451a03"/>
          <!-- Shocked/Impressed wide eye looking back -->
          <ellipse cx="32" cy="85" rx="8" ry="10" fill="#ffffff"/>
          <circle cx="30" cy="85" r="4" fill="#000000"/>
          <path d="M 25 105 Q 38 120 50 110" stroke="#451a03" stroke-width="4" fill="none"/>
        </g>

        <!-- Furious Girlfriend (Right side) -->
        <g transform="translate(680, 160)">
          <!-- Purple top -->
          <path d="M 30 130 Q 70 120 110 130 L 120 300 L 20 300 Z" fill="#9333ea"/>
          <!-- Furious face looking left at boyfriend -->
          <circle cx="60" cy="75" r="38" fill="#fed7aa"/>
          <path d="M 30 65 C 40 30, 95 30, 95 65 Z" fill="#854d0e"/>
          <!-- Angry eyes & open shouting mouth -->
          <line x1="42" y1="68" x2="55" y2="76" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
          <line x1="68" y1="76" x2="80" y2="68" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
          <ellipse cx="58" cy="95" rx="14" ry="10" fill="#7f1d1d"/>
          <!-- Arm clutching his shoulder angrily -->
          <path d="M 25 150 L -90 170 L -80 195 L 20 180 Z" fill="#fed7aa"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'two-buttons-sweating',
    title: 'Two Buttons / Sweating Guy',
    category: 'trending',
    description: 'Anxious character sweating profusely trying to choose between two conflicting options.',
    defaultTopText: 'FIX THE PRODUCTION BUG PROPERLY',
    defaultBottomText: 'RESTART THE CONTAINER AND PRAY',
    defaultLayout: 'classic',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <!-- Background Control Console -->
        <rect width="800" height="600" fill="#0f172a"/>
        <!-- Panel slant -->
        <polygon points="0,200 800,100 800,600 0,600" fill="#1e293b"/>
        
        <!-- Red Button 1 (Left) -->
        <g transform="translate(180, 170)">
          <ellipse cx="70" cy="50" rx="75" ry="40" fill="#7f1d1d"/>
          <ellipse cx="70" cy="40" rx="68" ry="32" fill="#ef4444"/>
          <ellipse cx="65" cy="35" rx="45" ry="18" fill="#f87171"/>
        </g>

        <!-- Red Button 2 (Right) -->
        <g transform="translate(480, 130)">
          <ellipse cx="70" cy="50" rx="75" ry="40" fill="#7f1d1d"/>
          <ellipse cx="70" cy="40" rx="68" ry="32" fill="#ef4444"/>
          <ellipse cx="65" cy="35" rx="45" ry="18" fill="#f87171"/>
        </g>

        <!-- Sweating Superhero / Guy (Bottom Right) -->
        <g transform="translate(300, 260)">
          <!-- Red superhero suit torso -->
          <path d="M 40 220 C 60 140, 180 140, 260 220 L 280 340 L 20 340 Z" fill="#dc2626"/>
          <!-- Neck & White Helmet/cowl -->
          <circle cx="160" cy="110" r="75" fill="#f8fafc"/>
          <!-- Stressed Face -->
          <circle cx="150" cy="120" r="50" fill="#fed7aa"/>
          <!-- Wide anxious eyes with tiny pupils -->
          <ellipse cx="130" cy="115" rx="14" ry="16" fill="#ffffff" stroke="#000" stroke-width="2"/>
          <circle cx="133" cy="115" r="4" fill="#000000"/>
          <ellipse cx="170" cy="115" rx="14" ry="16" fill="#ffffff" stroke="#000" stroke-width="2"/>
          <circle cx="167" cy="115" r="4" fill="#000000"/>
          <!-- Trembling mouth -->
          <path d="M 130 150 Q 140 145 150 150 Q 160 145 170 150" stroke="#7f1d1d" stroke-width="3" fill="none"/>
          <!-- Hand holding white towel/tissue to forehead -->
          <ellipse cx="80" cy="65" rx="40" ry="25" fill="#ffffff" transform="rotate(-30 80 65)"/>
          <rect x="70" y="80" width="35" height="60" rx="15" fill="#fed7aa" transform="rotate(-20 70 80)"/>
          <!-- Giant Sweat Droplets falling! -->
          <path d="M 195 90 C 190 105, 205 105, 200 90 Z" fill="#38bdf8"/>
          <path d="M 110 85 C 105 100, 120 100, 115 85 Z" fill="#38bdf8"/>
          <path d="M 215 130 C 210 145, 225 145, 220 130 Z" fill="#38bdf8"/>
          <path d="M 100 135 C 95 150, 110 150, 105 135 Z" fill="#38bdf8"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'woman-yelling-at-cat',
    title: 'Woman Yelling at Cat',
    category: 'reaction',
    description: 'Angry distraught woman screaming and pointing on the left, smug white cat sitting at dinner on the right.',
    defaultTopText: 'YOU CANNOT JUST VIBE CODE WITHOUT WRITING TESTS',
    defaultBottomText: 'npm run dev -- --force',
    defaultLayout: 'classic',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 450" width="900" height="450">
        <!-- Split Panel -->
        <rect width="448" height="450" fill="#3b0764"/>
        <rect x="452" width="448" height="450" fill="#1e293b"/>
        <line x1="450" y1="0" x2="450" y2="450" stroke="#000000" stroke-width="4"/>

        <!-- Left: Screaming Blonde Woman -->
        <g transform="translate(60, 60)">
          <!-- Friend comforting behind -->
          <circle cx="280" cy="110" r="45" fill="#fed7aa"/>
          <path d="M 240 70 C 280 40, 330 60, 320 130 Z" fill="#451a03"/>
          <!-- Blonde Screaming Woman -->
          <circle cx="160" cy="110" r="55" fill="#fed7aa"/>
          <path d="M 95 80 C 100 0, 220 10, 225 80 C 240 180, 100 180, 95 80 Z" fill="#fde047"/>
          <!-- Teary angry crying eyes -->
          <ellipse cx="140" cy="100" rx="10" ry="8" fill="#ffffff"/>
          <circle cx="142" cy="100" r="4" fill="#1e3a8a"/>
          <ellipse cx="180" cy="100" rx="10" ry="8" fill="#ffffff"/>
          <circle cx="178" cy="100" r="4" fill="#1e3a8a"/>
          <!-- Open screaming mouth -->
          <ellipse cx="160" cy="135" rx="22" ry="16" fill="#881337"/>
          <!-- Pointing Finger Hand shaking across towards cat -->
          <path d="M 240 180 L 370 170 L 370 190 L 240 210 Z" fill="#fed7aa"/>
          <circle cx="375" cy="180" r="12" fill="#fed7aa"/>
        </g>

        <!-- Right: Smudge the White Cat sitting at dinner table with salad -->
        <g transform="translate(480, 50)">
          <!-- Restaurant booth back -->
          <rect x="30" y="40" width="350" height="200" rx="20" fill="#334155"/>
          <!-- White Cat body -->
          <ellipse cx="200" cy="200" rx="90" ry="70" fill="#f8fafc"/>
          <!-- Cat Head with confused/smug squint -->
          <circle cx="200" cy="130" r="60" fill="#ffffff"/>
          <!-- Pointy Ears -->
          <polygon points="150,100 130,40 180,75" fill="#ffffff"/>
          <polygon points="152,95 138,55 174,78" fill="#fbcfe8"/>
          <polygon points="250,100 270,40 220,75" fill="#ffffff"/>
          <polygon points="248,95 262,55 226,78" fill="#fbcfe8"/>
          <!-- Cat Eyes (confused smug squint) -->
          <ellipse cx="180" cy="125" rx="8" ry="12" fill="#fbbf24"/>
          <ellipse cx="180" cy="125" rx="2" ry="10" fill="#000000"/>
          <ellipse cx="220" cy="125" rx="8" ry="12" fill="#fbbf24"/>
          <ellipse cx="220" cy="125" rx="2" ry="10" fill="#000000"/>
          <!-- Pink nose & whiskers -->
          <polygon points="196,142 204,142 200,147" fill="#f43f5e"/>
          <line x1="160" y1="145" x2="130" y2="140" stroke="#94a3b8" stroke-width="2"/>
          <line x1="160" y1="150" x2="130" y2="155" stroke="#94a3b8" stroke-width="2"/>
          <line x1="240" y1="145" x2="270" y2="140" stroke="#94a3b8" stroke-width="2"/>
          <line x1="240" y1="150" x2="270" y2="155" stroke="#94a3b8" stroke-width="2"/>
          <!-- Dinner Plate with vegetables/salad in front -->
          <ellipse cx="200" cy="280" rx="140" ry="40" fill="#e2e8f0"/>
          <ellipse cx="200" cy="275" rx="100" ry="25" fill="#22c55e"/>
          <circle cx="170" cy="270" r="15" fill="#84cc16"/>
          <circle cx="230" cy="272" r="18" fill="#15803d"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'this-is-fine',
    title: 'This Is Fine',
    category: 'trending',
    description: 'Dog wearing hat calmly sitting at a table sipping coffee while the whole room burns in flames.',
    defaultTopText: 'THIS IS FINE',
    defaultBottomText: 'EVERYTHING IS UNDER CONTROL',
    defaultLayout: 'classic',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <!-- Room engulfed in orange & red flames -->
        <rect width="800" height="600" fill="#ea580c"/>
        <!-- Background Flames shapes -->
        <path d="M 0 600 L 0 200 Q 100 100 150 280 Q 250 50 350 250 Q 450 30 550 240 Q 650 60 720 220 Q 770 100 800 200 L 800 600 Z" fill="#f97316"/>
        <path d="M 0 600 L 0 350 Q 80 180 180 340 Q 280 120 400 320 Q 520 160 620 330 Q 700 190 800 320 L 800 600 Z" fill="#facc15"/>
        
        <!-- Floor & table -->
        <rect y="460" width="800" height="140" fill="#78350f"/>
        <rect x="420" y="380" width="220" height="180" fill="#a16207" rx="10"/>

        <!-- Coffee Mug on table -->
        <rect x="460" y="340" width="45" height="45" rx="6" fill="#ffffff"/>
        <path d="M 505 350 Q 520 362 505 375" stroke="#ffffff" stroke-width="5" fill="none"/>
        <path d="M 470 330 Q 480 320 475 310" stroke="#f1f5f9" stroke-width="3" fill="none" opacity="0.6"/>

        <!-- The Dog Character sitting on chair -->
        <g transform="translate(200, 240)">
          <!-- Torso -->
          <rect x="80" y="100" width="80" height="140" rx="30" fill="#d97706"/>
          <!-- Dog head -->
          <circle cx="120" cy="70" r="55" fill="#d97706"/>
          <ellipse cx="145" cy="85" rx="35" ry="25" fill="#f59e0b"/>
          <!-- Long floppy hound ears -->
          <path d="M 75 50 Q 45 100 65 140" stroke="#b45309" stroke-width="26" stroke-linecap="round" fill="none"/>
          <!-- Little Bowler Hat -->
          <ellipse cx="120" cy="22" rx="36" ry="10" fill="#1c1917"/>
          <rect x="98" y="0" width="44" height="24" rx="10" fill="#1c1917"/>
          <!-- Calm blissful / dissociation eyes -->
          <circle cx="115" cy="65" r="12" fill="#ffffff" stroke="#000" stroke-width="3"/>
          <circle cx="117" cy="65" r="5" fill="#000000"/>
          <circle cx="150" cy="65" r="12" fill="#ffffff" stroke="#000" stroke-width="3"/>
          <circle cx="152" cy="65" r="5" fill="#000000"/>
          <!-- Innocent calm smile -->
          <path d="M 140 90 Q 155 105 170 90" stroke="#000000" stroke-width="4" fill="none" stroke-linecap="round"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'roll-safe-think',
    title: 'Roll Safe (Think About It)',
    category: 'classic',
    description: 'Man tapping finger to temple with a sly, knowing smile suggesting flawed logic.',
    defaultTopText: 'YOU CANNOT HAVE BUGS IN PRODUCTION',
    defaultBottomText: 'IF YOU NEVER DEPLOY TO PRODUCTION',
    defaultLayout: 'classic',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <!-- Dark ambient gradient -->
        <rect width="800" height="600" fill="#18181b"/>
        <circle cx="450" cy="250" r="280" fill="#27272a"/>
        
        <!-- Character Figure -->
        <g transform="translate(180, 80)">
          <!-- Leather jacket -->
          <path d="M 80 260 C 90 200, 200 170, 320 220 L 360 480 L 40 480 Z" fill="#09090b"/>
          <path d="M 170 230 L 220 340 L 250 230 Z" fill="#d4d4d8"/>
          <!-- Head tilted forward -->
          <circle cx="210" cy="150" r="75" fill="#854d0e"/>
          <!-- Hairline -->
          <path d="M 140 140 C 145 80, 265 80, 275 140 Z" fill="#171717"/>
          <!-- Knowing sly smirk eyes -->
          <path d="M 175 140 Q 190 130 205 140" stroke="#171717" stroke-width="5" fill="none" stroke-linecap="round"/>
          <circle cx="190" cy="142" r="4" fill="#000000"/>
          <!-- Knowing smirk mouth -->
          <path d="M 170 180 Q 200 205 235 175" stroke="#171717" stroke-width="5" fill="none" stroke-linecap="round"/>
          <!-- Hand with index finger tapping temple -->
          <rect x="80" y="160" width="70" height="35" rx="15" transform="rotate(35 80 160)" fill="#854d0e"/>
          <rect x="120" y="140" width="60" height="20" rx="8" transform="rotate(-15 120 140)" fill="#854d0e"/>
          <!-- Sparkle of "genius" logic near temple -->
          <polygon points="120,95 125,108 138,110 127,120 130,133 120,123 109,132 113,119 102,109 115,108" fill="#facc15"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'buff-doge-vs-cheems',
    title: 'Buff Doge vs Cheems',
    category: 'trending',
    description: 'Gigachad muscular Doge in 1990/past vs whimpering crying Cheems today.',
    defaultTopText: 'SENIOR DEVS IN 1995: BUILT 3D ENGINE IN ASSEMBLY',
    defaultBottomText: 'ME IN 2026: CANNOT CENTER A DIV WITHOUT AI',
    defaultLayout: 'classic',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500">
        <!-- Arena Floor & Split Background -->
        <rect width="900" height="500" fill="#f1f5f9"/>
        <rect y="380" width="900" height="120" fill="#cbd5e1"/>
        <line x1="450" y1="40" x2="450" y2="460" stroke="#94a3b8" stroke-dasharray="8 8" stroke-width="3"/>

        <!-- Left: Gigantic Buff Doge -->
        <g transform="translate(80, 40)">
          <!-- Enormous Bodybuilding Torso & Abs -->
          <path d="M 80 200 C 60 140, 260 140, 240 200 L 220 380 L 100 380 Z" fill="#d97706"/>
          <!-- Huge Pecs & 8-pack lines -->
          <ellipse cx="120" cy="220" rx="45" ry="35" fill="#f59e0b"/>
          <ellipse cx="200" cy="220" rx="45" ry="35" fill="#f59e0b"/>
          <line x1="160" y1="180" x2="160" y2="360" stroke="#b45309" stroke-width="4"/>
          <!-- Massive Biceps left & right -->
          <circle cx="50" cy="240" r="45" fill="#d97706"/>
          <circle cx="270" cy="240" r="45" fill="#d97706"/>
          <!-- Doge head perched atop muscular shoulders -->
          <circle cx="160" cy="100" r="48" fill="#f59e0b"/>
          <polygon points="120,70 135,30 150,65" fill="#d97706"/>
          <polygon points="170,65 185,30 200,70" fill="#d97706"/>
          <!-- Iconic Doge eyebrows & sharp confident stare -->
          <ellipse cx="145" cy="95" rx="8" ry="6" fill="#000000"/>
          <ellipse cx="175" cy="95" rx="8" ry="6" fill="#000000"/>
          <ellipse cx="160" cy="115" rx="16" ry="10" fill="#fef3c7"/>
          <circle cx="160" cy="110" r="5" fill="#000000"/>
        </g>

        <!-- Right: Small Crying Round Cheems -->
        <g transform="translate(560, 220)">
          <!-- Chubby round potato dog body -->
          <ellipse cx="160" cy="160" rx="90" ry="70" fill="#f59e0b"/>
          <ellipse cx="110" cy="130" rx="45" ry="40" fill="#fed7aa"/>
          <!-- Floppy sad ears -->
          <ellipse cx="75" cy="100" rx="15" ry="25" fill="#d97706" transform="rotate(-20 75 100)"/>
          <ellipse cx="135" cy="95" rx="15" ry="22" fill="#d97706" transform="rotate(20 135 95)"/>
          <!-- Crying sad squint eyes with waterfalls of tears -->
          <path d="M 95 125 Q 105 120 115 125" stroke="#78350f" stroke-width="3" fill="none"/>
          <path d="M 80 130 C 70 170, 95 190, 85 220" stroke="#38bdf8" stroke-width="4" fill="none"/>
          <path d="M 125 130 C 135 170, 110 190, 120 220" stroke="#38bdf8" stroke-width="4" fill="none"/>
          <!-- Sad trembly chin -->
          <ellipse cx="105" cy="145" rx="8" ry="5" fill="#000000"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'change-my-mind',
    title: 'Change My Mind',
    category: 'classic',
    description: 'Steven Crowder seated at park table with banner sign challenging anyone to change his mind.',
    defaultTopText: 'VIBE CODING IS JUST EXTREME PROGRAMMING',
    defaultBottomText: 'CHANGE MY MIND',
    defaultLayout: 'banner',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="800" height="550">
        <!-- Park lawn & trees -->
        <rect width="800" height="550" fill="#86efac"/>
        <rect y="0" width="800" height="280" fill="#bbf7d0"/>
        <ellipse cx="120" cy="150" rx="90" ry="110" fill="#15803d" opacity="0.4"/>
        <ellipse cx="700" cy="160" rx="100" ry="120" fill="#15803d" opacity="0.4"/>

        <!-- Guy in Winter Coat sitting at table -->
        <g transform="translate(320, 120)">
          <circle cx="80" cy="65" r="45" fill="#fed7aa"/>
          <path d="M 45 45 C 55 10, 110 10, 115 45 Z" fill="#451a03"/>
          <rect x="35" y="100" width="90" height="120" rx="20" fill="#1e3a8a"/>
          <!-- Smug stubborn smile -->
          <circle cx="70" cy="60" r="5" fill="#000000"/>
          <circle cx="95" cy="60" r="5" fill="#000000"/>
          <path d="M 70 85 Q 82 95 95 85" stroke="#000000" stroke-width="3" fill="none"/>
        </g>

        <!-- White Foldable Table -->
        <polygon points="120,290 680,290 640,490 160,490" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
        <!-- Table Legs -->
        <line x1="160" y1="490" x2="140" y2="530" stroke="#475569" stroke-width="10"/>
        <line x1="640" y1="490" x2="660" y2="530" stroke="#475569" stroke-width="10"/>

        <!-- Coffee Mug on Table -->
        <rect x="520" y="240" width="45" height="50" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
        <path d="M 565 250 Q 585 265 565 280" stroke="#94a3b8" stroke-width="5" fill="none"/>

        <!-- White Sign on front of table: "CHANGE MY MIND" -->
        <rect x="180" y="320" width="440" height="130" fill="#f8fafc" stroke="#334155" stroke-width="3" rx="4"/>
        <text x="400" y="390" font-family="Impact, sans-serif" font-size="34" font-weight="bold" fill="#0f172a" text-anchor="middle">CHANGE MY MIND</text>
      </svg>
    `),
  },
  {
    id: 'disaster-girl',
    title: 'Disaster Girl',
    category: 'reaction',
    description: 'Little girl staring slyly into camera while firefighters extinguish a burning house behind her.',
    defaultTopText: 'DELETING THE UNUSED S3 BUCKET',
    defaultBottomText: 'IT WAS NOT UNUSED',
    defaultLayout: 'classic',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <!-- Night / Smoky Street -->
        <rect width="800" height="600" fill="#18181b"/>
        <!-- Burning House in Background -->
        <polygon points="100,280 280,140 460,280" fill="#7f1d1d"/>
        <rect x="130" y="280" width="300" height="180" fill="#991b1b"/>
        <!-- Fire leaping out of windows -->
        <rect x="170" y="310" width="60" height="70" fill="#ea580c"/>
        <path d="M 160 380 Q 200 240 240 380 Z" fill="#facc15"/>
        <rect x="330" y="310" width="60" height="70" fill="#ea580c"/>
        <path d="M 320 380 Q 360 220 400 380 Z" fill="#facc15"/>
        <!-- Fire engine flashing blue & red lights -->
        <rect x="20" y="400" width="160" height="90" fill="#dc2626" rx="10"/>
        <circle cx="50" cy="390" r="14" fill="#38bdf8"/>
        <circle cx="120" cy="390" r="14" fill="#ef4444"/>

        <!-- Foreground: Little Girl with sly, devious smirk looking at camera -->
        <g transform="translate(460, 200)">
          <!-- Face close up -->
          <ellipse cx="160" cy="200" rx="140" ry="160" fill="#fed7aa"/>
          <!-- Brown bangs & hair framing face -->
          <path d="M 30 180 C 40 40, 280 40, 290 180 C 260 90, 60 90, 30 180 Z" fill="#78350f"/>
          <!-- Sly eyes looking slightly side-eye at camera -->
          <ellipse cx="115" cy="190" rx="18" ry="14" fill="#ffffff"/>
          <circle cx="122" cy="190" r="8" fill="#451a03"/>
          <ellipse cx="205" cy="190" rx="18" ry="14" fill="#ffffff"/>
          <circle cx="212" cy="190" r="8" fill="#451a03"/>
          <!-- Devious subtle smirk smile -->
          <path d="M 120 270 Q 165 310 220 260" stroke="#7f1d1d" stroke-width="6" stroke-linecap="round" fill="none"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'expanding-brain',
    title: 'Expanding / Galaxy Brain',
    category: 'tech',
    description: '4-level progression of intellect from small brain to cosmic transcendence.',
    defaultTopText: 'PLAIN JAVASCRIPT -> TYPESCRIPT -> RUST -> BASH SCRIPT IN CRON',
    defaultBottomText: 'UNLIMITED POWER',
    defaultLayout: 'banner',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#09090b"/>
        <!-- Level 1: Tiny Dull Brain -->
        <rect x="0" y="0" width="380" height="198" fill="#18181b"/>
        <rect x="384" y="0" width="416" height="198" fill="#27272a"/>
        <circle cx="590" cy="100" r="45" fill="#f43f5e" opacity="0.6"/>

        <!-- Level 2: Glowing Brain -->
        <rect x="0" y="202" width="380" height="198" fill="#18181b"/>
        <rect x="384" y="202" width="416" height="198" fill="#27272a"/>
        <circle cx="590" cy="300" r="55" fill="#38bdf8"/>
        <path d="M 540 300 Q 590 240 640 300" stroke="#ffffff" stroke-width="4" fill="none"/>

        <!-- Level 3: Cosmic Rays Brain -->
        <rect x="0" y="404" width="380" height="198" fill="#18181b"/>
        <rect x="384" y="404" width="416" height="198" fill="#1e1b4b"/>
        <circle cx="590" cy="500" r="65" fill="#818cf8"/>
        <line x1="590" y1="420" x2="590" y2="390" stroke="#facc15" stroke-width="4"/>
        <line x1="510" y1="500" x2="480" y2="500" stroke="#facc15" stroke-width="4"/>
        <line x1="670" y1="500" x2="700" y2="500" stroke="#facc15" stroke-width="4"/>

        <!-- Level 4: Pure Energy Transcendent Galaxy Brain -->
        <rect x="0" y="606" width="380" height="194" fill="#18181b"/>
        <rect x="384" y="606" width="416" height="194" fill="#020617"/>
        <circle cx="590" cy="700" r="80" fill="#ec4899" filter="blur(10px)"/>
        <circle cx="590" cy="700" r="50" fill="#ffffff"/>
        <!-- Beams & lightning -->
        <line x1="590" y1="620" x2="590" y2="780" stroke="#38bdf8" stroke-width="6"/>
        <line x1="510" y1="700" x2="670" y2="700" stroke="#38bdf8" stroke-width="6"/>

        <line x1="0" y1="200" x2="800" y2="200" stroke="#000" stroke-width="4"/>
        <line x1="0" y1="402" x2="800" y2="402" stroke="#000" stroke-width="4"/>
        <line x1="0" y1="604" x2="800" y2="604" stroke="#000" stroke-width="4"/>
        <line x1="382" y1="0" x2="382" y2="800" stroke="#000" stroke-width="4"/>
      </svg>
    `),
  },
];
