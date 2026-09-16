        const mascotDatabase = [
            { 
                id: 'm-bunny', 
                name: 'Bunny', 
                tier: 1, 
                unlockSec: 0, 
                shapes: '14 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><g id="bunny"><ellipse cx="250" cy="435" rx="95" ry="16" fill="#000" opacity="0.2"/><circle cx="325" cy="375" r="24" fill="#FFE4E6" stroke="#3D2C2E" stroke-width="4"/><ellipse cx="185" cy="418" rx="28" ry="16" fill="#FFB6C1" stroke="#3D2C2E" stroke-width="4"/><ellipse cx="315" cy="418" rx="28" ry="16" fill="#FFB6C1" stroke="#3D2C2E" stroke-width="4"/><path d="M 175 295 C 140 335, 140 418, 250 418 C 360 418, 360 335, 325 295 C 300 265, 200 265, 175 295 Z" fill="#FFB6C1" stroke="#3D2C2E" stroke-width="5"/><ellipse cx="250" cy="355" rx="52" ry="40" fill="#FFE4E6"/><path d="M 195 225 C 140 115, 200 75, 215 215 Z" fill="#FFB6C1" stroke="#3D2C2E" stroke-width="5"/><path d="M 190 205 C 160 125, 195 95, 205 195 Z" fill="#FF6B8B"/><path d="M 305 225 C 360 115, 300 75, 285 215 Z" fill="#FFB6C1" stroke="#3D2C2E" stroke-width="5"/><path d="M 310 205 C 340 125, 305 95, 295 195 Z" fill="#FF6B8B"/><circle cx="250" cy="250" r="68" fill="#FFB6C1" stroke="#3D2C2E" stroke-width="5"/><circle cx="202" cy="265" r="12" fill="#FF6B8B" opacity="0.6"/><circle cx="298" cy="265" r="12" fill="#FF6B8B" opacity="0.6"/><ellipse class="rig-eye" cx="215" cy="243" rx="8" ry="12" fill="#3D2C2E"/><circle cx="213" cy="239" r="3" fill="#FFF"/><ellipse class="rig-eye" cx="285" cy="243" rx="8" ry="12" fill="#3D2C2E"/><circle cx="283" cy="239" r="3" fill="#FFF"/><polygon points="250,253 245,258 255,258" fill="#FF6B8B"/></g></svg>` 
            },
            { 
                id: 'm-mouse', 
                name: 'Pebble Mouse', 
                tier: 1, 
                unlockSec: 0, 
                shapes: '18 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><g id="mouse"><ellipse cx="250" cy="430" rx="90" ry="14" fill="#000" opacity="0.2"/><path d="M 250 360 C 210 360, 150 420, 130 420" fill="none" stroke="#94A3B8" stroke-width="8" stroke-linecap="round"/><ellipse cx="195" cy="415" rx="20" ry="12" fill="#CBD5E1"/><ellipse cx="305" cy="415" rx="20" ry="12" fill="#CBD5E1"/><ellipse cx="250" cy="335" rx="85" ry="75" fill="#CBD5E1"/><ellipse cx="250" cy="345" rx="52" ry="44" fill="#F1F5F9"/><g><circle cx="170" cy="165" r="55" fill="#CBD5E1"/><circle cx="170" cy="165" r="35" fill="#F472B6"/></g><g><circle cx="330" cy="165" r="55" fill="#CBD5E1"/><circle cx="330" cy="165" r="35" fill="#F472B6"/></g><circle cx="250" cy="230" r="60" fill="#CBD5E1"/><circle class="rig-eye" cx="218" cy="222" r="9" fill="#1E293B"/><circle class="rig-eye" cx="282" cy="222" r="9" fill="#1E293B"/><rect x="243" y="249" width="6" height="10" rx="1" fill="#FFF" stroke="#94A3B8" stroke-width="1"/><rect x="251" y="249" width="6" height="10" rx="1" fill="#FFF" stroke="#94A3B8" stroke-width="1"/><ellipse cx="250" cy="242" rx="10" ry="7" fill="#F472B6"/><polygon points="295,320 355,300 345,360" fill="#FBBF24"/><circle cx="320" cy="325" r="5" fill="#D97706"/><circle cx="338" cy="328" r="6" fill="#D97706"/><circle cx="312" cy="340" r="4" fill="#D97706"/><circle cx="332" cy="312" r="3" fill="#D97706"/><circle cx="346" cy="348" r="4.5" fill="#D97706"/></g></svg>` 
            },
            { 
                id: 'm-chick', 
                name: 'Micro Chick', 
                tier: 1, 
                unlockSec: 0, 
                shapes: '16 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><g id="chick"><ellipse cx="250" cy="420" rx="70" ry="14" fill="#000" opacity="0.2"/><ellipse cx="210" cy="410" rx="15" ry="8" fill="#F97316"/><ellipse cx="290" cy="410" rx="15" ry="8" fill="#F97316"/><path d="M 240 160 Q 250 120 250 140 Q 260 110 265 155 Z" fill="#FACC15"/><circle cx="250" cy="280" r="110" fill="#FACC15"/><path d="M 140 280 Q 110 290 145 320 Z" fill="#EAB308"/><path d="M 360 280 Q 390 290 355 320 Z" fill="#EAB308"/><circle class="rig-eye" cx="205" cy="260" r="11" fill="#1E293B"/><circle cx="202" cy="256" r="4" fill="#FFF"/><circle class="rig-eye" cx="295" cy="260" r="11" fill="#1E293B"/><circle cx="292" cy="256" r="4" fill="#FFF"/><polygon points="235,275 265,275 250,300" fill="#F97316"/><circle cx="180" cy="290" r="14" fill="#F87171" opacity="0.5"/><circle cx="320" cy="290" r="14" fill="#F87171" opacity="0.5"/></g></svg>` 
            },
            { 
                id: 'm-penguin', 
                name: 'Puff Penguin', 
                tier: 1, 
                unlockSec: 600, 
                shapes: '16 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><g id="penguin"><ellipse cx="250" cy="430" rx="85" ry="15" fill="#000" opacity="0.2"/><ellipse cx="200" cy="420" rx="22" ry="10" fill="#FB923C"/><ellipse cx="300" cy="420" rx="22" ry="10" fill="#FB923C"/><ellipse cx="250" cy="280" rx="100" ry="130" fill="#1E293B"/><ellipse cx="250" cy="300" rx="65" ry="95" fill="#F8FAFC"/><path d="M 150 260 C 120 290, 130 350, 155 330 Z" fill="#0F172A"/><path d="M 350 260 C 380 290, 370 350, 345 330 Z" fill="#0F172A"/><circle class="rig-eye" cx="222" cy="230" r="10" fill="#0F172A"/><circle cx="219" cy="226" r="3" fill="#FFF"/><circle class="rig-eye" cx="278" cy="230" r="10" fill="#0F172A"/><circle cx="275" cy="226" r="3" fill="#FFF"/><polygon points="238,245 262,245 250,265" fill="#FB923C"/><circle cx="200" cy="255" r="11" fill="#F472B6" opacity="0.6"/><circle cx="300" cy="255" r="11" fill="#F472B6" opacity="0.6"/></g></svg>` 
            },
            { 
                id: 'm-bear', 
                name: 'Cubey Bear', 
                tier: 1, 
                unlockSec: 1200, 
                shapes: '18 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><g id="bear"><ellipse cx="250" cy="430" rx="90" ry="16" fill="#000" opacity="0.2"/><ellipse cx="200" cy="415" rx="22" ry="14" fill="#B45309"/><ellipse cx="300" cy="415" rx="22" ry="14" fill="#B45309"/><g><circle cx="170" cy="160" r="35" fill="#B45309"/><circle cx="170" cy="160" r="20" fill="#FDE68A"/></g><g><circle cx="330" cy="160" r="35" fill="#B45309"/><circle cx="330" cy="160" r="20" fill="#FDE68A"/></g><ellipse cx="250" cy="330" rx="80" ry="75" fill="#B45309"/><ellipse cx="165" cy="325" rx="20" ry="34" fill="#B45309" transform="rotate(15 165 325)"/><ellipse cx="335" cy="325" rx="20" ry="34" fill="#B45309" transform="rotate(-15 335 325)"/><ellipse cx="250" cy="335" rx="50" ry="45" fill="#FDE68A"/><circle cx="250" cy="230" r="80" fill="#B45309"/><ellipse cx="250" cy="245" rx="32" ry="24" fill="#FDE68A"/><ellipse cx="250" cy="238" rx="10" ry="7" fill="#451A03"/><circle class="rig-eye" cx="205" cy="210" r="9" fill="#451A03"/><circle class="rig-eye" cx="295" cy="210" r="9" fill="#451A03"/><path d="M 242 252 Q 250 258 258 252" fill="none" stroke="#451A03" stroke-width="3" stroke-linecap="round"/></g></svg>` 
            },
            { 
                id: 'm-frog', 
                name: 'Mini Frog', 
                tier: 1, 
                unlockSec: 3600, 
                shapes: '18 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><g id="frog"><ellipse cx="250" cy="440" rx="135" ry="18" fill="#000" opacity="0.2"/><ellipse cx="130" cy="380" rx="48" ry="34" fill="#16A34A" transform="rotate(-15 130 380)"/><ellipse cx="370" cy="380" rx="48" ry="34" fill="#16A34A" transform="rotate(15 370 380)"/><path d="M 90 435 Q 110 405 130 425 Q 150 405 170 425 Q 185 410 195 435 Z" fill="#16A34A"/><path d="M 305 435 Q 315 410 330 425 Q 350 405 370 425 Q 390 405 410 435 Z" fill="#16A34A"/><ellipse cx="250" cy="345" rx="120" ry="85" fill="#22C55E"/><ellipse cx="250" cy="355" rx="80" ry="58" fill="#BBF7D0"/><circle cx="180" cy="180" r="36" fill="#22C55E"/><circle cx="320" cy="180" r="36" fill="#22C55E"/><ellipse cx="250" cy="245" rx="95" ry="60" fill="#22C55E"/><circle cx="180" cy="180" r="22" fill="#FFF"/><circle class="rig-eye" cx="180" cy="180" r="11" fill="#14532D"/><circle cx="320" cy="180" r="22" fill="#FFF"/><circle class="rig-eye" cx="320" cy="180" r="11" fill="#14532D"/><path d="M 180 255 Q 250 295 320 255" fill="none" stroke="#14532D" stroke-width="5" stroke-linecap="round"/><circle cx="170" cy="260" r="12" fill="#F472B6" opacity="0.6"/><circle cx="330" cy="260" r="12" fill="#F472B6" opacity="0.6"/></g></svg>` 
            },
            { 
                id: 'm-shiba', 
                name: 'Shiba Pup', 
                tier: 2, 
                unlockSec: 7200, 
                shapes: '25 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-lg" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><g id="shiba"><ellipse cx="250" cy="435" rx="90" ry="15" fill="#000" opacity="0.2"/><path d="M 175 330 C 135 310, 135 240, 180 250 C 192 255, 185 300, 170 325 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="3.5"/><path d="M 170 138 C 180 80, 220 90, 218 122 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="3.5"/><path d="M 176 134 C 184 86, 214 94, 212 120 Z" fill="#FEF08A"/><path d="M 330 138 C 320 80, 280 90, 282 122 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="3.5"/><path d="M 324 134 C 316 86, 286 94, 288 120 Z" fill="#FEF08A"/><ellipse cx="250" cy="335" rx="80" ry="65" fill="#EAB308"/><ellipse cx="250" cy="345" rx="52" ry="48" fill="#FEF08A"/><ellipse cx="220" cy="332" rx="13" ry="10" fill="#FEF08A" stroke="#CA8A04" stroke-width="2"/><ellipse cx="280" cy="332" rx="13" ry="10" fill="#FEF08A" stroke="#CA8A04" stroke-width="2"/><ellipse cx="190" cy="405" rx="22" ry="16" fill="#FEF08A" stroke="#CA8A04" stroke-width="3"/><ellipse cx="310" cy="405" rx="22" ry="16" fill="#FEF08A" stroke="#CA8A04" stroke-width="3"/><circle cx="250" cy="190" r="85" fill="#EAB308"/><ellipse cx="250" cy="215" rx="44" ry="28" fill="#FEF08A"/><circle class="rig-eye" cx="205" cy="185" r="12" fill="#451A03"/><circle cx="201" cy="180" r="5" fill="#FFF"/><circle cx="208" cy="190" r="2.5" fill="#FFF"/><circle class="rig-eye" cx="295" cy="185" r="12" fill="#451A03"/><circle cx="291" cy="180" r="5" fill="#FFF"/><circle cx="298" cy="190" r="2.5" fill="#FFF"/><circle cx="200" cy="158" r="7" fill="#FEF08A"/><circle cx="300" cy="158" r="7" fill="#FEF08A"/><ellipse cx="250" cy="208" rx="10" ry="7" fill="#451A03"/><path d="M 242 219 Q 250 225 258 219" fill="none" stroke="#451A03" stroke-width="3" stroke-linecap="round"/><circle cx="185" cy="202" r="10" fill="#F472B6" opacity="0.4"/><circle cx="315" cy="202" r="10" fill="#F472B6" opacity="0.4"/><path d="M 210 270 Q 250 282 290 270" fill="none" stroke="#DC2626" stroke-width="7" stroke-linecap="round"/><circle cx="250" cy="278" r="7" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/><circle cx="250" cy="279" r="1.8" fill="#78350F"/></g></svg>` 
            },
            { 
                id: 'm-cat', 
                name: 'Boba Cat', 
                tier: 2, 
                unlockSec: 14400, 
                shapes: '26 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="teaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E8C59C" /><stop offset="100%" stop-color="#C68B59" /></linearGradient><linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="rgba(255,255,255,0.6)" /><stop offset="25%" stop-color="rgba(255,255,255,0.1)" /><stop offset="75%" stop-color="rgba(255,255,255,0.1)" /><stop offset="100%" stop-color="rgba(255,255,255,0.4)" /></linearGradient></defs><circle cx="250" cy="250" r="220" fill="#FFF8F0" /><path d="M 310 360 C 400 370, 430 290, 370 270 C 340 260, 350 310, 310 330 Z" fill="#F4A261" stroke="#2B2D42" stroke-width="4" stroke-linejoin="round" /><path d="M 160 310 C 140 430, 360 430, 340 310 C 310 280, 190 280, 160 310 Z" fill="#FFE5B4" stroke="#2B2D42" stroke-width="4" stroke-linejoin="round" /><ellipse cx="250" cy="370" rx="55" ry="40" fill="#FFFFFF" opacity="0.6" /><path d="M 135 210 Q 130 95 210 145 Z" fill="#F4A261" stroke="#2B2D42" stroke-width="4" stroke-linejoin="round" /><path d="M 365 210 Q 370 95 290 145 Z" fill="#F4A261" stroke="#2B2D42" stroke-width="4" stroke-linejoin="round" /><path d="M 150 195 Q 148 125 195 155 Z" fill="#FFB6C1" /><path d="M 350 195 Q 352 125 305 155 Z" fill="#FFB6C1" /><ellipse cx="250" cy="210" rx="120" ry="95" fill="#FFE5B4" stroke="#2B2D42" stroke-width="4" /><path d="M 235 118 Q 250 135 265 118 Q 258 150 250 142 Q 242 150 235 118 Z" fill="#F4A261" /><path class="rig-eye" d="M 180 200 Q 200 215 220 200" fill="none" stroke="#2B2D42" stroke-width="5" stroke-linecap="round" /><path class="rig-eye" d="M 280 200 Q 300 215 320 200" fill="none" stroke="#2B2D42" stroke-width="5" stroke-linecap="round" /><ellipse cx="175" cy="220" rx="16" ry="10" fill="#FFB6C1" opacity="0.7" /><ellipse cx="325" cy="220" rx="16" ry="10" fill="#FFB6C1" opacity="0.7" /><polygon points="244,215 256,215 250,223" fill="#FF8FA3" /><path d="M 155 215 L 105 205 M 153 225 L 100 225 M 155 235 L 110 245" stroke="#2B2D42" stroke-width="3.5" stroke-linecap="round" /><path d="M 345 215 L 395 205 M 347 225 L 400 225 M 345 235 L 390 245" stroke="#2B2D42" stroke-width="3.5" stroke-linecap="round" /><path d="M 250 225 L 250 275 L 265 385" stroke="#FF5964" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" /><path d="M 250 225 L 250 275 L 265 385" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="8,8" stroke-linecap="round" stroke-linejoin="round" fill="none" /><path d="M 240 227 Q 250 236 260 227" fill="none" stroke="#2B2D42" stroke-width="3.5" stroke-linecap="round" /><path d="M 205 290 L 215 410 C 215 428, 285 428, 285 410 L 295 290 Z" fill="url(#teaGrad)" /><circle cx="230" cy="398" r="10" fill="#2B1704" /><circle cx="250" cy="403" r="10" fill="#3D2314" /><circle cx="270" cy="396" r="10" fill="#2B1704" /><circle cx="240" cy="385" r="9" fill="#3D2314" /><circle cx="260" cy="388" r="9.5" fill="#2B1704" /><circle cx="222" cy="382" r="8.5" fill="#2B1704" /><circle cx="278" cy="382" r="8.5" fill="#3D2314" /><circle cx="227" cy="395" r="2.5" fill="#A86B42" /><circle cx="247" cy="400" r="2.5" fill="#A86B42" /><circle cx="267" cy="393" r="2.5" fill="#A86B42" /><circle cx="237" cy="382" r="2" fill="#A86B42" /><circle cx="257" cy="385" r="2" fill="#A86B42" /><rect x="220" y="310" width="22" height="22" rx="4" fill="rgba(255,255,255,0.5)" transform="rotate(15 231 321)" /><rect x="255" y="318" width="20" height="20" rx="4" fill="rgba(255,255,255,0.4)" transform="rotate(-10 265 328)" /><path d="M 200 275 L 213 412 C 215 430, 285 430, 287 412 L 300 275 Z" fill="url(#cupGrad)" stroke="#2B2D42" stroke-width="4" stroke-linejoin="round" /><path d="M 208 285 L 217 390 Q 222 390 220 285 Z" fill="rgba(255,255,255,0.4)" /><path d="M 193 275 C 193 258, 307 258, 307 275 Z" fill="#E8ECEF" stroke="#2B2D42" stroke-width="4" /><line x1="188" y1="275" x2="312" y2="275" stroke="#2B2D42" stroke-width="4" stroke-linecap="round" /><ellipse cx="198" cy="340" rx="18" ry="14" fill="#FFE5B4" stroke="#2B2D42" stroke-width="3.5" transform="rotate(-15 198 340)" /><path d="M 190 344 Q 198 340 206 342" stroke="#2B2D42" stroke-width="2.5" fill="none" stroke-linecap="round" /><ellipse cx="302" cy="340" rx="18" ry="14" fill="#FFE5B4" stroke="#2B2D42" stroke-width="3.5" transform="rotate(15 302 340)" /><path d="M 310 344 Q 302 340 294 342" stroke="#2B2D42" stroke-width="2.5" fill="none" stroke-linecap="round" /><path d="M 120 150 Q 120 140 110 140 Q 120 140 120 130 Q 120 140 130 140 Q 120 140 120 150 Z" fill="#FFD166" /><path d="M 380 160 Q 380 150 370 150 Q 380 150 380 140 Q 380 150 390 150 Q 380 150 380 160 Z" fill="#FFD166" /><path d="M 370 240 Q 370 232 364 232 Q 370 232 370 224 Q 370 232 376 232 Q 370 232 370 240 Z" fill="#FF8FA3" /></svg>` 
            },
            { 
                id: 'm-owl', 
                name: 'Cozy Owl', 
                tier: 2, 
                unlockSec: 18000, 
                shapes: '25 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8d5b4c" /><stop offset="100%" stop-color="#5c382b" /></linearGradient><linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#faedcd" /><stop offset="100%" stop-color="#d4a373" /></linearGradient><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffd166" /><stop offset="100%" stop-color="#f4a261" /></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.12" /></filter></defs><rect width="500" height="500" fill="url(#bgGradient)" /><ellipse cx="250" cy="445" rx="160" ry="12" fill="#d4c7b0" opacity="0.8" /><g transform="translate(0, 30)"><path d="M 150 370 Q 250 350 350 370 L 370 410 Q 250 430 130 410 Z" fill="#5c4033" filter="url(#shadow)" /><path d="M 155 365 Q 250 348 345 365 L 340 380 Q 250 365 160 380 Z" fill="#fdfcf0" /><path d="M 160 380 Q 250 365 340 380 L 340 390 Q 250 375 160 390 Z" fill="#e5ded0" /></g><g filter="url(#shadow)"><ellipse cx="170" cy="280" rx="35" ry="60" fill="url(#bodyGrad)" transform="rotate(15 170 280)" /><ellipse cx="330" cy="280" rx="35" ry="60" fill="url(#bodyGrad)" transform="rotate(-15 330 280)" /><ellipse cx="250" cy="280" rx="85" ry="100" fill="url(#bodyGrad)" /><path d="M 190 260 L 210 400 L 290 400 L 310 260 Z" fill="#2b2d42" /><path d="M 210 400 L 250 390 L 290 400 Z" fill="#1d3557" /><polygon points="250,250 220,290 235,305" fill="#ffffff" /><polygon points="250,250 280,290 265,305" fill="#ffffff" /><path d="M 220 295 Q 250 285 280 295 L 290 350 Q 250 375 210 350 Z" fill="url(#bellyGrad)" /><path d="M 235 310 Q 250 318 265 310" stroke="#bc6c25" stroke-width="2.5" fill="none" stroke-linecap="round" /><path d="M 228 330 Q 250 338 272 330" stroke="#bc6c25" stroke-width="2.5" fill="none" stroke-linecap="round" /><path d="M 235 350 Q 250 358 265 350" stroke="#bc6c25" stroke-width="2.5" fill="none" stroke-linecap="round" /></g><g fill="#e76f51"><path d="M 215 375 Q 215 390 205 395 M 215 380 Q 225 395 235 395 M 215 380 Q 215 395 220 398" stroke="#e76f51" stroke-width="5" stroke-linecap="round" /><path d="M 285 375 Q 285 390 275 395 M 285 380 Q 295 395 305 395 M 285 380 Q 285 395 280 398" stroke="#e76f51" stroke-width="5" stroke-linecap="round" /></g><g filter="url(#shadow)"><path d="M 160 200 Q 150 120 250 120 Q 350 120 340 200 Q 360 240 310 260 Q 250 270 190 260 Q 140 240 160 200 Z" fill="url(#bodyGrad)" /><path d="M 170 155 L 140 85 L 200 120 Z" fill="url(#bodyGrad)" /><path d="M 330 155 L 360 85 L 300 120 Z" fill="url(#bodyGrad)" /></g><circle cx="208" cy="190" r="28" fill="#2b2d42" /><circle cx="292" cy="190" r="28" fill="#2b2d42" /><circle cx="208" cy="190" r="21" fill="#e9c46a" /><circle cx="292" cy="190" r="21" fill="#e9c46a" /><circle class="rig-eye" cx="208" cy="190" r="12" fill="#1d3557" /><circle class="rig-eye" cx="292" cy="190" r="12" fill="#1d3557" /><circle cx="201" cy="183" r="7" fill="#ffffff" /><circle cx="215" cy="197" r="2.5" fill="#ffffff" /><circle cx="285" cy="183" r="7" fill="#ffffff" /><circle cx="299" cy="197" r="2.5" fill="#ffffff" /><polygon points="250,195 238,222 262,222" fill="#f4a261" filter="url(#shadow)" /><polygon points="250,208 244,220 256,220" fill="#e76f51" /><g fill="none" stroke="#2b2d42" stroke-width="3.5"><circle cx="208" cy="190" r="32" /><circle cx="292" cy="190" r="32" /><path d="M 240 186 L 260 186" /><path d="M 176 186 L 155 178" /><path d="M 324 186 L 345 178" /></g><g transform="translate(250, 268)" filter="url(#shadow)"><polygon points="0,0 -26,-13 -26,13" fill="#1d3557" /><polygon points="0,0 26,-13 26,13" fill="#1d3557" /><circle cx="0" cy="0" r="7" fill="#e9c46a" /></g><g filter="url(#shadow)"><polygon points="250,55 375,95 250,135 125,95" fill="#1d3557" /><polygon points="250,60 365,95 250,130 135,95" fill="#2b2d42" /><path d="M 190 95 L 190 120 Q 250 135 310 120 L 310 95 Z" fill="#1d3557" /><path d="M 250 95 Q 280 80 325 110 L 330 145" fill="none" stroke="url(#goldGrad)" stroke-width="3.5" stroke-linecap="round" /><circle cx="330" cy="147" r="5" fill="#f4a261" /></g><g transform="translate(145, 305) rotate(25)" filter="url(#shadow)"><rect x="0" y="0" width="45" height="15" rx="3" fill="#fefae0" stroke="#dda15e" stroke-width="1.5" /><line x1="15" y1="0" x2="15" y2="15" stroke="#bc6c25" stroke-width="3" /></g></svg>` 
            },
            { 
                id: 'm-panda', 
                name: 'Red Panda', 
                tier: 2, 
                unlockSec: 21600, 
                shapes: '25 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="bgGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f4f9f4" /><stop offset="100%" stop-color="#e2efe0" /></radialGradient><linearGradient id="redFur" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e65100" /><stop offset="50%" stop-color="#d84315" /><stop offset="100%" stop-color="#bf360c" /></linearGradient><linearGradient id="darkFur" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#4a2e2a" /><stop offset="100%" stop-color="#2a1816" /></linearGradient><linearGradient id="pawsFur" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1f1817" /><stop offset="100%" stop-color="#090606" /></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#1b0000" flood-opacity="0.12" /></filter></defs><circle cx="250" cy="250" r="230" fill="url(#bgGrad)" /><ellipse cx="250" cy="425" rx="140" ry="16" fill="#c2d8c1" opacity="0.7" /><g filter="url(#shadow)"><path d="M 250 380 C 320 400, 390 390, 435 320 C 460 270, 465 210, 445 170 C 430 165, 418 175, 415 190 C 430 240, 420 280, 385 325 C 350 365, 305 345, 270 340 Z" fill="url(#redFur)" /><path d="M 360 360 C 310 360, 325 345, 328 360 C 310 368, 295 362, 292 346 Z" fill="#ffffff" /><path d="M 335 340 C 355 325, 370 332, 375 352 C 355 362, 340 352, 335 340 Z" fill="#ffffff" /><path d="M 380 310 C 405 290, 420 300, 420 320 C 400 335, 385 322, 380 310 Z" fill="#ffffff" /><path d="M 418 260 C 438 235, 450 245, 448 265 C 430 282, 418 272, 418 260 Z" fill="#ffffff" /><path d="M 432 205 C 445 185, 455 192, 450 210 C 438 220, 430 215, 432 205 Z" fill="#ffffff" /></g><g filter="url(#shadow)"><path d="M 170 240 C 150 320 170 410 250 410 C 330 410 350 320 330 240 Z" fill="url(#redFur)" /><path d="M 195 270 C 195 360 210 400 250 400 C 290 400 305 360 305 270 Z" fill="url(#darkFur)" /><ellipse cx="175" cy="395" rx="26" ry="18" fill="url(#pawsFur)" /><ellipse cx="325" cy="395" rx="26" ry="18" fill="url(#pawsFur)" /><path d="M 180 290 C 170 340 210 360 225 340 C 230 320 205 290 180 290 Z" fill="url(#pawsFur)" /><path d="M 320 290 C 330 340 290 360 275 340 C 270 320 295 290 320 290 Z" fill="url(#pawsFur)" /></g><g><path d="M 195 385 L 295 275" stroke="#7cb342" stroke-width="10" stroke-linecap="round" /><line x1="225" y1="352" x2="231" y2="345" stroke="#33691e" stroke-width="10" /><line x1="258" y1="316" x2="264" y2="309" stroke="#33691e" stroke-width="10" /><path d="M 295 275 Q 325 255 315 235 Q 290 255 295 275 Z" fill="#558b2f" /><path d="M 295 275 Q 275 245 255 250 Q 270 270 295 275 Z" fill="#7cb342" /></g><g filter="url(#shadow)"><path d="M 120 180 C 110 95 180 105 200 145 Z" fill="url(#redFur)" /><path d="M 130 175 C 122 110 175 118 190 148 Z" fill="#ffffff" /><path d="M 380 180 C 390 95 320 105 300 145 Z" fill="url(#redFur)" /><path d="M 370 175 C 378 110 325 118 310 148 Z" fill="#ffffff" /><path d="M 150 180 C 130 220 150 270 250 270 C 350 270 370 220 350 180 C 350 120 150 120 150 180 Z" fill="url(#redFur)" /><path d="M 148 200 C 140 240 180 265 210 255 C 190 235 180 210 148 200 Z" fill="#ffffff" /><path d="M 352 200 C 360 240 320 265 290 255 C 310 235 320 210 352 200 Z" fill="#ffffff" /><ellipse cx="205" cy="155" rx="12" ry="8" fill="#ffffff" transform="rotate(-10 205 155)" /><ellipse cx="295" cy="155" rx="12" ry="8" fill="#ffffff" transform="rotate(10 295 155)" /><path d="M 220 215 C 220 195 280 195 280 215 C 280 245 220 245 220 215 Z" fill="#ffffff" /><path d="M 212 195 Q 215 225 225 242 Q 205 230 205 205 Z" fill="#bf360c" /><path d="M 288 195 Q 285 225 275 242 Q 295 230 295 205 Z" fill="#bf360c" /><path d="M 240 205 C 240 200 260 200 260 205 C 260 215 250 220 250 220 C 250 220 240 215 240 205 Z" fill="#1b0000" /><ellipse cx="246" cy="204" rx="3" ry="1.5" fill="#ffffff" opacity="0.6" /><path d="M 242 223 Q 250 228 250 223 Q 250 228 258 223" stroke="#1b0000" stroke-width="2" fill="none" stroke-linecap="round" /><g><circle class="rig-eye" cx="205" cy="188" r="15" fill="#1b0000" /><circle cx="205" cy="188" r="13" fill="#3e2723" /><circle class="rig-eye" cx="205" cy="188" r="9" fill="#1b0000" /><circle cx="201" cy="184" r="4" fill="#ffffff" /><circle cx="208" cy="192" r="1.5" fill="#ffffff" /><circle class="rig-eye" cx="295" cy="188" r="15" fill="#1b0000" /><circle cx="295" cy="188" r="13" fill="#3e2723" /><circle class="rig-eye" cx="295" cy="188" r="9" fill="#1b0000" /><circle cx="291" cy="184" r="4" fill="#ffffff" /><circle cx="298" cy="192" r="1.5" fill="#ffffff" /></g></g></svg>` 
            },
            { 
                id: 'm-otter', 
                name: 'Cute Otter', 
                tier: 2, 
                unlockSec: 25200, 
                shapes: '25 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="bgGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#e0f7fa" /><stop offset="70%" stop-color="#b2ebf2" /><stop offset="100%" stop-color="#80deea" /></radialGradient><linearGradient id="otterFur" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8d5b4c" /><stop offset="50%" stop-color="#704335" /><stop offset="100%" stop-color="#543024" /></linearGradient><linearGradient id="otterCream" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff8e7" /><stop offset="100%" stop-color="#f5e1c8" /></linearGradient><radialGradient id="pearlGrad" cx="35%" cy="30%" r="65%"><stop offset="0%" stop-color="#ffffff" /><stop offset="25%" stop-color="#80d8ff" /><stop offset="65%" stop-color="#00b0ff" /><stop offset="100%" stop-color="#0077c2" /></radialGradient><radialGradient id="pearlGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#40c4ff" stop-opacity="0.6" /><stop offset="100%" stop-color="#40c4ff" stop-opacity="0" /></radialGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#00363a" flood-opacity="0.18" /></filter></defs><circle cx="250" cy="250" r="230" fill="url(#bgGrad)" /><ellipse cx="250" cy="380" rx="170" ry="25" fill="#ffffff" opacity="0.35" /><ellipse cx="250" cy="385" rx="140" ry="18" fill="#4dd0e1" opacity="0.3" /><g filter="url(#shadow)"><path d="M 230 400 C 230 440 180 445 150 420 C 135 408 150 390 175 395 C 200 400 220 380 230 400 Z" fill="url(#otterFur)" /><ellipse cx="250" cy="320" rx="75" ry="90" fill="url(#otterFur)" /><ellipse cx="250" cy="325" rx="52" ry="70" fill="url(#otterCream)" /><g fill="url(#otterFur)"><path d="M 180 375 C 165 370 155 385 165 400 C 175 410 195 405 195 390 Z" /><circle cx="170" cy="380" r="3" fill="#543024" /><circle cx="178" cy="378" r="3" fill="#543024" /><circle cx="186" cy="380" r="3" fill="#543024" /><path d="M 320 375 C 335 370 345 385 335 400 C 325 410 305 405 305 390 Z" /><circle cx="330" cy="380" r="3" fill="#543024" /><circle cx="322" cy="378" r="3" fill="#543024" /><circle cx="314" cy="380" r="3" fill="#543024" /></g></g><g><circle cx="250" cy="295" r="48" fill="url(#pearlGlow)" /><circle cx="250" cy="295" r="32" fill="url(#pearlGrad)" filter="url(#shadow)" /><ellipse cx="238" cy="282" rx="9" ry="5" fill="#ffffff" opacity="0.85" transform="rotate(-30 238 282)" /><circle cx="262" cy="308" r="3" fill="#ffffff" opacity="0.6" /><polygon points="270,278 273,283 278,284 274,288 275,293 270,290 265,293 266,288 262,284 267,283" fill="#ffffff" opacity="0.75" transform="scale(0.7) translate(110, 110)" /></g><g filter="url(#shadow)"><path d="M 185 295 C 185 280 220 280 226 295 C 228 305 200 320 188 310 Z" fill="url(#otterFur)" /><ellipse cx="222" cy="295" rx="6" ry="8" fill="url(#otterCream)" /><path d="M 315 295 C 315 280 280 280 274 295 C 272 305 300 320 312 310 Z" fill="url(#otterFur)" /><ellipse cx="278" cy="295" rx="6" ry="8" fill="url(#otterCream)" /></g><g filter="url(#shadow)"><circle cx="160" cy="165" r="18" fill="url(#otterFur)" /><circle cx="160" cy="165" r="11" fill="url(#otterCream)" /><circle cx="340" cy="165" r="18" fill="url(#otterFur)" /><circle cx="340" cy="165" r="11" fill="url(#otterCream)" /><path d="M 160 190 C 140 230 170 260 250 260 C 330 260 360 220 340 190 C 340 140 160 140 160 190 Z" fill="url(#otterFur)" /><path d="M 185 200 C 175 235 210 252 250 252 C 290 252 325 235 315 200 C 305 175 195 175 185 200 Z" fill="url(#otterCream)" /><path d="M 238 198 C 238 192 262 192 262 198 C 262 208 250 212 250 212 C 250 212 238 208 238 198 Z" fill="#3e2723" /><ellipse cx="245" cy="196" rx="3" ry="1.5" fill="#ffffff" opacity="0.5" /><path d="M 236 214 Q 224 222 215 216" stroke="#543024" stroke-width="2.5" stroke-linecap="round" fill="none" /><path d="M 264 214 Q 276 222 285 216" stroke="#543024" stroke-width="2.5" stroke-linecap="round" fill="none" /><path d="M 244 213 Q 250 222 256 213 Z" fill="#e57373" /><circle cx="225" cy="208" r="1.5" fill="#704335" /><circle cx="220" cy="212" r="1.5" fill="#704335" /><circle cx="275" cy="208" r="1.5" fill="#704335" /><circle cx="280" cy="212" r="1.5" fill="#704335" /><g><circle class="rig-eye" cx="202" cy="182" r="15" fill="#21110b" /><circle cx="198" cy="177" r="5.5" fill="#ffffff" /><circle cx="206" cy="187" r="2" fill="#ffffff" /><circle class="rig-eye" cx="298" cy="182" r="15" fill="#21110b" /><circle cx="294" cy="177" r="5.5" fill="#ffffff" /><circle cx="302" cy="187" r="2" fill="#ffffff" /></g><ellipse cx="180" cy="212" rx="10" ry="6" fill="#ff8a80" opacity="0.4" /><ellipse cx="320" cy="212" rx="10" ry="6" fill="#ff8a80" opacity="0.4" /></g><circle cx="140" cy="140" r="6" fill="#ffffff" opacity="0.5" /><circle cx="134" cy="132" r="3" fill="#ffffff" opacity="0.7" /><circle cx="370" cy="280" r="8" fill="#ffffff" opacity="0.4" /><circle cx="378" cy="268" r="4" fill="#ffffff" opacity="0.6" /></svg>` 
            },
            { 
                id: 'm-cybergriff', 
                name: 'Cyber Griffin', 
                tier: 3, 
                unlockSec: 36000, 
                shapes: '51 Shapes', 
                svg: `<svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="carbonBase" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2a3241"/><stop offset="50%" stop-color="#151a24"/><stop offset="100%" stop-color="#090c12"/></linearGradient><linearGradient id="metalHighlight" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1e293b"/><stop offset="50%" stop-color="#475569"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><linearGradient id="goldBright" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff3a1"/><stop offset="30%" stop-color="#f59e0b"/><stop offset="70%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/></linearGradient><linearGradient id="goldDark" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#b45309"/><stop offset="60%" stop-color="#78350f"/><stop offset="100%" stop-color="#451a03"/></linearGradient><linearGradient id="cyanCore" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#a5f3fc"/><stop offset="30%" stop-color="#00ffff"/><stop offset="70%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient><linearGradient id="wingBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#67e8f9"/><stop offset="25%" stop-color="#00ffff"/><stop offset="60%" stop-color="#0f172a"/><stop offset="100%" stop-color="#0284c7"/></linearGradient><filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="blur1"/><feGaussianBlur stdDeviation="15" result="blur2"/><feMerge><feMergeNode in="blur2"/><feMergeNode in="blur1"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b1"/><feGaussianBlur stdDeviation="10" result="b2"/><feGaussianBlur stdDeviation="25" result="b3"/><feMerge><feMergeNode in="b3"/><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g id="BackWing" transform="translate(480, 280) rotate(-10) scale(0.85)"><path d="M0,0 L-120,-180 L-280,-260 L-420,-200 L-260,-110 Z" fill="url(#carbonBase)" stroke="url(#goldBright)" stroke-width="2"/><polygon points="-280,-260 -360,-360 -320,-240" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="1.5"/><polygon points="-320,-240 -430,-330 -350,-210" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="1.5"/><polygon points="-350,-210 -480,-280 -380,-180" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="1.5"/><polygon points="-380,-180 -520,-220 -400,-150" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="1.5"/><polygon points="-400,-150 -530,-150 -380,-110" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="1.5"/><polygon points="-380,-110 -500,-80 -340,-80" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="1.5"/><path d="M-120,-180 L-280,-260 L-360,-360" fill="none" stroke="#00ffff" stroke-width="3" filter="url(#cyanGlow)"/></g><g id="FarHindLeg" opacity="0.7"><path d="M310,430 L250,520 L280,600 L240,640 L285,645 L320,610 L290,530 L360,460 Z" fill="url(#carbonBase)" stroke="url(#goldDark)" stroke-width="1.5"/><path d="M240,640 L220,650 L220,660 L285,660 L285,645 Z" fill="url(#goldDark)"/></g><g id="FarFrontLeg" opacity="0.75"><path d="M640,430 L610,520 L630,600 L580,645 Z" fill="url(#carbonBase)" stroke="#00ffff" stroke-width="1.5"/><path d="M580,645 L550,660 M580,645 L565,665 M580,645 L585,665" stroke="#00ffff" stroke-width="2.5" stroke-linecap="round"/></g><g id="CyberLionTail"><path d="M260,420 C180,410 120,470 150,560 C170,620 120,670 60,650" fill="none" stroke="url(#carbonBase)" stroke-width="14" stroke-linecap="round"/><path d="M260,420 C180,410 120,470 150,560 C170,620 120,670 60,650" fill="none" stroke="url(#goldBright)" stroke-width="3" stroke-dasharray="12 6"/><path d="M260,420 C180,410 120,470 150,560 C170,620 120,670 60,650" fill="none" stroke="#00ffff" stroke-width="1.5" filter="url(#cyanGlow)"/><circle cx="210" cy="420" r="7" fill="url(#goldDark)" stroke="#00ffff" stroke-width="1"/><circle cx="145" cy="485" r="7" fill="url(#goldDark)" stroke="#00ffff" stroke-width="1"/><circle cx="158" cy="580" r="7" fill="url(#goldDark)" stroke="#00ffff" stroke-width="1"/><g transform="translate(60, 650) rotate(-140)"><polygon points="0,0 -20,-40 0,-70 20,-40" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/><polygon points="0,-5 -35,-45 0,-95 35,-45" fill="url(#cyanCore)" filter="url(#intenseGlow)" opacity="0.8"/><polygon points="0,-10 -15,-45 0,-75 15,-45" fill="#ffffff"/></g></g><g id="MainBody"><path d="M250,410 C280,360 350,350 430,360 L510,380 C480,440 450,480 380,490 C310,500 260,460 250,410 Z" fill="url(#carbonBase)" stroke="#1e293b" stroke-width="2"/><path d="M260,405 C290,370 340,365 370,390 L390,450 C350,485 300,480 270,450 Z" fill="url(#goldBright)" stroke="#ffffff" stroke-width="1"/><path d="M280,410 L350,385 L370,435 L300,455 Z" fill="url(#goldDark)"/><line x1="310" y1="400" x2="330" y2="440" stroke="#00ffff" stroke-width="2" filter="url(#cyanGlow)"/><line x1="325" y1="395" x2="345" y2="435" stroke="#00ffff" stroke-width="2" filter="url(#cyanGlow)"/><path d="M480,360 L580,310 L680,360 L650,480 L540,510 L460,440 Z" fill="url(#metalHighlight)" stroke="url(#goldBright)" stroke-width="2"/><polygon points="540,340 620,320 660,380 610,450 530,420" fill="url(#goldBright)" stroke="#fff" stroke-width="1.5"/><polygon points="560,355 610,340 635,385 600,430 550,405" fill="url(#goldDark)"/><polygon points="600,370 625,360 635,385 610,400" fill="#00ffff" filter="url(#intenseGlow)"/><polygon points="605,373 620,365 628,383 612,393" fill="#ffffff"/><path d="M570,320 L610,240 L660,230 L700,290 L640,330 Z" fill="url(#carbonBase)" stroke="#00ffff" stroke-width="1.5"/><polygon points="590,290 630,235 650,265 610,310" fill="url(#goldBright)"/><polygon points="620,280 655,232 675,260 640,300" fill="url(#goldDark)"/></g><g id="NearHindLeg"><path d="M360,440 L410,500 L350,590 L365,650 L300,655 L310,580 L370,500 Z" fill="url(#carbonBase)" stroke="url(#goldBright)" stroke-width="2"/><polygon points="380,480 415,505 385,530 365,500" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/><path d="M365,650 L385,630 L410,635 L420,660 L300,660 L300,650 Z" fill="url(#goldBright)" stroke="url(#goldDark)" stroke-width="1.5"/><path d="M340,660 C340,645 355,640 360,660 M360,660 C360,645 380,640 385,660 M385,660 C385,645 405,640 410,660" fill="none" stroke="url(#carbonBase)" stroke-width="3"/><path d="M350,658 L355,665 M375,658 L380,665 M400,658 L405,665" stroke="#00ffff" stroke-width="2" filter="url(#cyanGlow)"/></g><g id="NearFrontLeg"><path d="M620,440 L690,460 L660,560 L680,630 L635,645 L620,560 L635,480 Z" fill="url(#carbonBase)" stroke="url(#goldBright)" stroke-width="2"/><polygon points="640,465 680,475 660,540 630,520" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/><g transform="translate(650, 630)"><path d="M-10,5 L-35,0 L-45,15 L-20,15 Z" fill="url(#goldDark)" stroke="#00ffff" stroke-width="1"/><path d="M0,0 L25,10 L35,30 L20,32 L0,15 Z" fill="url(#goldBright)" stroke="#00ffff" stroke-width="1"/><path d="M5,-5 L40,-5 L55,15 L40,20 L10,5 Z" fill="url(#goldBright)" stroke="#ffffff" stroke-width="1"/><path d="M0,-10 L30,-25 L45,-10 L25,0 L0,-5 Z" fill="url(#goldDark)" stroke="#00ffff" stroke-width="1"/><path d="M35,30 L50,35 L20,32 M55,15 L70,22 L40,20 M45,-10 L60,-8 L25,0 M-45,15 L-60,22 L-20,15" stroke="#00ffff" stroke-width="3" fill="none" filter="url(#intenseGlow)"/><path d="M35,30 L50,35 M55,15 L70,22 M45,-10 L60,-8 M-45,15 L-60,22" stroke="#ffffff" stroke-width="1.5" fill="none"/></g></g><g id="CyberEagleHead" transform="translate(610, 160)"><g><polygon points="20,70 -30,30 10,40" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/><polygon points="30,50 -40,0 20,20" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="1.5"/><polygon points="50,30 -20,-30 40,0" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/><polygon points="70,15 20,-50 60,-10" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="1.5"/></g><path d="M40,60 L90,10 L160,15 L200,60 L180,110 L110,120 L50,100 Z" fill="url(#carbonBase)" stroke="url(#goldBright)" stroke-width="2.5"/><polygon points="85,15 155,20 180,55 130,50 80,45" fill="url(#goldBright)" stroke="#ffffff" stroke-width="1.5"/><polygon points="95,25 145,28 165,52 125,48" fill="url(#goldDark)"/><polygon points="60,95 110,80 160,115 100,125" fill="url(#metalHighlight)" stroke="url(#goldBright)" stroke-width="1"/><g><polygon points="110,45 185,50 170,85 115,75" fill="#050811" stroke="#00ffff" stroke-width="1.5"/><polygon class="rig-eye" points="118,50 180,55 168,80 120,72" fill="url(#cyanCore)" filter="url(#intenseGlow)"/><polygon points="125,53 175,57 168,68 127,63" fill="#ffffff" filter="url(#cyanGlow)"/></g><g><path d="M170,55 L220,60 C250,65 285,85 280,125 C275,145 255,155 240,150 L210,115 L165,105 Z" fill="url(#goldBright)" stroke="#ffffff" stroke-width="2"/><path d="M185,95 L220,105 C245,115 260,130 255,145 C240,130 210,115 185,105 Z" fill="url(#carbonBase)" stroke="url(#goldDark)" stroke-width="1"/><path d="M170,100 L210,110 C240,120 255,135 255,145" fill="none" stroke="#00ffff" stroke-width="2.5" filter="url(#intenseGlow)"/><path d="M165,105 L210,115 C230,125 240,135 235,145 C215,148 190,140 150,120 Z" fill="url(#goldDark)" stroke="url(#goldBright)" stroke-width="1.5"/></g><polygon points="190,72 210,75 205,82 188,78" fill="#090c12" stroke="#00ffff" stroke-width="1"/></g><g id="NearWing"><circle cx="560" cy="350" r="25" fill="url(#carbonBase)" stroke="url(#goldBright)" stroke-width="3"/><circle cx="560" cy="350" r="12" fill="#00ffff" filter="url(#cyanGlow)"/><path d="M560,350 L480,180 L320,100 L360,150 L490,220 Z" fill="url(#goldBright)" stroke="#ffffff" stroke-width="1.5"/><path d="M320,100 L120,40 L200,120 L360,150 Z" fill="url(#carbonBase)" stroke="#00ffff" stroke-width="2"/><g filter="url(#cyanGlow)"><polygon points="120,40 -40,0 80,80" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="140,60 -10,30 110,100" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="170,80 20,60 140,120" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="200,100 50,90 170,140" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="230,120 80,120 200,165" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="270,135 120,160 230,190" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="310,150 160,200 270,215" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="360,165 200,240 310,240" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="410,180 250,280 350,265" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="460,200 300,320 400,290" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/><polygon points="500,230 350,360 440,310" fill="url(#wingBladeGrad)" stroke="#00ffff" stroke-width="2"/></g><g><polygon points="320,100 200,130 340,160" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/><polygon points="360,120 240,160 380,180" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/><polygon points="400,140 280,190 420,200" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/><polygon points="440,160 320,220 460,220" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/><polygon points="480,190 360,260 490,250" fill="url(#goldBright)" stroke="#fff" stroke-width="1"/></g><path d="M560,350 L480,180 L320,100 L120,40 L-40,0" fill="none" stroke="#ffffff" stroke-width="3" filter="url(#intenseGlow)"/></g><g stroke="#00ffff" stroke-width="1.5" fill="none" filter="url(#intenseGlow)" opacity="0.9"><path d="M680,645 L710,630 L700,660 L730,650"/><path d="M-40,0 L-60,-20 L-50,10 L-80,-5"/></g></svg>` 
            },
            { 
                id: 'm-phoenix', 
                name: 'Imperial Phoenix', 
                tier: 3, 
                unlockSec: 43200, 
                shapes: '48 Shapes', 
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <defs>
    <!-- Feather Gradients -->
    <!-- Tier 1: Outer Dark Crimson / Ruby -->
    <linearGradient id="featherRuby" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a000b" />
      <stop offset="40%" stop-color="#99001c" />
      <stop offset="80%" stop-color="#e6002e" />
      <stop offset="100%" stop-color="#ff3300" />
    </linearGradient>

    <!-- Tier 2: Mid Fiery Orange / Gold -->
    <linearGradient id="featherFire" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#800000" />
      <stop offset="30%" stop-color="#cc3300" />
      <stop offset="70%" stop-color="#ff6600" />
      <stop offset="100%" stop-color="#ffcc00" />
    </linearGradient>

    <!-- Tier 3: Radiant Imperial Gold -->
    <linearGradient id="featherGold" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b35900" />
      <stop offset="35%" stop-color="#ffa600" />
      <stop offset="75%" stop-color="#ffee55" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>

    <!-- Tier 4: Inner White-Hot Core -->
    <linearGradient id="featherCore" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6600" />
      <stop offset="40%" stop-color="#ffcc00" />
      <stop offset="80%" stop-color="#ffff99" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>

    <!-- Imperial Gold Armor / Filigree Gradient -->
    <linearGradient id="imperialGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5e4104" />
      <stop offset="20%" stop-color="#ab7a16" />
      <stop offset="40%" stop-color="#f5d061" />
      <stop offset="60%" stop-color="#e6b022" />
      <stop offset="80%" stop-color="#966a0d" />
      <stop offset="100%" stop-color="#3d2800" />
    </linearGradient>

    <!-- Tail Plume Gradient -->
    <linearGradient id="tailPlume" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="20%" stop-color="#ffea66" />
      <stop offset="45%" stop-color="#ff6600" />
      <stop offset="75%" stop-color="#b3001b" />
      <stop offset="100%" stop-color="#2b0008" />
    </linearGradient>

    <!-- Beak & Eye Gradient -->
    <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#fff2a3" />
      <stop offset="70%" stop-color="#d99b00" />
      <stop offset="100%" stop-color="#593b00" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glowSoft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="glowIntense" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="blur1" />
      <feGaussianBlur stdDeviation="30" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- REUSABLE WING MODULE (Left Wing) -->
    <g id="phoenixLeftWing">
      <!-- LAYER 1: Deep Primary Feathers (Outermost / Crimson) -->
      <g fill="url(#featherRuby)">
        <path d="M480,390 C330,220 180,90 20,60 C100,160 260,320 440,430 Z" />
        <path d="M480,405 C310,250 150,140 10,130 C90,210 240,360 420,440 Z" />
        <path d="M480,420 C290,290 130,200 15,200 C85,270 220,400 400,450 Z" />
        <path d="M480,435 C270,330 110,260 25,270 C90,325 210,430 380,460 Z" />
        <path d="M480,450 C250,370 100,320 40,340 C100,380 200,460 360,470 Z" />
        <path d="M480,465 C240,410 110,380 60,410 C110,435 200,480 340,480 Z" />
        <path d="M480,480 C240,450 130,440 90,470 C130,485 210,500 330,490 Z" />
      </g>

      <!-- LAYER 2: Secondary Feathers (Mid Sweep / Fiery Orange) -->
      <g fill="url(#featherFire)">
        <path d="M470,395 C340,245 200,130 55,105 C125,185 270,325 430,425 Z" />
        <path d="M470,410 C320,275 170,180 45,170 C115,235 250,365 410,435 Z" />
        <path d="M470,425 C300,310 150,230 45,235 C110,285 230,395 390,445 Z" />
        <path d="M470,440 C280,350 130,290 55,305 C115,345 220,425 370,455 Z" />
        <path d="M470,455 C260,390 120,350 70,370 C120,400 210,455 350,465 Z" />
        <path d="M470,470 C250,425 130,400 90,425 C130,445 210,475 330,475 Z" />
      </g>

      <!-- LAYER 3: Tertiary Feathers (Inner Sweep / Bright Gold) -->
      <g fill="url(#featherGold)">
        <path d="M460,400 C340,275 220,175 95,155 C155,215 280,335 420,420 Z" />
        <path d="M460,415 C320,305 190,220 85,210 C140,260 260,370 400,430 Z" />
        <path d="M460,430 C300,335 170,265 85,270 C135,305 240,395 380,440 Z" />
        <path d="M460,445 C280,370 150,315 95,335 C140,365 230,420 360,450 Z" />
        <path d="M460,460 C260,405 140,370 110,395 C145,415 220,450 340,460 Z" />
      </g>

      <!-- LAYER 4: Covert Feathers (White-Hot Flames at Shoulder Base) -->
      <g fill="url(#featherCore)" filter="url(#glowSoft)">
        <path d="M450,405 C340,305 240,215 135,200 C185,245 290,345 410,415 Z" />
        <path d="M450,420 C320,335 210,260 125,255 C165,285 270,375 390,425 Z" />
        <path d="M450,435 C300,360 190,300 125,305 C160,330 250,395 370,435 Z" />
        <path d="M450,450 C280,390 170,345 135,360 C165,380 240,425 350,445 Z" />
      </g>

      <!-- Imperial Wing Scapular Armor / Filigree -->
      <g fill="url(#imperialGold)">
        <path d="M480,380 C440,340 370,330 310,350 C360,380 430,390 480,380 Z" />
        <path d="M475,400 C430,365 350,360 290,385 C340,410 420,415 475,400 Z" />
        <path d="M470,420 C420,390 330,390 270,420 C330,440 410,440 470,420 Z" />
        <path d="M465,440 C410,415 320,420 260,450 C320,465 400,460 465,440 Z" />
      </g>
    </g>

    <!-- REUSABLE TAIL PLUME MODULE -->
    <g id="singleTailPlume">
      <path d="M500,530 C470,640 410,780 310,890 C290,912 260,940 230,950 C260,925 290,890 310,850 C390,740 440,620 480,520 Z" fill="url(#tailPlume)" />
      <!-- Flame Eyelet at tip -->
      <path d="M230,950 C210,930 200,900 220,880 C240,860 270,870 280,890 C290,910 270,940 230,950 Z" fill="url(#featherCore)" filter="url(#glowSoft)" />
      <circle cx="242" cy="902" r="8" fill="#ffffff" filter="url(#glowSoft)" />
    </g>
  </defs>

  <!-- ==================== TAIL FEATHERS (BACK LAYER) ==================== -->
  <g id="tailLayerBack">
    <!-- Outer Left Plume -->
    <use href="#singleTailPlume" transform="translate(0,0)" />
    <!-- Outer Right Plume (Mirrored) -->
    <use href="#singleTailPlume" transform="translate(1000, 0) scale(-1, 1)" />

    <!-- Mid Left Plume (Slightly Rotated/Scaled) -->
    <g transform="translate(70, 30) rotate(-12, 500, 500)">
      <use href="#singleTailPlume" />
    </g>
    <!-- Mid Right Plume (Mirrored) -->
    <g transform="translate(-70, 30) rotate(12, 500, 500)">
      <use href="#singleTailPlume" transform="translate(1000, 0) scale(-1, 1)" />
    </g>

    <!-- Deep Center Cascading Tail Plumes -->
    <path d="M500,520 C460,660 410,820 430,960 C440,985 460,990 470,965 C480,920 485,780 500,520 Z" fill="url(#tailPlume)" />
    <path d="M500,520 C540,660 590,820 570,960 C560,985 540,990 530,965 C520,920 515,780 500,520 Z" fill="url(#tailPlume)" />

    <!-- Center Major Plume -->
    <path d="M500,530 C475,680 460,840 490,985 C495,1000 505,1000 510,985 C540,840 525,680 500,530 Z" fill="url(#featherGold)" filter="url(#glowSoft)" />
    <!-- Center Tail Flame Emblem -->
    <path d="M500,1000 C470,960 475,920 500,890 C525,920 530,960 500,1000 Z" fill="url(#featherCore)" filter="url(#glowIntense)" />
  </g>

  <!-- ==================== WINGS LAYER ==================== -->
  <g id="wingsLayer">
    <!-- LEFT WING -->
    <use href="#phoenixLeftWing" />

    <!-- RIGHT WING (Symmetrically Mirrored for Imperial Heraldry) -->
    <use href="#phoenixLeftWing" transform="translate(1000, 0) scale(-1, 1)" />
  </g>

  <!-- ==================== BODY & TORSO ==================== -->
  <g id="phoenixBody">
    <!-- Lower Body / Abdomen Base -->
    <path d="M500,620 C450,560 440,480 470,420 C485,450 495,490 500,530 C505,490 515,450 530,420 C560,480 550,560 500,620 Z" fill="url(#featherRuby)" />

    <!-- Layered Breast Feathers (Scalloped Fiery Plumes) -->
    <g fill="url(#featherFire)">
      <path d="M500,570 C465,525 455,475 480,430 C490,460 495,490 500,520 C505,490 510,460 520,430 C545,475 535,525 500,570 Z" />
      <path d="M500,530 C472,495 465,455 485,415 C492,440 497,465 500,490 C503,465 508,440 515,415 C535,455 528,495 500,530 Z" />
    </g>

    <g fill="url(#featherGold)">
      <path d="M500,490 C478,460 472,430 488,395 C493,415 497,435 500,455 C503,435 507,415 512,395 C528,430 522,460 500,490 Z" />
      <path d="M500,450 C482,425 478,400 490,375 C495,390 498,405 500,420 C502,405 505,390 510,375 C522,400 518,425 500,450 Z" fill="url(#featherCore)" filter="url(#glowSoft)" />
    </g>

    <!-- Imperial Chest Armor / Solar Cuirass -->
    <g id="chestArmor">
      <!-- Gold Armor Plate Shell -->
      <path d="M500,360 L535,410 L500,460 L465,410 Z" fill="url(#imperialGold)" stroke="#ffee88" stroke-width="1" />
      <!-- Inner Radiant Ruby Gem -->
      <path d="M500,375 L522,410 L500,445 L478,410 Z" fill="url(#featherRuby)" />
      <!-- Solar Heart Core -->
      <circle cx="500" cy="410" r="14" fill="url(#featherCore)" filter="url(#glowIntense)" />
      <circle cx="500" cy="410" r="6" fill="#ffffff" />
    </g>

    <!-- Neck Structure -->
    <g id="phoenixNeck">
      <!-- Graceful Curved Neck Feathers -->
      <path d="M500,380 C470,340 465,280 485,230 C492,260 497,285 500,310 C503,285 508,260 515,230 C535,280 530,340 500,380 Z" fill="url(#featherGold)" />
      <path d="M500,340 C480,310 475,270 488,230 C493,250 497,270 500,290 C503,270 507,250 512,230 C525,270 520,310 500,340 Z" fill="url(#featherCore)" filter="url(#glowSoft)" />
    </g>
  </g>

  <!-- ==================== HEAD AND FLAMING CREST ==================== -->
  <g id="phoenixHeadCrest">
    <!-- BACK FLAMING CREST TENDRILS (Behind Head) -->
    <g filter="url(#glowIntense)">
      <!-- Central Supreme Spire -->
      <path d="M500,230 C480,150 450,70 490,10 C510,60 515,130 500,230 Z" fill="url(#featherCore)" />
      <!-- Left High Flame Tendril -->
      <path d="M490,225 C450,150 380,80 340,30 C400,70 460,140 485,225 Z" fill="url(#featherGold)" />
      <!-- Right High Flame Tendril -->
      <path d="M510,225 C550,150 620,80 660,30 C600,70 540,140 515,225 Z" fill="url(#featherGold)" />
      <!-- Left Outer Flame Sweep -->
      <path d="M480,230 C420,170 330,130 250,100 C330,130 420,180 470,240 Z" fill="url(#featherFire)" />
      <!-- Right Outer Flame Sweep -->
      <path d="M520,230 C580,170 670,130 750,100 C670,130 580,180 530,240 Z" fill="url(#featherFire)" />
    </g>

    <!-- INNER HOT CREST CORE -->
    <g filter="url(#glowSoft)">
      <path d="M500,225 C488,160 470,100 495,35 C508,80 510,140 500,225 Z" fill="#ffffff" />
      <path d="M495,225 C465,165 415,115 375,75 C420,105 465,155 490,225 Z" fill="url(#featherCore)" />
      <path d="M505,225 C535,165 585,115 625,75 C580,105 535,155 510,225 Z" fill="url(#featherCore)" />
    </g>

    <!-- HEAD GRAPHIC (Regal Noble Crown / Side-Front Angled Imperial Profile) -->
    <g id="headBase">
      <!-- Skull Base Structure -->
      <path d="M475,245 C470,215 490,195 515,210 C535,220 540,240 525,260 C510,270 485,265 475,245 Z" fill="url(#imperialGold)" />
      <!-- Throat & Chin Feathers -->
      <path d="M480,250 C490,270 500,285 520,275 C535,265 545,245 535,230 C545,245 540,270 520,285 C500,295 485,280 480,250 Z" fill="url(#featherFire)" />

      <!-- Imperial Beak (Hooked Fiery Eagle Beak) -->
      <path d="M515,220 C535,220 560,230 575,250 C550,255 535,260 515,245 Z" fill="url(#beakGrad)" filter="url(#glowSoft)" />
      <path d="M525,235 C545,238 565,248 575,250 C555,262 540,265 520,248 Z" fill="#3d2600" opacity="0.4" />

      <!-- Fiery Crown Brow / Armor Plate -->
      <path d="M480,230 C500,210 525,210 545,225 C530,225 505,220 480,230 Z" fill="url(#featherCore)" />
      <path d="M495,222 C510,212 530,212 540,220 C530,220 512,216 495,222 Z" fill="#ffffff" />

      <!-- The Phoenix Eye (Radiant Solar Eye) -->
      <g id="phoenixEye">
        <!-- Eye Socket Shadow -->
        <polygon points="505,232 525,228 520,240 502,238" fill="#1a0500" />
        <!-- Eyeball Outer Fire -->
        <polygon points="507,233 523,230 518,238 505,237" fill="url(#featherCore)" filter="url(#glowSoft)" />
        <!-- Glowing Pupil Slit -->
        <ellipse cx="514" cy="234" rx="2.5" ry="4" fill="#ffffff" transform="rotate(15, 514, 234)" />
        <!-- Eye Brow Flame Ridge -->
        <path d="M500,230 Q515,222 530,226" stroke="url(#featherCore)" stroke-width="2" fill="none" filter="url(#glowSoft)" />
      </g>
    </g>
  </g>
</svg>` 
            },
            { 
                id: 'm-fairydrag', 
                name: 'Fairy Dragon', 
                tier: 3, 
                unlockSec: 54000, 
                shapes: '52 Shapes', 
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <defs>
    <!-- Dragon Violet Body Gradients -->
    <linearGradient id="dragonSkin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b46eff" />
      <stop offset="35%" stop-color="#8038d1" />
      <stop offset="70%" stop-color="#521b96" />
      <stop offset="100%" stop-color="#310b61" />
    </linearGradient>

    <linearGradient id="dragonSkinHighlight" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#e0b8ff" />
      <stop offset="50%" stop-color="#9d4edd" />
      <stop offset="100%" stop-color="#4a1282" />
    </linearGradient>

    <linearGradient id="dragonBelly" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#f5e1ff" />
      <stop offset="70%" stop-color="#d69eff" />
      <stop offset="100%" stop-color="#9b5de5" />
    </linearGradient>

    <linearGradient id="hornGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3d2a4a" />
      <stop offset="45%" stop-color="#836b9c" />
      <stop offset="80%" stop-color="#cbb8e3" />
      <stop offset="100%" stop-color="#ebdcf7" />
    </linearGradient>

    <!-- Butterfly Wing Gradients -->
    <linearGradient id="wingBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7aef8" />
      <stop offset="25%" stop-color="#b388eb" />
      <stop offset="55%" stop-color="#72ddf7" />
      <stop offset="80%" stop-color="#3a86ff" />
      <stop offset="100%" stop-color="#1d2d80" />
    </linearGradient>

    <radialGradient id="wingGlowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#b8f2ff" stop-opacity="0.6" />
      <stop offset="80%" stop-color="#e8b2ff" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#7b2cbf" stop-opacity="0" />
    </radialGradient>

    <!-- Floral Gradients -->
    <radialGradient id="flowerBlue" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#a0c4ff" />
      <stop offset="80%" stop-color="#4361ee" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </radialGradient>

    <radialGradient id="flowerPink" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#ffc6ff" />
      <stop offset="75%" stop-color="#ff66c4" />
      <stop offset="100%" stop-color="#800f4e" />
    </radialGradient>

    <!-- Glow Filters -->
    <filter id="glowSoft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="glowIntense" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12" result="blur1" />
      <feGaussianBlur stdDeviation="25" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- REUSABLE SYMBOLS -->
    <!-- Blue Blossom -->
    <g id="blueFlower">
      <path d="M0,-12 C-4,-6 -10,-6 -10,0 C-10,6 -4,6 0,12 C4,6 10,6 10,0 C10,-6 4,-6 0,-12 Z" fill="url(#flowerBlue)" />
      <path d="M-12,0 C-6,-4 -6,-10 0,-10 C6,-10 6,-4 12,0 C6,4 6,10 0,10 C-6,10 -6,4 -12,0 Z" fill="url(#flowerBlue)" />
      <circle cx="0" cy="0" r="3.5" fill="#fff3b0" filter="url(#glowSoft)" />
    </g>

    <!-- Sparkle Star -->
    <g id="sparkle">
      <path d="M0,-15 Q0,0 -15,0 Q0,0 0,15 Q0,0 15,0 Q0,0 0,-15 Z" fill="#ffffff" filter="url(#glowSoft)" />
    </g>
  </defs>

  <!-- ==================== DRAGON (BACK WINGS LAYER) ==================== -->
  <g id="dragonBackWings" opacity="0.85">
    <!-- Far Hindwing -->
    <g transform="translate(100, -30) rotate(-10, 500, 450)">
      <path d="M520,460 C620,380 730,390 790,480 C830,540 810,630 720,670 C640,700 550,620 520,460 Z" fill="url(#wingBaseGrad)" />
      <!-- Wing Veins -->
      <path d="M520,460 C600,430 700,440 790,480 M520,460 C620,500 730,550 720,670 M520,460 C580,550 640,630 720,670" stroke="#101540" stroke-width="3" fill="none" opacity="0.6" />
    </g>

    <!-- Far Forewing -->
    <g transform="translate(60, -50) rotate(-8, 500, 450)">
      <path d="M500,430 C580,260 720,180 820,220 C900,250 910,360 810,440 C730,500 580,480 500,430 Z" fill="url(#wingBaseGrad)" />
      <!-- Wing Veins -->
      <path d="M500,430 C620,300 730,220 820,220 M500,430 C640,340 780,330 810,440 M500,430 C610,410 720,430 810,440" stroke="#101540" stroke-width="3.5" fill="none" opacity="0.6" />
    </g>
  </g>

  <!-- ==================== DRAGON BODY & TAIL ==================== -->
  <g id="dragonMainBody">
    <!-- Tail Base to Curl -->
    <path d="M530,660 C600,700 680,720 750,690 C830,650 850,550 810,480 C770,420 700,440 680,500 C660,560 720,620 780,600 C830,580 840,520 810,490" stroke="url(#dragonSkin)" stroke-width="38" stroke-linecap="round" fill="none" />
    <path d="M530,660 C600,700 680,720 750,690 C830,650 850,550 810,480 C770,420 700,440 680,500 C660,560 720,620 780,600 C830,580 840,520 810,490" stroke="url(#dragonSkinHighlight)" stroke-width="18" stroke-linecap="round" fill="none" opacity="0.6" />

    <!-- Tail Tip Fluff / Miniature Fin -->
    <path d="M810,490 C820,460 850,450 860,470 C870,490 840,510 810,490 Z" fill="url(#flowerPink)" filter="url(#glowSoft)" />

    <!-- DETAILED HIND LEG & PAW -->
    <g id="hindLeg">
      <!-- Thigh & Lower Leg Structure -->
      <path d="M500,600 C540,590 590,620 570,690 C550,730 515,740 480,735 C460,700 470,630 500,600 Z" fill="url(#dragonSkin)" />
      <path d="M480,710 C465,720 455,730 460,742 C472,750 500,748 505,732 C495,718 488,712 480,710 Z" fill="url(#dragonSkinHighlight)" />

      <!-- Formed Toes -->
      <path d="M458,732 C448,736 438,742 434,752 C432,758 438,760 444,756 C452,750 458,740 462,734 Z" fill="url(#dragonSkinHighlight)" stroke="#310b61" stroke-width="1" />
      <path d="M468,736 C460,744 454,756 454,766 C454,772 460,774 466,768 C472,760 476,746 476,736 Z" fill="url(#dragonSkinHighlight)" stroke="#310b61" stroke-width="1" />
      <path d="M482,736 C480,746 478,758 480,768 C482,774 488,774 492,768 C496,758 494,744 490,734 Z" fill="url(#dragonSkinHighlight)" stroke="#310b61" stroke-width="1" />
      <path d="M496,732 C500,738 506,746 512,752 C516,756 520,752 518,746 C514,740 506,732 500,728 Z" fill="url(#dragonSkin)" stroke="#310b61" stroke-width="1" />

      <!-- Toe Knuckle Highlights -->
      <ellipse cx="462" cy="748" rx="3.5" ry="2" fill="#d69eff" opacity="0.6" />
      <ellipse cx="474" cy="750" rx="3.5" ry="2" fill="#d69eff" opacity="0.6" />
      <ellipse cx="488" cy="748" rx="3.5" ry="2" fill="#d69eff" opacity="0.6" />

      <!-- Sculpted Pearlescent Claws -->
      <path d="M436,754 Q424,760 420,770 Q430,768 440,760 Z" fill="url(#hornGrad)" stroke="#3a254c" stroke-width="0.8" />
      <path d="M436,754 Q426,759 422,768" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.8" />

      <path d="M456,768 Q448,780 446,792 Q456,786 464,772 Z" fill="url(#hornGrad)" stroke="#3a254c" stroke-width="0.8" />
      <path d="M456,768 Q449,779 448,789" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.9" />

      <path d="M482,770 Q480,782 480,794 Q488,786 490,770 Z" fill="url(#hornGrad)" stroke="#3a254c" stroke-width="0.8" />
      <path d="M482,770 Q481,782 482,791" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.9" />

      <path d="M514,750 Q522,758 528,764 Q524,756 518,748 Z" fill="url(#hornGrad)" stroke="#3a254c" stroke-width="0.8" />
      <path d="M514,750 Q521,757 526,762" stroke="#ffffff" stroke-width="0.8" fill="none" opacity="0.8" />
    </g>

    <!-- Main Torso & Back -->
    <path d="M420,430 C470,420 530,470 540,550 C550,620 520,670 450,670 C400,670 380,600 400,520 C405,480 410,450 420,430 Z" fill="url(#dragonSkin)" />

    <!-- Soft Pearlescent Underbelly / Chest Plates -->
    <g id="dragonBellyPlates">
      <path d="M420,450 C400,490 390,540 400,590 C410,630 430,660 450,670 C430,660 415,630 410,590 C405,540 415,490 428,450 Z" fill="url(#dragonBelly)" />
      <!-- Ridges / Segment Lines -->
      <path d="M420,475 C408,485 402,495 401,505" stroke="#9b5de5" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M412,520 C402,532 398,545 400,555" stroke="#9b5de5" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M408,570 C402,585 405,600 412,615" stroke="#9b5de5" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M418,625 C418,638 425,650 435,660" stroke="#9b5de5" stroke-width="2" fill="none" opacity="0.5" />
    </g>

    <!-- DETAILED FRONT LEG & PAW -->
    <g id="frontLeg">
      <!-- Upper & Forearm Structure -->
      <path d="M420,530 C390,560 370,610 365,660 C360,690 370,720 385,735 C400,735 410,710 410,680 C415,620 435,570 420,530 Z" fill="url(#dragonSkinHighlight)" />
      <path d="M365,690 C355,710 345,725 350,740 C360,750 395,750 405,735 C400,715 390,695 375,690 Z" fill="url(#dragonSkin)" />

      <!-- Distinct Front Toes -->
      <path d="M352,728 C342,732 334,740 330,750 C328,756 332,760 338,758 C346,754 352,744 356,734 Z" fill="url(#dragonSkinHighlight)" stroke="#4a1282" stroke-width="1" />
      <path d="M365,732 C358,740 352,752 352,762 C352,768 358,770 364,766 C370,760 372,746 372,734 Z" fill="url(#dragonSkinHighlight)" stroke="#4a1282" stroke-width="1" />
      <path d="M380,732 C378,742 376,754 378,764 C380,770 386,770 390,764 C394,756 392,742 388,732 Z" fill="url(#dragonSkinHighlight)" stroke="#4a1282" stroke-width="1" />
      <path d="M394,728 C396,734 402,742 406,750 C410,754 414,752 414,746 C412,740 404,732 398,726 Z" fill="url(#dragonSkin)" stroke="#4a1282" stroke-width="1" />

      <!-- Soft Paw Pads -->
      <ellipse cx="360" cy="746" rx="4" ry="2.5" fill="#d69eff" opacity="0.6" />
      <ellipse cx="374" cy="748" rx="4" ry="2.5" fill="#d69eff" opacity="0.6" />
      <ellipse cx="386" cy="746" rx="3.5" ry="2" fill="#d69eff" opacity="0.6" />

      <!-- Sculpted Pearlescent Front Claws -->
      <path d="M332,752 Q320,758 316,768 Q326,766 336,758 Z" fill="url(#hornGrad)" stroke="#3a254c" stroke-width="0.8" />
      <path d="M332,752 Q322,757 318,766" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.8" />

      <path d="M354,764 Q346,776 344,788 Q354,782 362,768 Z" fill="url(#hornGrad)" stroke="#3a254c" stroke-width="0.8" />
      <path d="M354,764 Q347,775 346,785" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.9" />

      <path d="M380,765 Q378,778 378,790 Q386,782 388,766 Z" fill="url(#hornGrad)" stroke="#3a254c" stroke-width="0.8" />
      <path d="M380,765 Q379,777 380,787" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.9" />

      <path d="M408,748 Q416,756 422,762 Q418,754 412,746 Z" fill="url(#hornGrad)" stroke="#3a254c" stroke-width="0.8" />
      <path d="M408,748 Q415,755 420,760" stroke="#ffffff" stroke-width="0.8" fill="none" opacity="0.8" />
    </g>

    <!-- Elegant Neck -->
    <path d="M425,440 C410,380 370,320 380,260 C395,280 420,330 440,370 C450,395 445,420 425,440 Z" fill="url(#dragonSkin)" />
    <path d="M400,380 C390,340 375,300 380,260 C370,300 380,350 395,395 Z" fill="url(#dragonBelly)" opacity="0.8" />

    <!-- Soft Dorsal Ridge / Miniature Scales along Spine -->
    <path d="M440,380 Q445,375 442,370 Q448,385 444,390 Q450,405 445,410 Q452,425 445,430 Q458,460 450,470 Q465,510 458,520" stroke="#ffc6ff" stroke-width="3" fill="none" filter="url(#glowSoft)" />

    <!-- Head Structure -->
    <g id="dragonHead">
      <!-- Main Head Shape -->
      <path d="M380,260 C370,245 340,240 310,255 C290,265 280,280 295,295 C315,310 350,310 385,290 C400,280 400,265 380,260 Z" fill="url(#dragonSkinHighlight)" />
      <!-- Cute Snout & Jaw -->
      <path d="M310,255 C295,260 280,270 285,282 C292,290 315,295 335,288 C320,285 305,280 300,272 C298,265 305,258 310,255 Z" fill="#4a1282" opacity="0.4" />
      <circle cx="298" cy="270" r="2" fill="#20053b" /> <!-- Nostril -->

      <!-- Main Horns / Ears (Cleaned & Crisp Structure) -->
      <!-- Back Horn -->
      <path d="M375,260 C390,210 430,160 470,130 C450,165 420,220 385,262 Z" fill="url(#hornGrad)" />
      <path d="M375,260 C390,210 430,160 470,130" stroke="#6d5485" stroke-width="1.5" fill="none" opacity="0.5" />
      <!-- Front Horn -->
      <path d="M365,265 C385,200 435,140 485,100 C460,145 420,215 378,270 Z" fill="url(#hornGrad)" />
      <path d="M365,265 C385,200 435,140 485,100" stroke="#e6d8f5" stroke-width="1.5" fill="none" opacity="0.6" />

      <!-- Cute Expressive Dragon Eye -->
      <g id="dragonEye">
        <!-- Socket/Shadow -->
        <ellipse cx="340" cy="268" rx="14" ry="17" fill="#1d0636" transform="rotate(-5, 340, 268)" />
        <!-- Iris (Deep Magenta / Violet Fire) -->
        <ellipse cx="340" cy="268" rx="12" ry="15" fill="url(#flowerPink)" transform="rotate(-5, 340, 268)" />
        <!-- Pupil -->
        <ellipse cx="339" cy="268" rx="5" ry="10" fill="#0f0217" />
        <!-- Catchlight Sparkles -->
        <circle cx="334" cy="261" r="4" fill="#ffffff" />
        <circle cx="344" cy="274" r="2" fill="#ffffff" />
        <circle cx="335" cy="273" r="1" fill="#ffffff" />
        <!-- Soft Eyeline & Lash -->
        <path d="M322,264 C330,248 350,248 356,260" stroke="#0f0217" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M352,254 L358,248" stroke="#0f0217" stroke-width="2.5" stroke-linecap="round" />
      </g>

      <!-- Soft Blush on Cheek -->
      <ellipse cx="345" cy="290" rx="10" ry="6" fill="#ff66c4" opacity="0.35" filter="url(#glowSoft)" />
    </g>
  </g>

  <!-- ==================== FRONT BUTTERFLY WINGS (DETAILED) ==================== -->
  <g id="dragonFrontWings">
    <!-- FRONT HINDWING -->
    <g id="frontHindwing">
      <!-- Base Translucent Wing Shape -->
      <path d="M480,480 C580,430 730,440 810,540 C870,620 830,750 710,770 C600,790 510,670 480,480 Z" fill="url(#wingBaseGrad)" opacity="0.9" />

      <!-- Wing Interior Glowing Panels -->
      <path d="M510,510 C590,460 700,470 760,540 C730,620 620,600 510,510 Z" fill="url(#wingGlowGrad)" />
      <path d="M520,540 C620,610 710,720 680,740 C600,750 530,660 520,540 Z" fill="url(#wingGlowGrad)" />

      <!-- Black Butterfly Border & Veins -->
      <path d="M480,480 C580,430 730,440 810,540 C870,620 830,750 710,770 C600,790 510,670 480,480 Z" stroke="#120a2a" stroke-width="8" fill="none" />
      <path d="M480,480 C570,510 680,520 810,540 M480,480 C540,570 620,650 710,770 M480,480 C590,560 750,650 830,640" stroke="#120a2a" stroke-width="4" fill="none" />

      <!-- White & Cyan Dots on Wing Rim -->
      <g fill="#ffffff" filter="url(#glowSoft)">
        <circle cx="780" cy="500" r="4" />
        <circle cx="815" cy="530" r="3" />
        <circle cx="838" cy="570" r="4.5" />
        <circle cx="845" cy="610" r="3.5" />
        <circle cx="830" cy="660" r="4" />
        <circle cx="800" cy="710" r="3" />
        <circle cx="760" cy="745" r="4" />
        <circle cx="715" cy="765" r="3" />
      </g>
    </g>

    <!-- FRONT FOREWING (DOMINANT) -->
    <g id="frontForewing">
      <!-- Base Translucent Wing Shape -->
      <path d="M450,440 C520,230 680,110 820,130 C930,145 960,280 860,390 C760,500 560,510 450,440 Z" fill="url(#wingBaseGrad)" />

      <!-- Radiant Stained-Glass Interior Glow Cells -->
      <path d="M480,410 C540,260 670,160 780,160 C740,240 620,280 480,410 Z" fill="url(#wingGlowGrad)" />
      <path d="M490,420 C620,290 760,250 860,250 C820,330 680,380 490,420 Z" fill="url(#wingGlowGrad)" />
      <path d="M500,435 C660,370 820,350 860,370 C790,440 640,470 500,435 Z" fill="url(#wingGlowGrad)" />

      <!-- Major Wing Veins Pattern -->
      <path d="M450,440 C520,230 680,110 820,130 C930,145 960,280 860,390 C760,500 560,510 450,440 Z" stroke="#0d0620" stroke-width="11" fill="none" />
      <path d="M450,440 C570,280 690,170 820,130 M450,440 C610,300 760,230 900,220 M450,440 C630,340 790,320 920,310 M450,440 C600,410 750,420 860,390" stroke="#0d0620" stroke-width="5" fill="none" />

      <!-- Elegant Lace/Vein Branches -->
      <path d="M680,180 C740,220 810,230 880,200 M650,280 C730,310 820,300 890,270 M620,360 C700,390 780,390 850,360" stroke="#170b36" stroke-width="3" fill="none" />

      <!-- Luminous Butterfly Dots & Spots along Margins -->
      <g fill="#ffffff" filter="url(#glowSoft)">
        <!-- Outer Edge Spot Series -->
        <circle cx="840" cy="140" r="5" />
        <circle cx="875" cy="160" r="4" />
        <circle cx="910" cy="190" r="5.5" />
        <circle cx="935" cy="230" r="4" />
        <circle cx="945" cy="270" r="5" />
        <circle cx="930" cy="315" r="4" />
        <circle cx="900" cy="355" r="5" />
        <circle cx="860" cy="390" r="4" />

        <!-- Inner Cyan Accent Jewels -->
        <circle cx="810" cy="170" r="3" fill="#80e5ff" />
        <circle cx="860" cy="210" r="3.5" fill="#80e5ff" />
        <circle cx="890" cy="250" r="3" fill="#80e5ff" />
        <circle cx="870" cy="330" r="3.5" fill="#80e5ff" />
      </g>
    </g>
  </g>

  <!-- ==================== FLOWERS ON DRAGON ==================== -->
  <g id="dragonFlowers">
    <!-- Flowers on Head -->
    <use href="#blueFlower" x="360" y="255" transform="scale(1.2)" />
    <use href="#blueFlower" x="410" y="250" transform="scale(1.1)" />
    <use href="#blueFlower" x="460" y="215" transform="scale(0.8)" />

    <!-- Flowers down Neck & Chest -->
    <use href="#blueFlower" x="400" y="365" transform="scale(0.95)" />
    <use href="#blueFlower" x="410" y="470" transform="scale(1)" />

    <!-- Tail Flowers -->
    <use href="#blueFlower" x="650" y="700" transform="scale(1)" />
    <use href="#blueFlower" x="775" y="665" transform="scale(1.1)" />
    <use href="#blueFlower" x="800" y="525" transform="scale(1)" />
    <use href="#blueFlower" x="675" y="505" transform="scale(0.8)" />
    <use href="#blueFlower" x="760" y="590" transform="scale(1.1)" />
  </g>

  <!-- ==================== FOREGROUND MAGIC & SPARKLES ==================== -->
  <g id="fairyMagicSparks">
    <!-- Swirling Magic Dust Trail (From Wings & Tail - Kept Clear of Head) -->
    <path d="M850,200 C920,300 850,450 900,550 C930,620 880,720 800,800" stroke="url(#wingGlowGrad)" stroke-width="6" stroke-dasharray="4,12" stroke-linecap="round" fill="none" filter="url(#glowIntense)" />

    <!-- Individual Sparkle Stars (Positioned gracefully around body/wings) -->
    <use href="#sparkle" x="250" y="240" transform="scale(0.8)" />
    <use href="#sparkle" x="880" y="150" transform="scale(1.4)" />
    <use href="#sparkle" x="940" y="280" transform="scale(0.9)" />
    <use href="#sparkle" x="870" y="420" transform="scale(1.1)" />
    <use href="#sparkle" x="920" y="580" transform="scale(1.3)" />
    <use href="#sparkle" x="810" y="750" transform="scale(1)" />
    <use href="#sparkle" x="650" y="470" transform="scale(0.7)" />
    <use href="#sparkle" x="320" y="720" transform="scale(0.9)" />

    <!-- Glowing Magic Orbs / Pollen Dust -->
    <g fill="#ffffff" filter="url(#glowIntense)">
      <circle cx="270" cy="260" r="3" />
      <circle cx="750" cy="100" r="3" />
      <circle cx="850" cy="110" r="5" />
      <circle cx="920" cy="220" r="3.5" />
      <circle cx="960" cy="340" r="4" />
      <circle cx="890" cy="480" r="5" />
      <circle cx="940" cy="640" r="3" />
      <circle cx="840" cy="790" r="4.5" />
      <circle cx="720" cy="850" r="3" />
      <circle cx="260" cy="780" r="4" />
      <circle cx="580" cy="760" r="3.5" />
      <circle cx="360" cy="310" r="2.5" fill="#a0c4ff" />
      <circle cx="790" cy="400" r="3" fill="#ffc6ff" />
    </g>
  </g>
</svg>` 
            },
            { 
                id: 'm-kitsune', 
                name: 'Aegis Kitsune', 
                tier: 3, 
                unlockSec: 72000, 
                shapes: '50 Shapes', 
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <defs>
    <!-- Imperial Aegis Gold Gradient -->
    <linearGradient id="aegisGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff2a3" />
      <stop offset="25%" stop-color="#f5cc45" />
      <stop offset="50%" stop-color="#d49e1e" />
      <stop offset="75%" stop-color="#8a5a08" />
      <stop offset="100%" stop-color="#422500" />
    </linearGradient>

    <!-- Bright Gold Highlight Gradient -->
    <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#ffe875" />
      <stop offset="100%" stop-color="#c79113" />
    </linearGradient>

    <!-- Pearlescent White Fur Gradient -->
    <linearGradient id="foxFurWhite" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#f0f4ff" />
      <stop offset="75%" stop-color="#cbd5f0" />
      <stop offset="100%" stop-color="#93a2c7" />
    </linearGradient>

    <!-- Fur Shadow / Accent Gradient -->
    <linearGradient id="foxFurShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#707da0" />
      <stop offset="50%" stop-color="#465275" />
      <stop offset="100%" stop-color="#232a45" />
    </linearGradient>

    <!-- Divine Cyan Kitsunebi Fire Gradient -->
    <linearGradient id="kitsunebiCyan" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#003b80" />
      <stop offset="25%" stop-color="#0088ff" />
      <stop offset="60%" stop-color="#00f0ff" />
      <stop offset="90%" stop-color="#ccf8ff" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>

    <!-- Tail Base Gradient -->
    <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#d8e2fd" />
      <stop offset="80%" stop-color="#7389c2" />
      <stop offset="100%" stop-color="#2b3863" />
    </linearGradient>

    <!-- Filters for Divine Glow -->
    <filter id="glowSoft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="glowIntense" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="14" result="blur1" />
      <feGaussianBlur stdDeviation="28" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- REUSABLE SYMBOLS -->
    <!-- Magatama Bead -->
    <g id="magatama">
      <path d="M 0,-15 C -10,-15 -15,-5 -15,5 C -15,18 -2,25 0,35 C 2,25 15,18 15,5 C 15,-5 10,-15 0,-15 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />
      <circle cx="0" cy="-3" r="4" fill="#111736" />
    </g>

    <!-- Kitsunebi Flame Orb -->
    <g id="kitsunebiOrb">
      <circle cx="0" cy="0" r="18" fill="url(#kitsunebiCyan)" filter="url(#glowIntense)" />
      <circle cx="0" cy="0" r="8" fill="#ffffff" filter="url(#glowSoft)" />
      <path d="M 0,-18 C 10,-35 25,-25 0,-50 C -25,-25 -10,-35 0,-18 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />
    </g>

    <!-- Single Tail Template (Symmetrical Curve) -->
    <g id="tailSegment">
      <path d="M500,680 C380,630 220,530 150,380 C100,270 120,150 220,100 C280,70 330,110 320,170 C300,270 420,450 500,530 Z" fill="url(#tailGrad)" />
      <!-- Tail Tip Flame Overlay -->
      <path d="M150,380 C100,270 120,150 220,100 C280,70 330,110 320,170 C280,180 200,280 230,360 Z" fill="url(#kitsunebiCyan)" opacity="0.85" filter="url(#glowSoft)" />
    </g>
  </defs>

  <!-- ==================== NINE KITSUNE TAILS ==================== -->
  <g id="nineTails">
    <!-- Tail 1 (Far Left Bottom) -->
    <path d="M480,680 C300,720 100,620 40,460 C-10,330 40,210 150,220 C220,225 240,290 200,350 C130,450 320,600 480,680 Z" fill="url(#tailGrad)" />
    <path d="M40,460 C-10,330 40,210 150,220 C180,222 195,250 180,280 C110,320 50,380 80,450 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />

    <!-- Tail 2 (Left Mid-Low) -->
    <path d="M480,680 C260,650 80,500 50,340 C20,210 120,110 210,140 C270,160 260,240 220,300 C150,400 330,570 480,680 Z" fill="url(#tailGrad)" />
    <path d="M50,340 C20,210 120,110 210,140 C235,148 240,180 215,210 C150,250 90,300 110,360 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />

    <!-- Tail 3 (Left Mid-High) -->
    <path d="M490,670 C300,580 120,390 130,220 C140,80 270,30 330,100 C370,150 330,230 270,280 C180,360 360,540 490,670 Z" fill="url(#tailGrad)" />
    <path d="M130,220 C140,80 270,30 330,100 C350,120 335,155 305,175 C230,210 180,240 180,300 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />

    <!-- Tail 4 (Left High) -->
    <path d="M495,660 C360,500 220,300 280,130 C320,10 430,-10 460,70 C480,120 420,190 350,230 C250,290 420,490 495,660 Z" fill="url(#tailGrad)" />
    <path d="M280,130 C320,10 430,-10 460,70 C475,95 450,125 415,145 C340,180 300,220 310,270 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />

    <!-- Tail 5 (Center Crown Tail) -->
    <path d="M500,650 C440,460 410,240 470,60 C500,-30 540,-30 570,60 C630,240 600,460 500,650 Z" fill="url(#tailGrad)" />
    <path d="M470,60 C500,-30 540,-30 570,60 C580,90 550,130 520,150 C490,130 460,90 470,60 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />

    <!-- Tail 6 (Right High - Mirrored) -->
    <path d="M505,660 C640,500 780,300 720,130 C680,10 570,-10 540,70 C520,120 580,190 650,230 C750,290 580,490 505,660 Z" fill="url(#tailGrad)" />
    <path d="M720,130 C680,10 570,-10 540,70 C525,95 550,125 585,145 C660,180 700,220 690,270 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />

    <!-- Tail 7 (Right Mid-High - Mirrored) -->
    <path d="M510,670 C700,580 880,390 870,220 C860,80 730,30 670,100 C630,150 670,230 730,280 C820,360 640,540 510,670 Z" fill="url(#tailGrad)" />
    <path d="M870,220 C860,80 730,30 670,100 C650,120 665,155 695,175 C770,210 820,240 820,300 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />

    <!-- Tail 8 (Right Mid-Low - Mirrored) -->
    <path d="M520,680 C740,650 920,500 950,340 C980,210 880,110 790,140 C730,160 740,240 780,300 C850,400 670,570 520,680 Z" fill="url(#tailGrad)" />
    <path d="M950,340 C980,210 880,110 790,140 C765,148 760,180 785,210 C850,250 910,300 890,360 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />

    <!-- Tail 9 (Right Bottom - Mirrored) -->
    <path d="M520,680 C700,720 900,620 960,460 C1010,330 960,210 850,220 C780,225 760,290 800,350 C870,450 680,600 520,680 Z" fill="url(#tailGrad)" />
    <path d="M960,460 C1010,330 960,210 850,220 C820,222 805,250 820,280 C890,320 950,380 920,450 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />
  </g>

  <!-- Tail Base Sacred Ring / Golden Binding -->
  <ellipse cx="500" cy="670" rx="70" ry="25" fill="url(#aegisGold)" stroke="#ffffff" stroke-width="2" filter="url(#glowSoft)" />

  <!-- ==================== KITSUNE MAIN BODY ==================== -->
  <g id="kitsuneBody">
    <!-- Haunches / Hind Legs (Noble Seated Pose) -->
    <path d="M370,640 C340,680 330,760 380,830 C420,880 460,880 470,820 C480,750 430,680 370,640 Z" fill="url(#foxFurShadow)" />
    <path d="M630,640 C660,680 670,760 620,830 C580,880 540,880 530,820 C520,750 570,680 630,640 Z" fill="url(#foxFurShadow)" />

    <!-- Main Torso / Back Body -->
    <path d="M420,500 C400,580 410,680 450,820 C470,870 530,870 550,820 C590,680 600,580 580,500 C540,460 460,460 420,500 Z" fill="url(#foxFurWhite)" />

    <!-- Chest & Underbelly Fluff -->
    <path d="M450,480 C420,550 440,650 500,750 C560,650 580,550 550,480 C520,440 480,440 450,480 Z" fill="#ffffff" />
    <path d="M470,500 C450,560 470,630 500,680 C530,630 550,560 530,500 C510,480 490,480 470,500 Z" fill="url(#foxFurWhite)" />

    <!-- Front Legs / Paws -->
    <path d="M440,650 L430,840 C430,860 455,860 460,840 L470,670 Z" fill="url(#foxFurWhite)" />
    <path d="M560,650 L570,840 C570,860 545,860 540,840 L530,670 Z" fill="url(#foxFurWhite)" />

    <!-- Aegis Armored Greaves on Front Legs -->
    <path d="M433,720 L427,810 C427,825 463,825 463,810 L467,730 Z" fill="url(#aegisGold)" stroke="#ffffff" stroke-width="1" />
    <path d="M567,720 L573,810 C573,825 537,825 537,810 L533,730 Z" fill="url(#aegisGold)" stroke="#ffffff" stroke-width="1" />
  </g>

  <!-- ==================== AEGIS BREASTPLATE & NECK ARMOR ==================== -->
  <g id="aegisChestArmor">
    <!-- Imperial Gold Cuirass / Collar -->
    <path d="M430,480 C470,450 530,450 570,480 C590,530 560,600 500,640 C440,600 410,530 430,480 Z" fill="url(#aegisGold)" />

    <!-- Inner Shield Gem Layer -->
    <path d="M450,490 C480,470 520,470 550,490 C565,530 540,580 500,610 C460,580 435,530 450,490 Z" fill="#111736" stroke="url(#goldHighlight)" stroke-width="2" />

    <!-- Central Aegis Core Crystal (Cyan Aegis Eye) -->
    <polygon points="500,500 530,535 500,580 470,535" fill="url(#kitsunebiCyan)" filter="url(#glowIntense)" />
    <polygon points="500,515 515,535 500,560 485,535" fill="#ffffff" />

    <!-- Winged Shoulder Pauldrons (Left & Right) -->
    <!-- Left Pauldron -->
    <path d="M430,470 C380,450 340,490 370,550 C410,560 430,520 440,490 Z" fill="url(#aegisGold)" stroke="#ffffff" stroke-width="1" />
    <path d="M410,480 C380,470 360,495 380,535 C405,540 420,515 425,495 Z" fill="url(#kitsunebiCyan)" opacity="0.8" filter="url(#glowSoft)" />

    <!-- Right Pauldron -->
    <path d="M570,470 C620,450 660,490 630,550 C590,560 570,520 560,490 Z" fill="url(#aegisGold)" stroke="#ffffff" stroke-width="1" />
    <path d="M590,480 C620,470 640,495 620,535 C595,540 580,515 575,495 Z" fill="url(#kitsunebiCyan)" opacity="0.8" filter="url(#glowSoft)" />

    <!-- Sacred Shimenawa / Magatama Beads Garland around Neck -->
    <path d="M410,440 C460,470 540,470 590,440" stroke="#ffffff" stroke-width="6" stroke-dasharray="12,12" fill="none" filter="url(#glowSoft)" />
    <use href="#magatama" x="440" y="465" transform="scale(0.7)" />
    <use href="#magatama" x="500" y="480" transform="scale(0.85)" />
    <use href="#magatama" x="560" y="465" transform="scale(0.7)" />
  </g>

  <!-- ==================== HEAD & AEGIS HELM / MASK ==================== -->
  <g id="kitsuneHead">
    <!-- Neck Fur Base -->
    <path d="M440,440 C430,360 470,330 500,330 C530,330 570,360 560,440 Z" fill="url(#foxFurWhite)" />

    <!-- Long Fox Ears (Ethereal & Armored) -->
    <!-- Left Ear Back/Base -->
    <path d="M430,280 C390,180 320,80 290,40 C330,100 410,220 445,260 Z" fill="url(#foxFurShadow)" />
    <path d="M425,275 C390,185 330,95 305,60 C335,110 405,215 435,255 Z" fill="url(#kitsunebiCyan)" opacity="0.85" filter="url(#glowSoft)" />

    <!-- Right Ear Back/Base -->
    <path d="M570,280 C610,180 680,80 710,40 C670,100 590,220 555,260 Z" fill="url(#foxFurShadow)" />
    <path d="M575,275 C610,185 670,95 695,60 C665,110 595,215 565,255 Z" fill="url(#kitsunebiCyan)" opacity="0.85" filter="url(#glowSoft)" />

    <!-- Ear Aegis Armor Wing Tips -->
    <path d="M430,270 L340,110 L370,90 L445,230 Z" fill="url(#aegisGold)" stroke="#ffffff" stroke-width="1" />
    <path d="M570,270 L660,110 L630,90 L555,230 Z" fill="url(#aegisGold)" stroke="#ffffff" stroke-width="1" />

    <!-- Main Vulpine Head Structure -->
    <path d="M420,310 C400,260 450,220 500,220 C550,220 600,260 580,310 C570,360 535,400 500,400 C465,400 430,360 420,310 Z" fill="url(#foxFurWhite)" />

    <!-- Cheek Tufts (Vulpine Fur Flares) -->
    <path d="M420,310 L360,330 L410,350 L370,380 L430,385 Z" fill="url(#foxFurWhite)" />
    <path d="M580,310 L640,330 L590,350 L630,380 L570,385 Z" fill="url(#foxFurWhite)" />

    <!-- Muzzle / Snout -->
    <path d="M465,330 C480,330 485,375 500,380 C515,375 520,330 535,330 C545,360 525,410 500,412 C475,410 455,360 465,330 Z" fill="#ffffff" />
    <!-- Fox Nose (Golden Aegis Alloy) -->
    <path d="M492,382 C495,378 505,378 508,382 L502,390 Z" fill="url(#aegisGold)" filter="url(#glowSoft)" />

    <!-- Glowing Kitsune Eyes (Cyan Solar Flame) -->
    <!-- Left Eye -->
    <g id="leftEye">
      <path d="M440,305 C455,295 475,305 475,315 C460,322 445,318 440,305 Z" fill="#0a0d24" />
      <path d="M445,307 C455,300 470,307 472,313 C460,318 450,315 445,307 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />
      <ellipse cx="458" cy="310" rx="2" ry="4" fill="#ffffff" />
      <!-- Eyebrow Mark / Red-Gold Kitsune Arc -->
      <path d="M440,295 C455,288 470,292 475,298" stroke="url(#aegisGold)" stroke-width="3" fill="none" />
    </g>

    <!-- Right Eye -->
    <g id="rightEye">
      <path d="M560,305 C545,295 525,305 525,315 C540,322 555,318 560,305 Z" fill="#0a0d24" />
      <path d="M555,307 C545,300 530,307 528,313 C540,318 550,315 555,307 Z" fill="url(#kitsunebiCyan)" filter="url(#glowSoft)" />
      <ellipse cx="542" cy="310" rx="2" ry="4" fill="#ffffff" />
      <!-- Eyebrow Mark -->
      <path d="M560,295 C545,288 530,292 525,298" stroke="url(#aegisGold)" stroke-width="3" fill="none" />
    </g>

    <!-- Forehead Aegis Tiara / Crest of Protection -->
    <g id="aegisCrown">
      <!-- Crown Base Frame -->
      <path d="M450,260 C480,245 520,245 550,260 L560,230 L500,200 L440,230 Z" fill="url(#aegisGold)" stroke="#ffffff" stroke-width="1" />
      <!-- Central Third-Eye Gem -->
      <circle cx="500" cy="240" r="12" fill="#111736" stroke="url(#aegisGold)" stroke-width="2" />
      <circle cx="500" cy="240" r="7" fill="url(#kitsunebiCyan)" filter="url(#glowIntense)" />
      <!-- Radiant Spire Crescent -->
      <path d="M500,180 L510,210 L500,205 L490,210 Z" fill="url(#goldHighlight)" filter="url(#glowSoft)" />
    </g>
  </g>

  <!-- ==================== FOREGROUND FLOATING KITSUNEBI & SHIELD SHARDS ==================== -->
  <g id="foregroundEffects">
    <!-- Floating Kitsunebi Orbs -->
    <use href="#kitsunebiOrb" x="220" y="550" transform="scale(0.8)" />
    <use href="#kitsunebiOrb" x="780" y="550" transform="scale(0.8)" />
    <use href="#kitsunebiOrb" x="180" y="280" transform="scale(0.6)" />
    <use href="#kitsunebiOrb" x="820" y="280" transform="scale(0.6)" />
    <use href="#kitsunebiOrb" x="500" y="120" transform="scale(1)" />

    <!-- Floating Aegis Energy Runic Crystals / Shield Shards -->
    <g fill="url(#aegisGold)" stroke="#ffffff" stroke-width="1" filter="url(#glowSoft)" opacity="0.85">
      <!-- Left Floating Shards -->
      <polygon points="150,420 170,400 165,435 145,445" />
      <polygon points="280,680 300,655 295,695 270,705" />
      <polygon points="230,200 245,180 240,215 220,220" />

      <!-- Right Floating Shards -->
      <polygon points="850,420 830,400 835,435 855,445" />
      <polygon points="720,680 700,655 705,695 730,705" />
      <polygon points="770,200 755,180 760,215 780,220" />
    </g>

    <!-- Golden Sacred Dust & Light Particles -->
    <g fill="#ffffff" filter="url(#glowIntense)">
      <circle cx="500" cy="300" r="3" />
      <circle cx="460" cy="210" r="2" />
      <circle cx="540" cy="210" r="2.5" />
      <circle cx="320" cy="450" r="4" fill="url(#kitsunebiCyan)" />
      <circle cx="680" cy="450" r="4" fill="url(#kitsunebiCyan)" />
      <circle cx="210" cy="620" r="3" />
      <circle cx="790" cy="620" r="3" />
      <circle cx="500" cy="780" r="3.5" fill="url(#kitsunebiCyan)" />
      <circle cx="380" cy="820" r="2" />
      <circle cx="620" cy="820" r="2" />
    </g>
  </g>
</svg>
` 
            },
            { 
                id: 'm-pirate', 
                name: 'Pirate Penguin', 
                tier: 3, 
                unlockSec: 86400, 
                shapes: '49 Shapes', 
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <defs>
    <!-- Penguin Body Feathers Gradient -->
    <linearGradient id="penguinDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2c3545" />
      <stop offset="35%" stop-color="#1a202c" />
      <stop offset="80%" stop-color="#0f131d" />
      <stop offset="100%" stop-color="#06080e" />
    </linearGradient>

    <linearGradient id="penguinWhite" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="65%" stop-color="#edf2f7" />
      <stop offset="85%" stop-color="#cbd5e0" />
      <stop offset="100%" stop-color="#90a0b7" />
    </linearGradient>

    <!-- Beak & Feet Orange Gradient -->
    <linearGradient id="beakOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffaa00" />
      <stop offset="45%" stop-color="#ff7700" />
      <stop offset="90%" stop-color="#d94b00" />
      <stop offset="100%" stop-color="#802000" />
    </linearGradient>

    <!-- Captain's Velvet Coat (Deep Crimson) -->
    <linearGradient id="coatRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a81327" />
      <stop offset="40%" stop-color="#780a18" />
      <stop offset="80%" stop-color="#4a020b" />
      <stop offset="100%" stop-color="#240004" />
    </linearGradient>

    <!-- Imperial Gold Trim Gradient -->
    <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff3a1" />
      <stop offset="30%" stop-color="#f2c94c" />
      <stop offset="70%" stop-color="#f2994a" />
      <stop offset="100%" stop-color="#965200" />
    </linearGradient>

    <!-- Metallic Silver Hook & Cutlass Gradient -->
    <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#e2e8f0" />
      <stop offset="50%" stop-color="#94a3b8" />
      <stop offset="75%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>

    <!-- Leather Strap Gradient -->
    <linearGradient id="leatherBrown" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5c3a21" />
      <stop offset="50%" stop-color="#3d2412" />
      <stop offset="100%" stop-color="#1f1006" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity="0.6" />
    </filter>

    <!-- Reusable Gold Coin -->
    <g id="goldCoin">
      <ellipse cx="0" cy="0" rx="14" ry="8" fill="url(#goldTrim)" stroke="#804e00" stroke-width="1" />
      <ellipse cx="0" cy="-1" rx="10" ry="5" fill="none" stroke="#fff3a1" stroke-width="0.8" opacity="0.9" />
    </g>
  </defs>

  <!-- ==================== SWASHBUCKLING PIRATE PENGUIN ==================== -->
  <g id="piratePenguin" filter="url(#dropShadow)">

    <!-- PENGUIN TAIL -->
    <path d="M 330,710 C 260,720 220,750 200,780 C 250,790 310,770 350,740 Z" fill="url(#penguinDark)" stroke="#0f131d" stroke-width="3" />

    <!-- FEET (Webbed Pirate Feet) -->
    <!-- Left Foot -->
    <g id="leftFoot">
      <path d="M 380,810 C 350,810 300,830 280,855 C 320,865 360,865 390,850 C 410,840 420,820 380,810 Z" fill="url(#beakOrange)" stroke="#591600" stroke-width="3" />
      <path d="M 280,855 L 272,860 M 318,865 L 315,872 M 360,865 L 362,872" stroke="#330d00" stroke-width="3" stroke-linecap="round" />
    </g>

    <!-- Right Foot -->
    <g id="rightFoot">
      <path d="M 580,810 C 610,810 660,830 680,855 C 640,865 600,865 570,850 C 550,840 540,820 580,810 Z" fill="url(#beakOrange)" stroke="#591600" stroke-width="3" />
      <path d="M 680,855 L 688,860 M 642,865 L 645,872 M 600,865 L 598,872" stroke="#330d00" stroke-width="3" stroke-linecap="round" />
    </g>

    <!-- TREASURE CHEST UNDER LEFT FLIPPER (VIEWER'S RIGHT) -->
    <g id="treasureChest" transform="translate(630, 710)">
      <!-- Main Wood Box -->
      <rect x="0" y="40" width="145" height="90" rx="6" fill="#2d170b" stroke="#120703" stroke-width="3" />
      <!-- Chest Lid (Slightly Open Overflowing) -->
      <path d="M -6,40 C -6,5 151,5 151,40 Z" fill="#3d2110" stroke="#120703" stroke-width="3" />
      
      <!-- Overflowing Gold Coins & Jewels from Chest Rim -->
      <use href="#goldCoin" x="20" y="34" transform="rotate(-10, 20, 34)" />
      <use href="#goldCoin" x="42" y="28" transform="rotate(15, 42, 28)" />
      <use href="#goldCoin" x="68" y="26" />
      <use href="#goldCoin" x="92" y="30" transform="rotate(-8, 92, 30)" />
      <use href="#goldCoin" x="118" y="35" transform="rotate(20, 118, 35)" />
      <circle cx="55" cy="20" r="6" fill="#ff0055" filter="url(#softGlow)" />
      <circle cx="80" cy="18" r="5" fill="#00e5ff" filter="url(#softGlow)" />
      <polygon points="105,15 111,22 105,29 99,22" fill="#ffd700" />

      <!-- Gold Straps & Iron Trim -->
      <rect x="20" y="40" width="16" height="90" fill="url(#goldTrim)" />
      <rect x="109" y="40" width="16" height="90" fill="url(#goldTrim)" />
      <path d="M 10,18 C 10,18 135,18 135,18" stroke="url(#goldTrim)" stroke-width="12" fill="none" />
      <!-- Keyhole Lock Plate -->
      <rect x="62" y="58" width="22" height="28" rx="3" fill="url(#goldTrim)" stroke="#593400" stroke-width="1.5" />
      <circle cx="73" cy="67" r="4" fill="#000000" />
      <polygon points="71,69 75,69 76,79 70,79" fill="#000000" />
    </g>

    <!-- MAIN BODY (Base Dark Feathers) -->
    <path d="M 320,450 C 260,530 270,720 360,810 C 420,850 580,850 640,810 C 730,720 740,530 680,450 C 630,380 370,380 320,450 Z" fill="url(#penguinDark)" stroke="#090d14" stroke-width="4" />

    <!-- CAPTAIN'S RED VELVET COAT (Back/Sides) -->
    <!-- Left Coat Wing -->
    <path d="M 330,460 C 280,500 230,600 220,720 C 250,750 310,760 330,720 C 310,640 330,530 350,470 Z" fill="url(#coatRed)" stroke="#1a0003" stroke-width="3" />
    <path d="M 220,720 C 250,750 310,760 330,720" stroke="url(#goldTrim)" stroke-width="6" fill="none" />

    <!-- Right Coat Wing -->
    <path d="M 670,460 C 720,500 770,600 780,720 C 750,750 690,760 670,720 C 690,640 670,530 650,470 Z" fill="url(#coatRed)" stroke="#1a0003" stroke-width="3" />
    <path d="M 780,720 C 750,750 690,760 670,720" stroke="url(#goldTrim)" stroke-width="6" fill="none" />

    <!-- WHITE PENGUIN BELLY / CHEST -->
    <path d="M 360,460 C 340,540 350,720 420,800 C 470,820 530,820 580,800 C 650,720 660,540 640,460 C 580,420 420,420 360,460 Z" fill="url(#penguinWhite)" />

    <!-- TREASURE ON SHOULDER (Right Shoulder / Viewer's Left) -->
    <g id="shoulderTreasure" transform="translate(315, 435)">
      <!-- Draped Gold Necklace Chains -->
      <path d="M 10,25 Q 35,50 60,30" stroke="url(#goldTrim)" stroke-width="5" fill="none" stroke-dasharray="6,3" />
      <path d="M 18,35 Q 38,60 55,42" stroke="url(#goldTrim)" stroke-width="4" fill="none" stroke-dasharray="5,2" />
      <!-- Pile of Gold Coins Resting on Epaulette/Shoulder -->
      <use href="#goldCoin" x="15" y="18" transform="rotate(-20, 15, 18)" />
      <use href="#goldCoin" x="32" y="12" transform="rotate(10, 32, 12)" />
      <use href="#goldCoin" x="22" y="5" transform="rotate(-5, 22, 5)" />
      <use href="#goldCoin" x="42" y="18" transform="rotate(30, 42, 18)" />
      <use href="#goldCoin" x="30" y="-3" transform="rotate(15, 30, -3)" />
      <!-- Sparkling Gems on Shoulder -->
      <polygon points="38,2 45,9 38,16 31,9" fill="#ff0044" filter="url(#softGlow)" />
      <circle cx="16" cy="10" r="4" fill="#00d4ff" filter="url(#softGlow)" />
      <circle cx="48" cy="22" r="3.5" fill="#00ff88" />
    </g>

    <!-- PIRATE SASH & BELT SYSTEM -->
    <!-- Crimson Waist Sash -->
    <path d="M 345,670 Q 500,720 655,670 L 660,710 Q 500,760 340,710 Z" fill="url(#coatRed)" />
    <path d="M 620,700 C 640,740 650,790 660,830 L 620,820 C 610,780 600,740 590,700 Z" fill="url(#coatRed)" opacity="0.9" />

    <!-- Leather Cross-Belt (Bandolier) -->
    <path d="M 370,460 L 610,690 L 570,720 L 340,480 Z" fill="url(#leatherBrown)" stroke="#120904" stroke-width="2" />
    <!-- Cross-Belt Gold Studs -->
    <circle cx="390" cy="490" r="4" fill="url(#goldTrim)" />
    <circle cx="430" cy="530" r="4" fill="url(#goldTrim)" />
    <circle cx="470" cy="570" r="4" fill="url(#goldTrim)" />
    <circle cx="510" cy="610" r="4" fill="url(#goldTrim)" />
    <circle cx="550" cy="650" r="4" fill="url(#goldTrim)" />

    <!-- Main Waist Leather Belt -->
    <path d="M 348,680 Q 500,725 652,680 L 650,705 Q 500,750 350,705 Z" fill="url(#leatherBrown)" stroke="#120904" stroke-width="2" />

    <!-- Gold Belt Buckle -->
    <rect x="460" y="680" width="80" height="55" rx="8" fill="url(#goldTrim)" stroke="#593400" stroke-width="3" />
    <rect x="475" y="692" width="50" height="31" rx="4" fill="#120904" />
    <rect x="495" y="688" width="20" height="8" fill="url(#goldTrim)" />

    <!-- PENGUIN HEAD -->
    <path d="M 340,360 C 320,240 400,190 500,190 C 600,190 680,240 660,360 C 650,440 350,440 340,360 Z" fill="url(#penguinDark)" stroke="#090d14" stroke-width="3" />

    <!-- White Face Marking (Penguin Eye Mask Area) -->
    <path d="M 380,360 C 370,280 430,260 500,310 C 570,260 630,280 620,360 C 600,410 400,410 380,360 Z" fill="url(#penguinWhite)" />

    <!-- SWASHBUCKLING BEAK -->
    <g id="beak">
      <path d="M 450,330 C 480,320 520,320 550,330 C 570,360 540,395 500,400 C 460,395 430,360 450,330 Z" fill="url(#beakOrange)" stroke="#4d1600" stroke-width="3" />
      <path d="M 445,345 C 480,355 520,355 555,345 C 530,375 470,375 445,345 Z" fill="#2b0d00" />
      <ellipse cx="480" cy="338" rx="4" ry="2" fill="#2b0d00" />
    </g>

    <!-- LEFT EYE (Determined Pirate Glare) -->
    <g id="visibleEye">
      <ellipse cx="560" cy="315" rx="22" ry="26" fill="#ffffff" stroke="#1a202c" stroke-width="3" />
      <ellipse cx="555" cy="315" rx="13" ry="16" fill="#b35900" />
      <ellipse cx="555" cy="315" rx="8" ry="11" fill="#0d0000" />
      <circle cx="550" cy="308" r="4" fill="#ffffff" />
      <circle cx="560" cy="322" r="2" fill="#ffffff" />
      <path d="M 525,290 C 550,295 580,280 590,275 C 580,285 550,300 525,295 Z" fill="url(#penguinDark)" />
    </g>

    <!-- RIGHT EYE - PIRATE EYEPATCH -->
    <g id="eyepatch">
      <path d="M 350,310 Q 500,310 650,340" stroke="#0f0804" stroke-width="6" fill="none" />
      <path d="M 400,260 L 480,360" stroke="#0f0804" stroke-width="5" fill="none" />
      <path d="M 415,310 C 415,285 465,285 465,310 C 465,345 415,345 415,310 Z" fill="#17110d" stroke="#000000" stroke-width="4" />
      <circle cx="440" cy="310" r="4" fill="url(#goldTrim)" />
    </g>

    <!-- ==================== LEFT ARM: THE HOOK ==================== -->
    <g id="hookArm">
      <path d="M 330,480 C 270,500 240,560 250,610 L 290,610 C 290,560 320,520 350,490 Z" fill="url(#penguinDark)" stroke="#090d14" stroke-width="3" />
      <path d="M 240,590 L 295,590 L 305,640 L 230,640 Z" fill="url(#leatherBrown)" stroke="#0f0804" stroke-width="3" />
      <path d="M 235,610 L 300,610" stroke="url(#goldTrim)" stroke-width="6" />
      <circle cx="248" cy="610" r="2.5" fill="#000000" />
      <circle cx="268" cy="610" r="2.5" fill="#000000" />
      <circle cx="288" cy="610" r="2.5" fill="#000000" />

      <!-- THE DEADLY SHINY HOOK -->
      <path d="M 267,640 L 267,670" stroke="url(#metalSilver)" stroke-width="18" stroke-linecap="round" />
      <path d="M 267,665 C 267,740 170,720 170,640 C 170,580 230,550 235,555 C 240,560 230,575 215,585 C 190,600 190,640 205,660 C 220,685 242,670 242,650 Z" fill="url(#metalSilver)" stroke="#334155" stroke-width="2" filter="url(#softGlow)" />
    </g>

    <!-- ==================== RIGHT ARM: HOLDING CUTLASS POINTING UPWARDS ==================== -->
    <g id="cutlassArm">
      <!-- Raised Left Flipper (Viewer's Right) -->
      <path d="M 665,470 C 725,485 770,525 785,585 C 755,600 710,575 680,525 C 665,500 660,485 665,470 Z" fill="url(#penguinDark)" stroke="#090d14" stroke-width="3" />

      <!-- PIRATE CUTLASS SWORD (POINTING UPWARDS) -->
      <g id="cutlass" transform="rotate(-75, 750, 560)">
        <!-- Curved Blade Pointing Skyward -->
        <path d="M 760,560 C 780,440 840,280 930,200 C 870,320 830,460 780,560 Z" fill="url(#metalSilver)" stroke="#475569" stroke-width="2" filter="url(#softGlow)" />
        <!-- Sharp Edge Highlight -->
        <path d="M 760,560 C 780,440 840,280 930,200" stroke="#ffffff" stroke-width="3" fill="none" />

        <!-- Gold Basket Hilt Guard -->
        <path d="M 740,550 C 730,590 780,620 800,580 C 810,560 790,540 770,545 Z" fill="url(#goldTrim)" stroke="#593400" stroke-width="2" />
        <!-- Handle Grip -->
        <rect x="755" y="555" width="12" height="30" rx="3" fill="#2d170b" transform="rotate(20, 755, 555)" />
        <!-- Pommel Ball -->
        <circle cx="750" cy="590" r="10" fill="url(#goldTrim)" stroke="#593400" stroke-width="2" />
      </g>
    </g>

    <!-- ==================== SKULL TRICORNE HAT ==================== -->
    <g id="tricorneHat">
      <g id="feather" transform="rotate(-15, 360, 210)">
        <path d="M 360,210 C 310,150 250,110 200,100 C 240,140 270,200 330,230 Z" fill="url(#coatRed)" />
        <path d="M 360,210 C 310,150 250,110 200,100" stroke="url(#goldTrim)" stroke-width="2" fill="none" />
      </g>

      <path d="M 310,240 C 380,140 620,140 690,240 C 600,190 400,190 310,240 Z" fill="#0d0e12" />

      <path d="M 240,260 C 330,230 400,280 500,280 C 600,280 670,230 760,260 C 810,280 730,140 620,120 C 500,100 380,120 270,140 C 190,280 190,280 240,260 Z" fill="#181c24" stroke="#080a0d" stroke-width="4" />

      <path d="M 260,260 C 350,220 400,250 500,250 C 600,250 650,220 740,260 C 680,310 590,320 500,320 C 410,320 320,310 260,260 Z" fill="#0f1217" stroke="#080a0d" stroke-width="3" />

      <path d="M 240,260 C 330,230 400,280 500,280 C 600,280 670,230 760,260" stroke="url(#goldTrim)" stroke-width="8" fill="none" stroke-linecap="round" />
      <path d="M 260,260 C 350,220 400,250 500,250 C 600,250 650,220 740,260" stroke="url(#goldTrim)" stroke-width="5" fill="none" stroke-linecap="round" />

      <!-- JOLLY ROGER (SKULL & CROSSBONES) EMBLEM -->
      <g id="jollyRoger" transform="translate(500, 215)">
        <g stroke="#e2e8f0" stroke-width="7" stroke-linecap="round">
          <line x1="-35" y1="-25" x2="35" y2="25" />
          <line x1="35" y1="-25" x2="-35" y2="25" />
        </g>
        <g fill="#e2e8f0">
          <circle cx="-37" cy="-27" r="5" />
          <circle cx="-32" cy="-32" r="5" />
          <circle cx="37" cy="27" r="5" />
          <circle cx="32" cy="32" r="5" />
          <circle cx="37" cy="-27" r="5" />
          <circle cx="32" cy="-32" r="5" />
          <circle cx="-37" cy="27" r="5" />
          <circle cx="-32" cy="32" r="5" />
        </g>

        <path d="M -22,-10 C -22,-30 22,-30 22,-10 C 22,5 14,10 12,20 L -12,20 C -14,10 -22,5 -22,-10 Z" fill="#ffffff" stroke="#cbd5e0" stroke-width="2" />
        <circle cx="-9" cy="-8" r="6" fill="#0f1217" />
        <circle cx="9" cy="-8" r="6" fill="#0f1217" />
        <polygon points="0,-2 -4,4 4,4" fill="#0f1217" />
        <g fill="#0f1217">
          <rect x="-8" y="12" width="3" height="7" rx="1" />
          <rect x="-3" y="12" width="3" height="7" rx="1" />
          <rect x="2" y="12" width="3" height="7" rx="1" />
          <rect x="7" y="12" width="3" height="7" rx="1" />
        </g>
      </g>
    </g>

  </g> <!-- END PIRATE PENGUIN -->

  <!-- FOREGROUND SPARKLES / TREASURE GLINT -->
  <g fill="url(#goldTrim)" opacity="0.65" filter="url(#softGlow)">
    <circle cx="280" cy="720" r="3" />
    <circle cx="300" cy="660" r="2" />
    <circle cx="320" cy="420" r="3.5" />
    <circle cx="350" cy="410" r="2.5" />
    <circle cx="720" cy="520" r="2.5" />
    <circle cx="750" cy="480" r="3" />
    <circle cx="780" cy="680" r="4" />
  </g>
</svg>` 
            },
            { 
                id: 'm-dragonlord', 
                name: 'Armored Dragon Lord', 
                tier: 4, 
                unlockSec: 172800, 
                shapes: '142 Shapes', 
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <defs>
    <!-- Obsidian Dragon Scale / Skin Gradient -->
    <linearGradient id="obsidianSkin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2d303b" />
      <stop offset="35%" stop-color="#181a21" />
      <stop offset="75%" stop-color="#0c0d12" />
      <stop offset="100%" stop-color="#040406" />
    </linearGradient>

    <!-- Multi-Plate Dark Steel / Obsidian Armor Gradient -->
    <linearGradient id="armorPlate" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4f566b" />
      <stop offset="25%" stop-color="#2c313d" />
      <stop offset="60%" stop-color="#161821" />
      <stop offset="100%" stop-color="#08090d" />
    </linearGradient>

    <!-- Armor Highlight Edge Gradient -->
    <linearGradient id="armorEdge" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8f9bb8" />
      <stop offset="50%" stop-color="#3a4052" />
      <stop offset="100%" stop-color="#12141a" />
    </linearGradient>

    <!-- Radiant Crimson Energy Seam Gradient -->
    <linearGradient id="crimsonEnergy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff99a8" />
      <stop offset="30%" stop-color="#ff0033" />
      <stop offset="70%" stop-color="#990014" />
      <stop offset="100%" stop-color="#4a0008" />
    </linearGradient>

    <!-- Glowing Chest Core Radial Gradient -->
    <radialGradient id="chestCoreGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="15%" stop-color="#ffebaa" />
      <stop offset="40%" stop-color="#ff3300" />
      <stop offset="70%" stop-color="#cc0022" />
      <stop offset="90%" stop-color="#66000a" />
      <stop offset="100%" stop-color="#1a0002" stop-opacity="0" />
    </radialGradient>

    <!-- Horn & Spike Gradient -->
    <linearGradient id="hornGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0a0a0d" />
      <stop offset="40%" stop-color="#262933" />
      <stop offset="75%" stop-color="#800014" />
      <stop offset="95%" stop-color="#ff1a35" />
      <stop offset="100%" stop-color="#ff8090" />
    </linearGradient>

    <!-- Wing Membrane Gradient -->
    <linearGradient id="wingMembrane" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a0206" />
      <stop offset="40%" stop-color="#3b0008" />
      <stop offset="70%" stop-color="#1f0004" />
      <stop offset="100%" stop-color="#080001" />
    </linearGradient>

    <!-- Filters for Magical / Volcanic Glow -->
    <filter id="glowSoft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="glowIntense" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="blur1" />
      <feGaussianBlur stdDeviation="30" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- REUSABLE SYMBOLS -->
    <!-- Wing Segment Module (Left Wing Side) -->
    <g id="dragonWingLeft">
      <!-- Wing Main Arm Bone -->
      <path d="M 480,380 C 350,220 220,100 50,50 C 30,42 10,65 25,80 C 120,180 260,320 450,420 Z" fill="url(#armorPlate)" stroke="#5c657d" stroke-width="2" />
      <!-- Armored Wing Finger Spines -->
      <path d="M 320,240 C 200,260 90,320 20,420 C 130,390 270,380 410,410 Z" fill="url(#wingMembrane)" stroke="#800014" stroke-width="2" />
      <path d="M 240,180 C 120,220 40,320 -20,480 C 70,420 200,410 360,420 Z" fill="url(#wingMembrane)" opacity="0.9" />
      <path d="M 120,100 C 30,180 -30,300 -80,520 C 0,440 120,420 280,430 Z" fill="url(#wingMembrane)" opacity="0.8" />

      <!-- Wing Bone Armor Plates (Layered Claws/Spines) -->
      <path d="M 50,50 L 80,100 L 160,170 L 260,250 L 380,340 L 450,400 L 360,360 L 240,280 L 140,190 L 60,110 Z" fill="url(#obsidianSkin)" stroke="url(#crimsonEnergy)" stroke-width="1.5" />
      <!-- Crimson Energy Veins in Wings -->
      <path d="M 450,400 C 300,320 180,220 50,50" stroke="url(#crimsonEnergy)" stroke-width="3" fill="none" filter="url(#glowSoft)" />
      <path d="M 320,240 C 200,260 90,320 20,420" stroke="#ff0033" stroke-width="1.5" fill="none" opacity="0.7" />
      <path d="M 240,180 C 120,220 40,320 -20,480" stroke="#ff0033" stroke-width="1.5" fill="none" opacity="0.6" />

      <!-- Wing Thumb Claw -->
      <path d="M 50,50 C 30,20 10,15 0,30 C 15,45 30,55 50,50 Z" fill="url(#hornGrad)" stroke="#ff3300" stroke-width="1" />
    </g>
  </defs>

  <!-- ==================== TAIL (BACK LAYER) ==================== -->
  <g id="dragonTail">
    <!-- Massive Spiked Tail Sweeping from Left to Right -->
    <path d="M 460,700 C 380,750 250,800 180,750 C 100,700 80,580 140,500 C 180,450 250,440 280,480 C 300,520 260,580 200,600 C 150,620 140,680 200,710 C 280,740 400,680 480,620 Z" fill="url(#obsidianSkin)" stroke="#1a1c24" stroke-width="3" />

    <!-- Tail Segmented Armor Plates -->
    <path d="M 180,750 C 250,800 380,750 460,700 L 450,660 C 380,700 250,750 180,710 Z" fill="url(#armorPlate)" stroke="url(#crimsonEnergy)" stroke-width="1.5" />
    <path d="M 140,500 C 80,580 100,700 180,750 L 195,715 C 130,670 115,580 160,520 Z" fill="url(#armorPlate)" stroke="url(#crimsonEnergy)" stroke-width="1.5" />

    <!-- Tail Blade / Spikes -->
    <path d="M 120,490 L 80,440 L 140,460 Z" fill="url(#hornGrad)" />
    <path d="M 95,540 L 40,510 L 110,530 Z" fill="url(#hornGrad)" />
    <path d="M 90,610 L 30,600 L 100,630 Z" fill="url(#hornGrad)" />
    <path d="M 120,680 L 70,710 L 140,710 Z" fill="url(#hornGrad)" />
    <path d="M 180,750 L 150,810 L 210,770 Z" fill="url(#hornGrad)" />
  </g>

  <!-- ==================== WINGS LAYER ==================== -->
  <g id="wingsLayer">
    <!-- LEFT WING -->
    <use href="#dragonWingLeft" />

    <!-- RIGHT WING (Mirrored) -->
    <use href="#dragonWingLeft" transform="translate(1000, 0) scale(-1, 1)" />
  </g>

  <!-- ==================== LEGS ==================== -->
  <g id="legs">
    <!-- LEFT HIND LEG & GREAVE ARMOR -->
    <g id="leftLeg">
      <!-- Thigh Muscle / Base -->
      <path d="M 380,600 C 310,620 280,700 320,780 C 350,830 400,840 420,790 C 440,730 430,640 380,600 Z" fill="url(#obsidianSkin)" />
      <!-- Multi-Plate Greave (Shin Guard) -->
      <path d="M 320,680 L 290,750 L 330,820 L 380,830 L 400,760 L 360,700 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />
      <path d="M 330,700 L 305,755 L 340,805 L 375,810 L 385,765 Z" fill="url(#obsidianSkin)" stroke="url(#crimsonEnergy)" stroke-width="1.5" />
      <!-- Knee Armor Coute -->
      <path d="M 350,650 L 310,670 L 340,710 L 390,690 Z" fill="url(#armorPlate)" stroke="#ff0033" stroke-width="1.5" />
      <path d="M 310,670 L 270,660 L 320,690 Z" fill="url(#hornGrad)" />

      <!-- Heavy Armored Clawed Foot -->
      <path d="M 330,820 L 260,860 L 280,880 L 340,850 L 370,890 L 395,890 L 410,840 Z" fill="url(#armorPlate)" stroke="#1a1c24" stroke-width="2" />
      <!-- Claws -->
      <path d="M 260,860 L 210,875 L 270,885 Z" fill="url(#hornGrad)" />
      <path d="M 340,850 L 310,910 L 360,890 Z" fill="url(#hornGrad)" />
      <path d="M 370,890 L 370,930 L 400,900 Z" fill="url(#hornGrad)" />
    </g>

    <!-- RIGHT HIND LEG & GREAVE ARMOR -->
    <g id="rightLeg">
      <!-- Thigh Muscle / Base -->
      <path d="M 620,600 C 690,620 720,700 680,780 C 650,830 600,840 580,790 C 560,730 570,640 620,600 Z" fill="url(#obsidianSkin)" />
      <!-- Multi-Plate Greave (Shin Guard) -->
      <path d="M 680,680 L 710,750 L 670,820 L 620,830 L 600,760 L 640,700 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />
      <path d="M 670,700 L 695,755 L 660,805 L 625,810 L 615,765 Z" fill="url(#obsidianSkin)" stroke="url(#crimsonEnergy)" stroke-width="1.5" />
      <!-- Knee Armor Coute -->
      <path d="M 650,650 L 690,670 L 660,710 L 610,690 Z" fill="url(#armorPlate)" stroke="#ff0033" stroke-width="1.5" />
      <path d="M 690,670 L 730,660 L 680,690 Z" fill="url(#hornGrad)" />

      <!-- Heavy Armored Clawed Foot -->
      <path d="M 670,820 L 740,860 L 720,880 L 660,850 L 630,890 L 605,890 L 590,840 Z" fill="url(#armorPlate)" stroke="#1a1c24" stroke-width="2" />
      <!-- Claws -->
      <path d="M 740,860 L 790,875 L 730,885 Z" fill="url(#hornGrad)" />
      <path d="M 660,850 L 690,910 L 640,890 Z" fill="url(#hornGrad)" />
      <path d="M 630,890 L 630,930 L 600,900 Z" fill="url(#hornGrad)" />
    </g>
  </g>

  <!-- ==================== TORSO & MULTI-PLATE CUIRASS ==================== -->
  <g id="dragonTorso">
    <!-- Abdominal Base Scale Structure -->
    <path d="M 440,500 L 500,480 L 560,500 L 580,680 L 500,740 L 420,680 Z" fill="url(#obsidianSkin)" stroke="#090a0f" stroke-width="3" />

    <!-- Segmented Abdominal Armor Plates (Plackart / Tassets) -->
    <!-- Tier 1 (Bottom Tasset) -->
    <path d="M 440,660 L 500,710 L 560,660 L 570,700 L 500,740 L 430,700 Z" fill="url(#armorPlate)" stroke="url(#crimsonEnergy)" stroke-width="1.5" />
    <!-- Tier 2 -->
    <path d="M 435,610 L 500,655 L 565,610 L 572,645 L 500,690 L 428,645 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="1.5" />
    <path d="M 450,620 L 500,650 L 550,620" stroke="url(#crimsonEnergy)" stroke-width="2" fill="none" filter="url(#glowSoft)" />
    <!-- Tier 3 -->
    <path d="M 430,560 L 500,600 L 570,560 L 575,595 L 500,635 L 425,595 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="1.5" />
    <path d="M 445,570 L 500,600 L 555,570" stroke="url(#crimsonEnergy)" stroke-width="2" fill="none" filter="url(#glowSoft)" />
    <!-- Tier 4 (Upper Abdomen) -->
    <path d="M 425,510 L 500,545 L 575,510 L 580,545 L 500,580 L 420,545 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="1.5" />

    <!-- Flank / Rib Armor Plates (Left & Right) -->
    <g fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="1.5">
      <!-- Left Rib Plates -->
      <path d="M 410,480 L 440,510 L 420,550 L 380,510 Z" />
      <path d="M 400,535 L 430,565 L 410,605 L 370,565 Z" />
      <path d="M 390,590 L 420,620 L 400,660 L 360,620 Z" />
      <!-- Right Rib Plates -->
      <path d="M 590,480 L 560,510 L 580,550 L 620,510 Z" />
      <path d="M 600,535 L 570,565 L 590,605 L 630,565 Z" />
      <path d="M 610,590 L 580,620 L 600,660 L 640,620 Z" />
    </g>
  </g>

  <!-- ==================== GLOWING CHEST CORE & PECTORAL CUIRASS ==================== -->
  <g id="glowingChestCore">
    <!-- Pectoral Main Armor Plates (Framing the Core) -->
    <!-- Left Pectoral Plate -->
    <path d="M 360,380 L 480,410 L 470,500 L 380,470 L 340,410 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />
    <!-- Right Pectoral Plate -->
    <path d="M 640,380 L 520,410 L 530,500 L 620,470 L 660,410 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />

    <!-- Inner Core Housing / Aperture Frame -->
    <path d="M 460,400 L 500,370 L 540,400 L 550,470 L 500,510 L 450,470 Z" fill="#080002" stroke="url(#crimsonEnergy)" stroke-width="3" />

    <!-- RADIANT GLOWING CHEST CORE (THE POWER SOURCE) -->
    <!-- Core Ambient Deep Glow -->
    <circle cx="500" cy="440" r="75" fill="url(#chestCoreGrad)" filter="url(#glowIntense)" />
    <circle cx="500" cy="440" r="50" fill="url(#chestCoreGrad)" filter="url(#glowSoft)" />

    <!-- Core Inner Diamond Crystal Reactor -->
    <polygon points="500,390 535,440 500,490 465,440" fill="url(#crimsonEnergy)" />
    <polygon points="500,405 520,440 500,475 480,440" fill="#ffffff" filter="url(#glowSoft)" />
    <circle cx="500" cy="440" r="12" fill="#ffffff" />

    <!-- Energy Fissures Radiating from Core Across Armor -->
    <g stroke="#ff3344" stroke-width="2.5" fill="none" filter="url(#glowSoft)">
      <path d="M 465,440 L 390,430 L 350,400" />
      <path d="M 535,440 L 610,430 L 650,400" />
      <path d="M 480,475 L 440,530 L 420,590" />
      <path d="M 520,475 L 560,530 L 580,590" />
      <path d="M 500,390 L 500,340" />
      <path d="M 500,490 L 500,530" />
    </g>
  </g>

  <!-- ==================== SHOULDER PAULDRONS & ARMS ==================== -->
  <g id="shouldersAndArms">
    <!-- LEFT ARM & VAMBRACE -->
    <g id="leftArm">
      <!-- Bicep / Upper Arm Armor -->
      <path d="M 340,420 L 280,460 L 260,540 L 310,550 L 350,480 Z" fill="url(#obsidianSkin)" stroke="#12141a" stroke-width="2" />
      <!-- Forearm & Armored Vambrace -->
      <path d="M 280,530 L 220,620 L 250,650 L 310,570 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />
      <path d="M 220,620 L 170,660 L 210,680 L 250,650 Z" fill="url(#armorPlate)" stroke="url(#crimsonEnergy)" stroke-width="1.5" />
      <!-- Vambrace Spikes -->
      <path d="M 260,560 L 200,560 L 240,590 Z" fill="url(#hornGrad)" />
      <path d="M 240,590 L 180,600 L 220,620 Z" fill="url(#hornGrad)" />
      <!-- Left Hand Claws -->
      <path d="M 170,660 L 120,670 L 160,685 Z" fill="url(#hornGrad)" />
      <path d="M 185,675 L 140,700 L 180,700 Z" fill="url(#hornGrad)" />
      <path d="M 210,680 L 180,720 L 215,705 Z" fill="url(#hornGrad)" />
    </g>

    <!-- RIGHT ARM & VAMBRACE -->
    <g id="rightArm">
      <!-- Bicep / Upper Arm Armor -->
      <path d="M 660,420 L 720,460 L 740,540 L 690,550 L 650,480 Z" fill="url(#obsidianSkin)" stroke="#12141a" stroke-width="2" />
      <!-- Forearm & Armored Vambrace -->
      <path d="M 720,530 L 780,620 L 750,650 L 690,570 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />
      <path d="M 780,620 L 830,660 L 790,680 L 750,650 Z" fill="url(#armorPlate)" stroke="url(#crimsonEnergy)" stroke-width="1.5" />
      <!-- Vambrace Spikes -->
      <path d="M 740,560 L 800,560 L 760,590 Z" fill="url(#hornGrad)" />
      <path d="M 760,590 L 820,600 L 780,620 Z" fill="url(#hornGrad)" />
      <!-- Right Hand Claws -->
      <path d="M 830,660 L 880,670 L 840,685 Z" fill="url(#hornGrad)" />
      <path d="M 815,675 L 860,700 L 820,700 Z" fill="url(#hornGrad)" />
      <path d="M 790,680 L 820,720 L 785,705 Z" fill="url(#hornGrad)" />
    </g>

    <!-- IMPERIAL MULTI-TIERED SHOULDER PAULDRONS -->
    <!-- Left Pauldron (3 Overlapping Heavy Plates) -->
    <g id="leftPauldron">
      <!-- Base Tier -->
      <path d="M 380,360 L 280,380 L 260,460 L 350,450 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />
      <!-- Mid Tier -->
      <path d="M 390,330 L 270,350 L 240,430 L 340,420 Z" fill="url(#armorPlate)" stroke="url(#crimsonEnergy)" stroke-width="2" />
      <!-- Top Tier (Main Blade Shield) -->
      <path d="M 410,290 L 280,310 L 230,390 L 350,380 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2.5" />
      <!-- Crimson Energy Inlay -->
      <path d="M 390,310 L 300,325 L 260,380 L 340,370 Z" fill="url(#obsidianSkin)" stroke="#ff0033" stroke-width="1.5" />
      <!-- Massive Pauldron Spikes -->
      <path d="M 280,310 L 160,280 L 240,350 Z" fill="url(#hornGrad)" stroke="#ff3300" stroke-width="1" />
      <path d="M 230,390 L 130,390 L 210,430 Z" fill="url(#hornGrad)" stroke="#ff3300" stroke-width="1" />
    </g>

    <!-- Right Pauldron (Mirrored) -->
    <g id="rightPauldron">
      <!-- Base Tier -->
      <path d="M 620,360 L 720,380 L 740,460 L 650,450 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />
      <!-- Mid Tier -->
      <path d="M 610,330 L 730,350 L 760,430 L 660,420 Z" fill="url(#armorPlate)" stroke="url(#crimsonEnergy)" stroke-width="2" />
      <!-- Top Tier (Main Blade Shield) -->
      <path d="M 590,290 L 720,310 L 770,390 L 650,380 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2.5" />
      <!-- Crimson Energy Inlay -->
      <path d="M 610,310 L 700,325 L 740,380 L 660,370 Z" fill="url(#obsidianSkin)" stroke="#ff0033" stroke-width="1.5" />
      <!-- Massive Pauldron Spikes -->
      <path d="M 720,310 L 840,280 L 760,350 Z" fill="url(#hornGrad)" stroke="#ff3300" stroke-width="1" />
      <path d="M 770,390 L 870,390 L 790,430 Z" fill="url(#hornGrad)" stroke="#ff3300" stroke-width="1" />
    </g>
  </g>

  <!-- ==================== NECK GORGET & DRAGON LORD HEAD ==================== -->
  <g id="headAndNeck">
    <!-- Neck Gorget (Segmented Neck Plates) -->
    <path d="M 440,320 L 500,350 L 560,320 L 580,380 L 500,410 L 420,380 Z" fill="url(#armorPlate)" stroke="url(#crimsonEnergy)" stroke-width="2" />
    <path d="M 450,280 L 500,310 L 550,280 L 570,340 L 500,370 L 430,340 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />

    <!-- DRAGON HEAD BASE STRUCTURE -->
    <path d="M 430,220 C 410,150 450,110 500,100 C 550,110 590,150 570,220 C 560,270 530,300 500,310 C 470,300 440,270 430,220 Z" fill="url(#obsidianSkin)" stroke="#090a0f" stroke-width="3" />

    <!-- Snout & Jaw Armor (Beak / Faceted Plates) -->
    <path d="M 450,210 L 500,200 L 550,210 L 560,270 L 500,310 L 440,270 Z" fill="url(#armorPlate)" stroke="url(#armorEdge)" stroke-width="2" />
    <path d="M 470,220 L 500,210 L 530,220 L 535,260 L 500,285 L 465,260 Z" fill="url(#obsidianSkin)" stroke="url(#crimsonEnergy)" stroke-width="1.5" />

    <!-- Nostril Slits & Jaw Fangs -->
    <path d="M 485,225 L 495,230 M 515,225 L 505,230" stroke="#ff0033" stroke-width="2" />
    <!-- Fangs -->
    <polygon points="460,270 470,290 475,270" fill="#ffffff" />
    <polygon points="540,270 530,290 525,270" fill="#ffffff" />
    <polygon points="485,280 492,300 495,280" fill="#ffffff" />
    <polygon points="515,280 508,300 505,280" fill="#ffffff" />

    <!-- FIERCE GLOWING CRIMSON EYES -->
    <!-- Left Eye Socket & Eye -->
    <polygon points="440,190 480,195 470,210 435,200" fill="#050001" />
    <polygon points="445,192 475,197 465,207 440,200" fill="url(#crimsonEnergy)" filter="url(#glowSoft)" />
    <ellipse cx="458" cy="199" rx="2" ry="5" fill="#ffffff" />
    <path d="M 435,185 Q 460,188 480,192" stroke="#ff3300" stroke-width="2" fill="none" filter="url(#glowSoft)" />

    <!-- Right Eye Socket & Eye -->
    <polygon points="560,190 520,195 530,210 565,200" fill="#050001" />
    <polygon points="555,192 525,197 535,207 560,200" fill="url(#crimsonEnergy)" filter="url(#glowSoft)" />
    <ellipse cx="542" cy="199" rx="2" ry="5" fill="#ffffff" />
    <path d="M 565,185 Q 540,188 520,192" stroke="#ff3300" stroke-width="2" fill="none" filter="url(#glowSoft)" />

    <!-- Forehead Crest & Dragon Crown Plate -->
    <path d="M 460,140 L 500,110 L 540,140 L 530,190 L 500,170 L 470,190 Z" fill="url(#armorPlate)" stroke="url(#crimsonEnergy)" stroke-width="2" />
    <!-- Crown Gem / Core Focus -->
    <polygon points="500,130 515,150 500,170 485,150" fill="url(#crimsonEnergy)" filter="url(#glowSoft)" />
    <polygon points="500,140 508,150 500,160 492,150" fill="#ffffff" />

    <!-- CROWN OF DRAGON HORNS (Multi-Tiered Majestic Spikes) -->
    <!-- Primary Major Horns (Sweeping Out & Up) -->
    <path d="M 450,140 C 400,80 320,20 220,-20 C 300,50 380,120 430,170 Z" fill="url(#hornGrad)" stroke="#ff0033" stroke-width="1.5" />
    <path d="M 550,140 C 600,80 680,20 780,-20 C 700,50 620,120 570,170 Z" fill="url(#hornGrad)" stroke="#ff0033" stroke-width="1.5" />

    <!-- Secondary Mid Horns -->
    <path d="M 440,170 C 370,130 280,90 200,70 C 270,120 350,170 420,200 Z" fill="url(#hornGrad)" stroke="#ff3300" stroke-width="1" />
    <path d="M 560,170 C 630,130 720,90 800,70 C 730,120 650,170 580,200 Z" fill="url(#hornGrad)" stroke="#ff3300" stroke-width="1" />

    <!-- Brow / Cheek Horns -->
    <path d="M 430,220 C 360,210 290,220 240,240 C 300,250 370,240 420,250 Z" fill="url(#hornGrad)" />
    <path d="M 570,220 C 640,210 710,220 760,240 C 700,250 630,240 580,250 Z" fill="url(#hornGrad)" />
  </g>

  <!-- ==================== FOREGROUND ENERGY LIGHTNING ==================== -->
  <g id="foregroundEnergy" filter="url(#glowIntense)">
    <path d="M 490,410 Q 470,360 485,320" stroke="#ffffff" stroke-width="1.5" fill="none" />
    <path d="M 510,410 Q 530,360 515,310" stroke="#ffebaa" stroke-width="1.5" fill="none" />
    <path d="M 440,430 Q 380,410 330,440" stroke="#ff0033" stroke-width="1.2" fill="none" />
    <path d="M 560,430 Q 620,410 670,440" stroke="#ff0033" stroke-width="1.2" fill="none" />
  </g>
</svg>
` 
            },
            { 
                id: 'm-astraeus', 
                name: 'Astraeus Celestial', 
                tier: 4, 
                unlockSec: 259200, 
                shapes: '135 Shapes', 
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="100%" height="100%">
  <defs>
    <!-- Metallic Gold Gradients -->
    <linearGradient id="goldBright" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#ffea88" />
      <stop offset="55%" stop-color="#ffd700" />
      <stop offset="80%" stop-color="#c79100" />
      <stop offset="100%" stop-color="#6e4e00" />
    </linearGradient>

    <linearGradient id="goldDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffd700" />
      <stop offset="50%" stop-color="#a87e00" />
      <stop offset="100%" stop-color="#3d2a00" />
    </linearGradient>

    <!-- Celestial Body & Skin Gradients -->
    <linearGradient id="cosmicBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1d284f" />
      <stop offset="40%" stop-color="#101733" />
      <stop offset="75%" stop-color="#080b1c" />
      <stop offset="100%" stop-color="#02040a" />
    </linearGradient>

    <radialGradient id="coreAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="20%" stop-color="#80f3ff" />
      <stop offset="50%" stop-color="#0088ff" />
      <stop offset="80%" stop-color="#6a00f4" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Glow Filters -->
    <filter id="glowSoft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="glowIntense" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12" result="blur1" />
      <feGaussianBlur stdDeviation="28" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Reusable Symbols -->
    <g id="star4Point">
      <path d="M 0,-18 Q 0,0 -18,0 Q 0,0 0,18 Q 0,0 18,0 Q 0,0 0,-18 Z" fill="#ffffff" filter="url(#glowSoft)" />
    </g>

    <g id="planetSphere">
      <circle cx="0" cy="0" r="16" fill="url(#goldBright)" />
      <ellipse cx="0" cy="0" rx="32" ry="7" fill="none" stroke="#523900" stroke-width="2" transform="rotate(-15)" />
      <ellipse cx="0" cy="0" rx="30" ry="6" fill="none" stroke="url(#goldBright)" stroke-width="1.5" transform="rotate(-15)" />
    </g>
  </defs>

  <!-- ==================== INTERSECTING ORBITAL RINGS & ASTROLABE ==================== -->
  <g id="orbitalSystem" stroke="url(#goldBright)" fill="none">
    <!-- Outer Zodiac Wheel -->
    <circle cx="600" cy="550" r="360" stroke-width="4" opacity="0.85" />
    <circle cx="600" cy="550" r="348" stroke-width="1.5" stroke-dasharray="6,12" opacity="0.6" />

    <!-- Tilted Elliptical Orbits -->
    <ellipse cx="600" cy="550" rx="460" ry="140" stroke-width="3.5" transform="rotate(-25, 600, 550)" opacity="0.9" />
    <ellipse cx="600" cy="550" rx="440" ry="130" stroke-width="1" stroke-dasharray="4,8" transform="rotate(-25, 600, 550)" opacity="0.5" />

    <ellipse cx="600" cy="550" rx="440" ry="150" stroke-width="3" transform="rotate(35, 600, 550)" opacity="0.85" />
    <ellipse cx="600" cy="550" rx="180" ry="480" stroke-width="2.5" transform="rotate(15, 600, 550)" opacity="0.75" />

    <!-- Astrolabe Axis Rays -->
    <g stroke-width="1" opacity="0.35">
      <line x1="600" y1="130" x2="600" y2="970" />
      <line x1="180" y1="550" x2="1020" y2="550" />
      <line x1="303" y1="253" x2="897" y2="847" />
      <line x1="303" y1="847" x2="897" y2="253" />
    </g>
  </g>

  <!-- Orbiting Planets -->
  <g id="planets">
    <!-- Saturn-like Ringed Planet on Left Orbit -->
    <g transform="translate(210, 420)">
      <circle cx="0" cy="0" r="22" fill="url(#cosmicBody)" stroke="url(#goldBright)" stroke-width="2" />
      <ellipse cx="0" cy="0" rx="45" ry="10" fill="none" stroke="url(#goldBright)" stroke-width="3" transform="rotate(-20)" filter="url(#glowSoft)" />
      <circle cx="0" cy="0" r="18" fill="url(#goldBright)" opacity="0.8" />
    </g>

    <!-- Radiant Cyan Gas Giant Top Right -->
    <g transform="translate(940, 320)">
      <circle cx="0" cy="0" r="28" fill="#00d8ff" filter="url(#glowIntense)" />
      <circle cx="0" cy="0" r="24" fill="#ffffff" opacity="0.7" />
      <ellipse cx="0" cy="0" rx="40" ry="8" fill="none" stroke="#ffffff" stroke-width="1.5" transform="rotate(15)" />
    </g>

    <!-- Golden Solar Orb Bottom Right -->
    <use href="#planetSphere" x="880" y="780" transform="scale(1.3)" filter="url(#glowSoft)" />

    <!-- Deep Crimson Planet Top Left -->
    <g transform="translate(320, 220)">
      <circle cx="0" cy="0" r="16" fill="#b3003b" filter="url(#glowSoft)" />
      <circle cx="-4" cy="-4" r="14" fill="url(#goldBright)" opacity="0.5" />
    </g>
  </g>

  <!-- ==================== SWIRLING OCEANIC BASE (Eurybia Lineage) ==================== -->
  <g id="oceanicNebulaBase">
    <!-- Cosmic Wave Tendrils -->
    <path d="M 200,850 C 350,750 480,920 600,840 C 720,760 850,900 1000,820 C 1080,880 1150,980 1100,1050 C 950,1150 250,1150 100,1050 C 50,980 120,880 200,850 Z" fill="url(#cosmicBody)" stroke="url(#goldBright)" stroke-width="2" opacity="0.9" />

    <path d="M 150,920 C 320,830 450,980 600,900 C 750,820 900,960 1050,890" fill="none" stroke="#00f0ff" stroke-width="3" filter="url(#glowSoft)" opacity="0.7" />
    <path d="M 250,980 C 400,900 520,1020 680,960 C 840,900 950,1020 1080,950" fill="none" stroke="url(#goldBright)" stroke-width="2" opacity="0.8" />
  </g>

  <!-- ==================== ASTRAEUS TITAN FIGURE ==================== -->
  <g id="astraeusTitan">

    <!-- CASCADING STARRY GALACTIC HAIR (Back Layer) -->
    <g id="starryHair">
      <path d="M 600,220 C 480,180 320,280 260,420 C 200,560 220,750 300,900 C 380,800 360,600 420,450 C 460,350 520,260 600,220 Z" fill="url(#cosmicBody)" stroke="url(#goldBright)" stroke-width="1.5" />
      <path d="M 600,220 C 720,180 880,280 940,420 C 1000,560 980,750 900,900 C 820,800 840,600 780,450 C 740,350 680,260 600,220 Z" fill="url(#cosmicBody)" stroke="url(#goldBright)" stroke-width="1.5" />

      <!-- Hair Constellation Embedded Nodes -->
      <g fill="#00f0ff" stroke="#ffffff" stroke-width="1" filter="url(#glowSoft)">
        <circle cx="310" cy="380" r="4" />
        <circle cx="270" cy="480" r="3" />
        <circle cx="260" cy="600" r="4" />
        <circle cx="310" cy="720" r="3.5" />
        <line x1="310" y1="380" x2="270" y2="480" stroke="#00f0ff" stroke-width="1" />
        <line x1="270" y1="480" x2="260" y2="600" stroke="#00f0ff" stroke-width="1" />
        <line x1="260" y1="600" x2="310" y2="720" stroke="#00f0ff" stroke-width="1" />

        <circle cx="890" cy="380" r="4" />
        <circle cx="930" cy="480" r="3" />
        <circle cx="940" cy="600" r="4" />
        <circle cx="890" cy="720" r="3.5" />
        <line x1="890" y1="380" x2="930" y2="480" stroke="#00f0ff" stroke-width="1" />
        <line x1="930" y1="480" x2="940" y2="600" stroke="#00f0ff" stroke-width="1" />
        <line x1="940" y1="600" x2="890" y2="720" stroke="#00f0ff" stroke-width="1" />
      </g>
    </g>

    <!-- RAM HORNS OF CRIUS (Titan Lineage Crest) -->
    <g id="ramHorns">
      <!-- Left Curved Horn -->
      <path d="M 530,220 C 440,180 340,200 280,280 C 230,350 250,440 320,460 C 370,470 410,420 390,370 C 370,320 310,320 300,360 C 290,400 330,420 340,400 C 320,350 370,270 510,250 Z" fill="url(#goldDark)" stroke="url(#goldBright)" stroke-width="2.5" />
      <!-- Horn Ridges Left -->
      <path d="M 480,230 C 420,230 360,260 320,310" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.6" />
      <path d="M 450,240 C 390,250 340,290 300,340" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.6" />

      <!-- Right Curved Horn (Mirrored) -->
      <path d="M 670,220 C 760,180 860,200 920,280 C 970,350 950,440 880,460 C 830,470 790,420 810,370 C 830,320 890,320 900,360 C 910,400 870,420 860,400 C 880,350 830,270 690,250 Z" fill="url(#goldDark)" stroke="url(#goldBright)" stroke-width="2.5" />
      <!-- Horn Ridges Right -->
      <path d="M 720,230 C 780,230 840,260 880,310" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.6" />
      <path d="M 750,240 C 810,250 860,290 900,340" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.6" />
    </g>

    <!-- TITAN TORSO & CELESTIAL ARMOR -->
    <g id="torsoArmor">
      <!-- Main Neck & Chest Structure -->
      <path d="M 520,320 L 680,320 L 740,480 L 780,680 L 600,820 L 420,680 L 460,480 Z" fill="url(#cosmicBody)" stroke="url(#goldBright)" stroke-width="2" />

      <!-- Gilded Breastplate Cuirass -->
      <path d="M 500,420 L 600,380 L 700,420 L 720,580 L 600,680 L 480,580 Z" fill="url(#goldDark)" stroke="url(#goldBright)" stroke-width="3" />
      <path d="M 520,440 L 600,410 L 680,440 L 695,560 L 600,640 L 505,560 Z" fill="url(#cosmicBody)" stroke="url(#goldBright)" stroke-width="1.5" />

      <!-- Astrological Center Emblem on Chest -->
      <circle cx="600" cy="510" r="45" fill="url(#goldBright)" />
      <circle cx="600" cy="510" r="38" fill="#090d21" />
      <!-- Sun Core in Chest -->
      <circle cx="600" cy="510" r="18" fill="#00f0ff" filter="url(#glowIntense)" />
      <circle cx="600" cy="510" r="8" fill="#ffffff" />

      <!-- Chest Armor Rays -->
      <path d="M 600,420 L 600,465 M 600,555 L 600,600 M 515,510 L 555,510 M 645,510 L 685,510" stroke="url(#goldBright)" stroke-width="3" />

      <!-- Shoulder Pauldrons (Left & Right) -->
      <path d="M 440,400 C 370,400 320,460 360,540 C 410,550 460,500 480,440 Z" fill="url(#goldBright)" stroke="#3d2a00" stroke-width="2" />
      <path d="M 760,400 C 830,400 880,460 840,540 C 790,550 740,500 720,440 Z" fill="url(#goldBright)" stroke="#3d2a00" stroke-width="2" />
    </g>

    <!-- ARMS & HANDS HOLDING ASTROLABE SPHERE -->
    <g id="armsAndHands">
      <!-- Left Arm -->
      <path d="M 360,520 C 320,620 350,720 440,780 L 480,720 C 420,670 400,600 420,530 Z" fill="url(#cosmicBody)" stroke="url(#goldBright)" stroke-width="2" />
      <!-- Right Arm -->
      <path d="M 840,520 C 880,620 850,720 760,780 L 720,720 C 780,670 800,600 780,530 Z" fill="url(#cosmicBody)" stroke="url(#goldBright)" stroke-width="2" />

      <!-- Bracers / Vambraces -->
      <path d="M 380,680 L 440,780 L 470,740 L 420,650 Z" fill="url(#goldBright)" />
      <path d="M 820,680 L 760,780 L 730,740 L 780,650 Z" fill="url(#goldBright)" />

      <!-- FLOATING ASTROLABE ARMILLARY SPHERE (In Hands) -->
      <g id="heldAstrolabe" transform="translate(600, 750)">
        <circle cx="0" cy="0" r="75" fill="url(#coreAura)" filter="url(#glowIntense)" />
        <circle cx="0" cy="0" r="60" fill="none" stroke="url(#goldBright)" stroke-width="3" />
        <ellipse cx="0" cy="0" rx="60" ry="20" fill="none" stroke="url(#goldBright)" stroke-width="2" transform="rotate(-30)" />
        <ellipse cx="0" cy="0" rx="60" ry="20" fill="none" stroke="url(#goldBright)" stroke-width="2" transform="rotate(40)" />
        <ellipse cx="0" cy="0" rx="20" ry="60" fill="none" stroke="#00f0ff" stroke-width="2" />
        <!-- Core Radiant Star -->
        <use href="#star4Point" x="0" y="0" transform="scale(1.8)" />
      </g>
    </g>

    <!-- HEAD, FACE, & CROWN OF STARS -->
    <g id="headAndCrown">
      <!-- Neck -->
      <path d="M 540,300 L 660,300 L 650,360 L 550,360 Z" fill="url(#cosmicBody)" />

      <!-- Head Base -->
      <path d="M 520,240 C 500,180 540,140 600,140 C 660,140 700,180 680,240 C 660,290 640,320 600,325 C 560,320 540,290 520,240 Z" fill="url(#cosmicBody)" stroke="url(#goldBright)" stroke-width="2" />

      <!-- Facial Features (Noble God-like Profile) -->
      <g stroke="url(#goldBright)" fill="none" stroke-linecap="round">
        <!-- Eyebrows / Brow Ridge -->
        <path d="M 540,225 Q 565,215 585,225" stroke-width="2.5" />
        <path d="M 660,225 Q 635,215 615,225" stroke-width="2.5" />

        <!-- Glowing Starlight Eyes -->
        <ellipse cx="565" cy="235" rx="10" ry="5" fill="#00f0ff" filter="url(#glowSoft)" />
        <ellipse cx="635" cy="235" rx="10" ry="5" fill="#00f0ff" filter="url(#glowSoft)" />
        <circle cx="565" cy="235" r="3" fill="#ffffff" />
        <circle cx="635" cy="235" r="3" fill="#ffffff" />

        <!-- Nose Bridge -->
        <path d="M 600,220 L 600,265 L 590,270" stroke-width="2" />

        <!-- Lips / Mouth -->
        <path d="M 580,290 Q 600,298 620,290" stroke-width="2" />
      </g>

      <!-- Astrological Third Eye Crest -->
      <g transform="translate(600, 195)">
        <circle cx="0" cy="0" r="8" fill="#00f0ff" filter="url(#glowIntense)" />
        <circle cx="0" cy="0" r="4" fill="#ffffff" />
        <path d="M -14,0 L 14,0 M 0,-14 L 0,14" stroke="url(#goldBright)" stroke-width="1.5" />
      </g>

      <!-- IMPERIAL CROWN OF STARS & DIADEM -->
      <g id="crown">
        <!-- Golden Circlet -->
        <path d="M 520,210 Q 600,190 680,210 Q 600,225 520,210 Z" fill="url(#goldBright)" stroke="#3d2a00" stroke-width="1.5" />

        <!-- Spikes / Star Rays -->
        <path d="M 600,195 L 600,100 L 612,185 Z" fill="url(#goldBright)" filter="url(#glowSoft)" />
        <path d="M 570,200 L 540,120 L 582,192 Z" fill="url(#goldBright)" />
        <path d="M 630,200 L 660,120 L 618,192 Z" fill="url(#goldBright)" />
        <path d="M 535,210 L 490,150 L 550,202 Z" fill="url(#goldBright)" />
        <path d="M 665,210 L 710,150 L 650,202 Z" fill="url(#goldBright)" />

        <!-- Crown Jewels (Glowing Star Spheres on Tips) -->
        <use href="#star4Point" x="600" y="95" transform="scale(1.2)" />
        <use href="#star4Point" x="540" y="115" />
        <use href="#star4Point" x="660" y="115" />
        <use href="#star4Point" x="485" y="145" transform="scale(0.8)" />
        <use href="#star4Point" x="715" y="145" transform="scale(0.8)" />
      </g>
    </g>

  </g> <!-- END ASTRAEUS TITAN -->

  <!-- ==================== FOREGROUND CELESTIAL PARTICLES & SPARKS ==================== -->
  <g id="foregroundSparks" filter="url(#glowIntense)">
    <use href="#star4Point" x="420" y="350" transform="scale(0.7)" />
    <use href="#star4Point" x="780" y="320" transform="scale(0.9)" />
    <use href="#star4Point" x="350" y="680" transform="scale(1.1)" />
    <use href="#star4Point" x="880" y="650" transform="scale(0.8)" />
    <use href="#star4Point" x="600" y="920" transform="scale(1.3)" />

    <!-- Glowing Stardust Dust -->
    <circle cx="580" cy="700" r="3" fill="#ffffff" />
    <circle cx="630" cy="680" r="2.5" fill="#00f0ff" />
    <circle cx="520" cy="760" r="4" fill="#ffd700" />
    <circle cx="680" cy="770" r="3.5" fill="#ffffff" />
    <circle cx="450" cy="850" r="3" fill="#00f0ff" />
    <circle cx="750" cy="840" r="2.5" fill="#ffd700" />
  </g>
</svg>
` 
            },
            { 
                id: 'm-voidwhale', 
                name: 'Astral Void Whale', 
                tier: 4, 
                unlockSec: 345600, 
                shapes: '130 Shapes', 
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="100%" height="100%">
  <defs>
    <!-- Filters -->
    <filter id="auroraGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="cloudShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.15"/>
    </filter>

    <!-- Gradients -->
    <!-- Water & Deep Sea -->
    <linearGradient id="whaleSkin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="40%" stop-color="#0f2b48"/>
      <stop offset="80%" stop-color="#0a192f"/>
      <stop offset="100%" stop-color="#030c1b"/>
    </linearGradient>

    <linearGradient id="oceanCutaway" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.85"/>
      <stop offset="30%" stop-color="#0284c7" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#0c4a6e"/>
    </linearGradient>

    <linearGradient id="sunbeam" x1="0%" y1="0%" x2="30%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </linearGradient>

    <!-- Aurora (Atmospheric Ribbon) -->
    <linearGradient id="auroraRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4ade80" stop-opacity="0"/>
      <stop offset="20%" stop-color="#22c55e" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.85"/>
      <stop offset="80%" stop-color="#a855f7" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
    </linearGradient>

    <!-- Land & Ecosystems -->
    <linearGradient id="desertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>

    <linearGradient id="mountainShade" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="50%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>

    <linearGradient id="snowCapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>

    <linearGradient id="waterfallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#bae6fd"/>
      <stop offset="70%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.2"/>
    </linearGradient>

    <!-- Clouds & Volcano -->
    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>

    <linearGradient id="spoutPlume" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#7dd3fc" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#f8fafc" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- NO BACKGROUND / TRANSPARENT CANVAS -->

  <!-- ========================================== -->
  <!-- 1. WHALE BASE & SUBMERGED ANATOMY          -->
  <!-- ========================================== -->
  <g id="whaleBase">
    <!-- Continuous Main Body Silhouette Tapering Smoothly to Caudal Peduncle -->
    <path id="bodyOutline" d="
      M 95 330 
      C 100 290, 160 265, 240 260
      C 350 255, 480 270, 620 250
      C 730 235, 840 280, 930 320
      C 960 335, 980 355, 990 375
      C 980 395, 950 420, 910 445
      C 870 475, 830 495, 710 550
      C 500 580, 360 520, 270 480
      C 200 450, 140 410, 100 380
      C 90 355, 90 340, 95 330 Z" 
      fill="url(#whaleSkin)" stroke="#0284c7" stroke-width="2"/>

    <!-- Throat Pleats / Grooves (Right Side / Snout) -->
    <g stroke="#38bdf8" stroke-width="1.5" fill="none" opacity="0.6">
      <path d="M 120 375 C 180 415, 260 440, 340 455"/>
      <path d="M 135 390 C 195 430, 280 455, 360 470"/>
      <path d="M 160 408 C 220 448, 300 475, 380 488"/>
      <path d="M 190 425 C 250 462, 330 490, 400 500"/>
    </g>

    <!-- Large Pectoral Fin (Sweeping Downward with Constellations & Coral) -->
    <g id="pectoralFin">
      <!-- Shadow/Base Fin -->
      <path d="
        M 410 485 
        C 430 540, 470 610, 520 670 
        C 528 680, 540 675, 535 660 
        C 510 595, 490 535, 480 480 Z" 
        fill="#07192f" stroke="#0ea5e9" stroke-width="1.5"/>

      <!-- Inner Glowing Map Lines on Fin -->
      <path d="M 430 510 L 460 560 L 490 620 M 460 560 L 485 580" stroke="#38bdf8" stroke-width="1" fill="none" opacity="0.8" stroke-dasharray="3 3"/>
      <circle cx="430" cy="510" r="2.5" fill="#7dd3fc" filter="url(#softGlow)"/>
      <circle cx="460" cy="560" r="2.5" fill="#7dd3fc" filter="url(#softGlow)"/>
      <circle cx="490" cy="620" r="3" fill="#38bdf8" filter="url(#softGlow)"/>
      <circle cx="485" cy="580" r="2" fill="#7dd3fc"/>

      <!-- Coral encrustations on Fin Tip -->
      <path d="M 505 635 C 515 630, 525 640, 520 650 C 528 655, 525 668, 515 662 Z" fill="#f43f5e"/>
      <path d="M 495 615 C 502 610, 510 618, 505 625 Z" fill="#fb923c"/>
    </g>
  </g>

  <!-- ========================================== -->
  <!-- 2. UNDERWATER CUTAWAY / AQUATIC ECOSYSTEM  -->
  <!-- ========================================== -->
  <g id="aquaticCutaway">
    <!-- Glassy Ocean Interior Window -->
    <path d="
      M 320 340 
      C 420 330, 600 320, 780 350
      C 850 360, 890 390, 870 430
      C 840 470, 720 510, 580 520
      C 450 530, 360 480, 300 430
      C 270 400, 280 350, 320 340 Z" 
      fill="url(#oceanCutaway)" stroke="#7dd3fc" stroke-width="2" filter="url(#softGlow)"/>

    <!-- Sunbeams in Water -->
    <polygon points="350,335 420,330 520,490 410,500" fill="url(#sunbeam)"/>
    <polygon points="500,325 570,322 690,480 600,490" fill="url(#sunbeam)"/>

    <!-- Sunken Ancient Ruins (Columns & Arches inside sea) -->
    <g fill="#0284c7" stroke="#38bdf8" stroke-width="0.75" opacity="0.7">
      <rect x="680" y="410" width="8" height="45" rx="1"/>
      <rect x="700" y="405" width="8" height="50" rx="1"/>
      <rect x="720" y="415" width="8" height="40" rx="1"/>
      <path d="M 675 410 L 730 405 L 728 398 L 677 403 Z"/> <!-- Pediment -->
    </g>

    <!-- Coral Reef Floor & Plants -->
    <g id="coralReef">
      <!-- Coral Structures -->
      <path d="M 330 440 C 320 420, 340 400, 350 415 C 360 395, 380 410, 370 430 Z" fill="#f43f5e"/>
      <path d="M 365 445 C 360 430, 375 420, 385 432 C 395 422, 405 435, 395 450 Z" fill="#fb923c"/>
      <path d="M 750 450 C 740 420, 770 410, 780 430 C 795 415, 815 435, 800 460 Z" fill="#ec4899"/>
      <path d="M 800 440 C 810 425, 825 430, 820 445 Z" fill="#a855f7"/>

      <!-- Glowing Sea Anemones / Bioluminescence -->
      <circle cx="340" cy="415" r="3" fill="#f472b6" filter="url(#softGlow)"/>
      <circle cx="352" cy="405" r="2.5" fill="#38bdf8" filter="url(#softGlow)"/>
      <circle cx="375" cy="425" r="3" fill="#facc15" filter="url(#softGlow)"/>
      <circle cx="770" cy="420" r="3.5" fill="#4ade80" filter="url(#softGlow)"/>
      <circle cx="790" cy="425" r="2.5" fill="#38bdf8" filter="url(#softGlow)"/>
    </g>

    <!-- Schools of Glowing Fish -->
    <g fill="#f0fdf4" opacity="0.85">
      <!-- Fish Swim 1 -->
      <path d="M 450 380 C 455 377, 462 380, 467 378 L 464 382 Z"/>
      <path d="M 470 372 C 475 369, 482 372, 487 370 L 484 374 Z"/>
      <path d="M 462 390 C 467 387, 474 390, 479 388 L 476 392 Z"/>
      <!-- Fish Swim 2 -->
      <path d="M 610 430 C 615 427, 622 430, 627 428 L 624 432 Z"/>
      <path d="M 628 420 C 633 417, 640 420, 645 418 L 642 422 Z"/>
    </g>

    <!-- Glowing Oceanic Navigation Chart Lines (Overlaying Whale Skin) -->
    <g stroke="#38bdf8" stroke-width="1" fill="none" opacity="0.6">
      <circle cx="230" cy="360" r="20" stroke-dasharray="4 4"/>
      <line x1="230" y1="330" x2="230" y2="390"/>
      <line x1="200" y1="360" x2="260" y2="360"/>
      <path d="M 180 340 L 230 360 L 270 390"/>
    </g>

    <!-- HIGHLY DETAILED CELESTIAL WHALE EYE -->
    <g id="whaleEye" transform="translate(195, 335)">
      <!-- Orbital Socket Shadow & Glow Arc -->
      <path d="M -18 -8 C -5 -16, 12 -14, 20 -4 C 12 10, -8 12, -18 -8 Z" fill="#030c1b" opacity="0.8"/>
      <path d="M -22 -6 C -10 -18, 14 -16, 22 -2" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.7" filter="url(#softGlow)"/>

      <!-- Outer Eye Socket Frame -->
      <ellipse cx="0" cy="0" rx="14" ry="9" fill="#020813" stroke="#0ea5e9" stroke-width="1.5"/>

      <!-- Translucent Iris Base Glow -->
      <ellipse cx="0" cy="0" rx="11" ry="7" fill="url(#oceanCutaway)" opacity="0.9"/>

      <!-- Cosmic Golden/Amber Iris Layer -->
      <ellipse cx="0" cy="0" rx="8" ry="5.5" fill="#f59e0b" filter="url(#softGlow)"/>
      <ellipse cx="0" cy="0" rx="6" ry="4" fill="#fbbf24"/>

      <!-- Iris Rays / Starburst Rays Detail -->
      <path d="M -5 0 L 5 0 M 0 -3.5 L 0 3.5 M -3 -2 L 3 2 M -3 2 L 3 -2" stroke="#ffffff" stroke-width="0.75" opacity="0.8"/>

      <!-- Deep Void Pupil -->
      <ellipse cx="0" cy="0" rx="3.5" ry="2.5" fill="#030712"/>

      <!-- Catchlight Glints & Starlight Sparkles -->
      <circle cx="-2.5" cy="-1.8" r="1.8" fill="#ffffff" filter="url(#softGlow)"/>
      <circle cx="2" cy="1" r="1" fill="#ffffff"/>
      <circle cx="-1" cy="1.5" r="0.6" fill="#7dd3fc"/>

      <!-- Eyelid / Orbital Constellation Runes -->
      <path d="M -16 2 Q 0 8, 16 3" stroke="#38bdf8" stroke-width="1" fill="none" opacity="0.6"/>
      <circle cx="-16" cy="2" r="1.5" fill="#38bdf8" filter="url(#softGlow)"/>
      <circle cx="16" cy="3" r="1.5" fill="#38bdf8" filter="url(#softGlow)"/>
    </g>
  </g>

  <!-- ========================================== -->
  <!-- 3. TERRESTRIAL SPINE (LANDMASS BIOMES)     -->
  <!-- ========================================== -->
  <g id="terrestrialSpine">

    <!-- 3A. Forehead Cliffs & Ancient Arch Ruins -->
    <g id="foreheadRuins">
      <path d="M 150 280 L 175 265 L 220 262 L 230 285 Z" fill="#475569"/>
      <!-- Stone Arch -->
      <path d="M 180 265 L 180 250 C 180 242, 195 242, 195 250 L 195 264 Z" fill="#e2e8f0" stroke="#334155" stroke-width="1"/>
      <path d="M 202 263 L 202 254 C 202 248, 212 248, 212 254 L 212 263 Z" fill="#cbd5e1"/>
    </g>

    <!-- 3B. Lush Redwood/Pine Forest Zone -->
    <g id="pineForest">
      <!-- Forest Base Ground -->
      <path d="M 220 262 C 250 258, 290 260, 330 255 L 340 275 L 225 280 Z" fill="#15803d"/>

      <!-- Individual Pine Trees -->
      <!-- Tree cluster 1 -->
      <polygon points="235,262 240,240 245,262" fill="#166534"/>
      <polygon points="242,260 248,232 254,260" fill="#14532d"/>
      <polygon points="250,261 257,225 264,261" fill="#166534"/>
      <polygon points="260,259 265,238 270,259" fill="#15803d"/>
      <!-- Tree cluster 2 (Tall Redwoods) -->
      <polygon points="272,259 278,215 284,259" fill="#14532d"/>
      <polygon points="282,258 289,210 296,258" fill="#166534"/>
      <polygon points="294,257 300,222 306,257" fill="#15803d"/>
      <polygon points="304,257 311,230 318,257" fill="#14532d"/>
      <polygon points="315,256 322,240 329,256" fill="#166534"/>
    </g>

    <!-- 3C. Volcano / Geyser Vent Base -->
    <g id="volcanoBase">
      <path d="M 325 257 L 350 235 L 370 238 L 395 254 Z" fill="#334155" stroke="#1e293b" stroke-width="1"/>
      <!-- Magma fissure glowing inside crater -->
      <ellipse cx="360" cy="237" rx="9" ry="3" fill="#ef4444" filter="url(#softGlow)"/>
      <ellipse cx="360" cy="237" rx="5" ry="1.5" fill="#f97316"/>
    </g>

    <!-- 3D. Desert Dunes Biome -->
    <g id="desertBiome">
      <path d="M 390 254 C 420 250, 450 245, 480 252 C 500 256, 520 250, 540 248 L 545 268 L 385 272 Z" fill="url(#desertGrad)"/>
      <!-- Dune Ridges -->
      <path d="M 400 254 Q 425 260 450 251" stroke="#b45309" stroke-width="1.5" fill="none"/>
      <path d="M 445 252 Q 480 262 510 250" stroke="#b45309" stroke-width="1.5" fill="none"/>
      <path d="M 495 250 Q 520 258 540 248" stroke="#b45309" stroke-width="1" fill="none"/>
    </g>

    <!-- 3E. Agricultural Patchwork Fields -->
    <g id="farmFields">
      <!-- Polygon Crop Patchwork Grid -->
      <polygon points="538,248 575,243 582,258 542,263" fill="#15803d"/>
      <polygon points="575,243 610,240 618,254 582,258" fill="#eab308"/>
      <polygon points="542,263 582,258 588,272 546,275" fill="#a16207"/>
      <polygon points="582,258 618,254 625,268 588,272" fill="#4d7c0f"/>
      <!-- Crop Rows Lines -->
      <line x1="545" y1="250" x2="578" y2="245" stroke="#166534" stroke-width="0.8"/>
      <line x1="548" y1="254" x2="580" y2="249" stroke="#166534" stroke-width="0.8"/>
      <line x1="551" y1="258" x2="581" y2="253" stroke="#166534" stroke-width="0.8"/>
    </g>

    <!-- 3F. Jagged Snow-Capped Mountain Range -->
    <g id="mountainRange">
      <!-- Back Mountain Ridge (Darker) -->
      <polygon points="610,242 635,190 660,245" fill="url(#mountainShade)"/>
      <polygon points="650,245 680,175 715,248" fill="url(#mountainShade)"/>
      <polygon points="710,248 745,185 775,252" fill="url(#mountainShade)"/>

      <!-- Front Mountain Ridge (Detailed with Light/Shadow Facets) -->
      <!-- Peak 1 -->
      <polygon points="618,245 648,165 675,250" fill="#475569"/> <!-- Shadow side -->
      <polygon points="648,165 675,250 682,250" fill="#94a3b8"/> <!-- Light side -->
      <polygon points="648,165 638,190 655,198 662,185" fill="url(#snowCapGrad)"/> <!-- Snow cap -->

      <!-- Peak 2 (Tallest Central Peak) -->
      <polygon points="665,250 705,135 745,252" fill="#334155"/>
      <polygon points="705,135 745,252 752,252" fill="#cbd5e1"/>
      <polygon points="705,135 690,170 715,180 722,160" fill="url(#snowCapGrad)"/>

      <!-- Peak 3 -->
      <polygon points="735,252 770,160 810,260" fill="#475569"/>
      <polygon points="770,160 810,260 815,260" fill="#94a3b8"/>
      <polygon points="770,160 758,188 778,195 785,180" fill="url(#snowCapGrad)"/>

      <!-- Peak 4 (Eastern edge) -->
      <polygon points="800,260 830,195 860,270" fill="#334155"/>
      <polygon points="830,195 860,270 863,270" fill="#cbd5e1"/>
      <polygon points="830,195 820,215 838,220 842,210" fill="url(#snowCapGrad)"/>
    </g>

    <!-- 3G. Peduncle Plateau & Ancient Castle/Watchtower -->
    <g id="pedunclePlateau">
      <path d="M 850 268 L 890 285 L 940 330 L 840 270 Z" fill="#15803d"/>
      <!-- Small Ruins Tower -->
      <rect x="880" y="265" width="10" height="18" fill="#94a3b8" stroke="#334155" stroke-width="0.8"/>
      <path d="M 878 265 L 892 265 L 892 262 L 878 262 Z" fill="#64748b"/>
    </g>

  </g> <!-- End Terrestrial Spine -->

  <!-- ========================================== -->
  <!-- 4. ATMOSPHERE, VOLCANO CLOUD & AURORA      -->
  <!-- ========================================== -->
  <g id="atmosphereSystem">

    <!-- 4A. Volcano Blowhole Steam & Massive Cloud Canopy -->
    <g id="eruptionCloud" filter="url(#cloudShadow)">
      <!-- Vertical Plume Column from Blowhole -->
      <path d="M 345 237 C 330 180, 270 120, 290 60 C 330 60, 360 120, 375 237 Z" fill="url(#spoutPlume)"/>

      <!-- Layered Cumulus Cloud Roof (Spreading across upper back) -->
      <g fill="url(#cloudGrad)">
        <circle cx="280" cy="70" r="45"/>
        <circle cx="330" cy="50" r="55"/>
        <circle cx="400" cy="45" r="60"/>
        <circle cx="470" cy="40" r="65"/>
        <circle cx="540" cy="45" r="60"/>
        <circle cx="610" cy="50" r="55"/>
        <circle cx="670" cy="65" r="50"/>
        <circle cx="720" cy="85" r="40"/>
        <circle cx="360" cy="80" r="50"/>
        <circle cx="440" cy="75" r="55"/>
        <circle cx="520" cy="70" r="55"/>
        <circle cx="590" cy="75" r="50"/>
        <circle cx="650" cy="90" r="45"/>
      </g>
      <!-- Cloud Highlights (Top Bright Edges) -->
      <g fill="#ffffff" opacity="0.8">
        <circle cx="330" cy="42" r="45"/>
        <circle cx="400" cy="35" r="50"/>
        <circle cx="470" cy="30" r="55"/>
        <circle cx="540" cy="35" r="50"/>
        <circle cx="610" cy="42" r="45"/>
      </g>
    </g>

    <!-- 4B. COMPACT ATMOSPHERIC AURORA BOREALIS -->
    <!-- Tucked directly under the clouds & draped right above the mountain peaks -->
    <g id="localizedAurora" filter="url(#auroraGlow)">
      <!-- Main Wave Curtain 1 -->
      <path d="
        M 450 130 
        Q 520 80, 600 110 
        T 730 100 
        T 820 120 
        L 820 145 
        Q 730 125, 600 135 
        T 450 155 Z" 
        fill="url(#auroraRibbon)"/>

      <!-- Secondary Wave Curtain 2 (Lower & Intense Cyan/Green) -->
      <path d="
        M 480 145 
        Q 560 105, 640 130 
        T 770 125 
        L 770 142 
        Q 640 145, 560 120 
        T 480 160 Z" 
        fill="url(#auroraRibbon)" opacity="0.9"/>

      <!-- Vertical Light Rays inside Aurora -->
      <g stroke="#6ee7b7" stroke-width="1.5" opacity="0.6" stroke-linecap="round">
        <line x1="520" y1="100" x2="520" y2="140"/>
        <line x1="550" y1="92" x2="550" y2="135"/>
        <line x1="580" y1="95" x2="580" y2="142"/>
        <line x1="620" y1="105" x2="620" y2="148"/>
        <line x1="660" y1="100" x2="660" y2="140"/>
        <line x1="700" y1="98" x2="700" y2="132"/>
        <line x1="740" y1="108" x2="740" y2="138"/>
      </g>
    </g>

    <!-- 4C. Birds Flying in Atmosphere -->
    <g id="birds" stroke="#334155" stroke-width="1.2" fill="none" stroke-linecap="round">
      <path d="M 240 160 Q 245 153 250 160 Q 255 153 260 160"/>
      <path d="M 258 145 Q 262 139 266 145 Q 270 139 274 145"/>
      <path d="M 270 170 Q 274 165 278 170 Q 282 165 286 170"/>
      <path d="M 760 165 Q 764 160 768 165 Q 772 160 776 165"/>
      <path d="M 780 150 Q 783 146 786 150 Q 789 146 792 150"/>
    </g>

  </g> <!-- End Atmosphere System -->

  <!-- ========================================== -->
  <!-- 5. ICONIC REDESIGNED WHALE TAIL (FOREGROUND)-->
  <!-- ========================================== -->
  <g id="whaleTailFluke">
    <!-- Submerged Fluke Shadow Layer for Depth -->
    <path d="
      M 950 375 
      C 980 340, 1030 270, 1110 210 
      C 1135 195, 1150 205, 1130 230 
      C 1090 280, 1070 330, 1060 370 
      C 1070 410, 1090 460, 1130 510 
      C 1150 535, 1135 545, 1110 530 
      C 1030 470, 980 410, 950 375 Z" 
      fill="#030c1b" opacity="0.6"/>

    <!-- Main Majestic Whale Fluke (Front Layer attached cleanly to peduncle at 960,375) -->
    <path d="
      M 960 375 
      C 990 345, 1045 280, 1125 220 
      C 1150 205, 1165 215, 1145 240 
      C 1105 285, 1085 335, 1070 370 
      C 1085 405, 1105 455, 1145 500 
      C 1165 525, 1150 535, 1125 520 
      C 1045 460, 990 405, 960 375 Z" 
      fill="url(#whaleSkin)" stroke="#38bdf8" stroke-width="2.5" filter="url(#cloudShadow)"/>

    <!-- Fluke Leading Edge Highlight -->
    <path d="M 960 375 C 990 345, 1045 280, 1125 220 C 1150 205, 1165 215, 1145 240" stroke="#7dd3fc" stroke-width="1.5" fill="none" filter="url(#softGlow)"/>
    <path d="M 960 375 C 990 405, 1045 460, 1125 520 C 1150 535, 1165 525, 1145 500" stroke="#7dd3fc" stroke-width="1.5" fill="none" filter="url(#softGlow)"/>

    <!-- Bioluminescent Constellations & Map Lines Mapping the Fluke -->
    <path d="M 975 375 C 1010 335, 1060 280, 1120 240 M 975 375 C 1010 415, 1060 470, 1120 500" stroke="#38bdf8" stroke-width="1.5" fill="none" opacity="0.8" stroke-dasharray="4 3" filter="url(#softGlow)"/>
    <path d="M 1020 330 L 1050 310 M 1060 285 L 1090 265 M 1020 420 L 1050 440 M 1060 465 L 1090 485" stroke="#7dd3fc" stroke-width="1" fill="none" opacity="0.7"/>

    <circle cx="1020" cy="330" r="2.5" fill="#ffffff" filter="url(#softGlow)"/>
    <circle cx="1060" cy="285" r="2" fill="#7dd3fc"/>
    <circle cx="1120" cy="240" r="3" fill="#38bdf8" filter="url(#softGlow)"/>
    <circle cx="1020" cy="420" r="2.5" fill="#ffffff" filter="url(#softGlow)"/>
    <circle cx="1060" cy="465" r="2" fill="#7dd3fc"/>
    <circle cx="1120" cy="500" r="3" fill="#38bdf8" filter="url(#softGlow)"/>

    <!-- Small Mossy Forest Edge at Peduncle Base -->
    <path d="M 955 370 C 970 355, 985 365, 975 380 C 968 388, 958 382, 955 370 Z" fill="#15803d"/>
    <polygon points="965,360 970,348 975,360" fill="#166534"/>

    <!-- Cascading Waterfalls Dropping off Trailing Edges and Median Notch -->
    <!-- Upper Lobe Waterfalls -->
    <path d="M 1115 260 L 1115 310 M 1130 242 L 1130 290 M 1140 235 L 1140 275" stroke="url(#waterfallGrad)" stroke-width="2" stroke-linecap="round"/>
    <!-- Median Notch Waterfalls -->
    <path d="M 1070 370 L 1070 420 M 1075 375 L 1075 415" stroke="url(#waterfallGrad)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Lower Lobe Waterfalls -->
    <path d="M 1115 480 L 1115 530 M 1130 498 L 1130 545 M 1140 505 L 1140 540" stroke="url(#waterfallGrad)" stroke-width="2" stroke-linecap="round"/>

    <!-- Cosmic Stardust Trailing from Fluke Tips -->
    <g fill="#7dd3fc" opacity="0.9">
      <circle cx="1155" cy="215" r="2.5" filter="url(#softGlow)"/>
      <circle cx="1170" cy="225" r="1.5"/>
      <circle cx="1182" cy="220" r="1"/>
      <circle cx="1155" cy="525" r="2.5" filter="url(#softGlow)"/>
      <circle cx="1170" cy="515" r="1.5"/>
      <circle cx="1182" cy="520" r="1"/>
    </g>
  </g>

</svg>` 
            },
            { 
                id: 'm-chrono', 
                name: 'Chrono Guardian', 
                tier: 4, 
                unlockSec: 432000, 
                shapes: '150 Shapes', 
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="100%" height="100%">
  <defs>
    <!-- Metallic Armor Gradients -->
    <linearGradient id="obsidianArmor" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a3245"/>
      <stop offset="40%" stop-color="#151924"/>
      <stop offset="85%" stop-color="#0b0d14"/>
      <stop offset="100%" stop-color="#05060a"/>
    </linearGradient>

    <linearGradient id="brassGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe899"/>
      <stop offset="30%" stop-color="#d4af37"/>
      <stop offset="70%" stop-color="#aa7c11"/>
      <stop offset="100%" stop-color="#5a3d00"/>
    </linearGradient>

    <linearGradient id="polishedSteel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#9aa5b8"/>
      <stop offset="70%" stop-color="#475266"/>
      <stop offset="100%" stop-color="#1d2330"/>
    </linearGradient>

    <!-- Energy Gradients -->
    <linearGradient id="chronoCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#73f6ff"/>
      <stop offset="70%" stop-color="#00aaff"/>
      <stop offset="100%" stop-color="#002b80"/>
    </linearGradient>

    <radialGradient id="coreEnergy" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#66f0ff"/>
      <stop offset="70%" stop-color="#0055ff"/>
      <stop offset="100%" stop-color="#000b33"/>
    </radialGradient>

    <!-- Glow Filters -->
    <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12" result="blur1"/>
      <feGaussianBlur stdDeviation="5" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="20" result="blur1"/>
      <feGaussianBlur stdDeviation="8" result="blur2"/>
      <feComponentTransfer in="blur1" result="boost">
        <feFuncA type="linear" slope="1.5"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode in="boost"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- REUSABLE ASSETS: CLOCKWORK GEAR TEMPLATES -->
    <!-- Heavy Brass Gear (12 Teeth) -->
    <g id="gear-12teeth">
      <circle cx="0" cy="0" r="90" fill="url(#brassGold)"/>
      <!-- Teeth -->
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(30)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(60)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(90)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(120)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(150)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(180)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(210)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(240)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(270)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(300)"/>
      <path d="M-12,-110 L12,-110 L15,-90 L-15,-90 Z" fill="url(#brassGold)" transform="rotate(330)"/>
      <!-- Inner Cutouts & Spokes -->
      <circle cx="0" cy="0" r="72" fill="#0d111a"/>
      <circle cx="0" cy="0" r="65" fill="none" stroke="url(#brassGold)" stroke-width="4"/>
      <!-- Spokes -->
      <rect x="-6" y="-65" width="12" height="130" fill="url(#brassGold)"/>
      <rect x="-6" y="-65" width="12" height="130" fill="url(#brassGold)" transform="rotate(60)"/>
      <rect x="-6" y="-65" width="12" height="130" fill="url(#brassGold)" transform="rotate(120)"/>
      <circle cx="0" cy="0" r="28" fill="url(#brassGold)"/>
      <circle cx="0" cy="0" r="14" fill="#05070a"/>
    </g>

    <!-- Holographic Cyan Energy Gear -->
    <g id="gear-holo">
      <circle cx="0" cy="0" r="100" fill="none" stroke="#00f0ff" stroke-width="2" stroke-dasharray="8,4" opacity="0.8"/>
      <circle cx="0" cy="0" r="88" fill="none" stroke="url(#chronoCyan)" stroke-width="3"/>
      <!-- Outer teeth -->
      <g stroke="#00f0ff" stroke-width="2" fill="none">
        <path d="M-8,-100 L8,-100 L10,-88 L-10,-88 Z" />
        <path d="M-8,-100 L8,-100 L10,-88 L-10,-88 Z" transform="rotate(45)"/>
        <path d="M-8,-100 L8,-100 L10,-88 L-10,-88 Z" transform="rotate(90)"/>
        <path d="M-8,-100 L8,-100 L10,-88 L-10,-88 Z" transform="rotate(135)"/>
        <path d="M-8,-100 L8,-100 L10,-88 L-10,-88 Z" transform="rotate(180)"/>
        <path d="M-8,-100 L8,-100 L10,-88 L-10,-88 Z" transform="rotate(225)"/>
        <path d="M-8,-100 L8,-100 L10,-88 L-10,-88 Z" transform="rotate(270)"/>
        <path d="M-8,-100 L8,-100 L10,-88 L-10,-88 Z" transform="rotate(315)"/>
      </g>
      <!-- Geometric Time Runic Ring -->
      <circle cx="0" cy="0" r="60" fill="none" stroke="#00f0ff" stroke-width="1.5" opacity="0.6"/>
      <polygon points="0,-60 51.9,30 -51.9,30" fill="none" stroke="#00f0ff" stroke-width="1.5" opacity="0.5"/>
      <polygon points="0,60 51.9,-30 -51.9,-30" fill="none" stroke="#00f0ff" stroke-width="1.5" opacity="0.5"/>
      <circle cx="0" cy="0" r="20" fill="none" stroke="#ffffff" stroke-width="2"/>
    </g>

    <!-- Floating Hourglass Particle -->
    <g id="timeDust">
      <circle cx="0" cy="0" r="2" fill="#ffffff" filter="url(#cyanGlow)"/>
      <circle cx="0" cy="0" r="4" fill="#00f0ff" opacity="0.6" filter="url(#cyanGlow)"/>
    </g>
  </defs>

  <!-- 1. BACKGROUND FLOATING GEARS (Deep Perspective Layer) -->
  <g id="back-gears">
    <!-- Top Left Deep Gear -->
    <use href="#gear-12teeth" x="220" y="250" transform="scale(0.8) rotate(15)" opacity="0.5" />
    <use href="#gear-holo" x="220" y="250" transform="scale(1.1) rotate(45)" filter="url(#cyanGlow)" opacity="0.6"/>

    <!-- Top Right Medium Gear -->
    <use href="#gear-12teeth" x="960" y="280" transform="scale(1.2) rotate(40)" opacity="0.6"/>
    
    <!-- Bottom Left Large Gear -->
    <use href="#gear-12teeth" x="180" y="850" transform="scale(1.5) rotate(80)" opacity="0.4"/>
  </g>

  <!-- 2. MECH GUARDIAN - BACK WINGS / CHRONO THRUSTERS -->
  <g id="mech-back-wings" transform="translate(600, 520)">
    <!-- Floating Mechanical Halo Wings (Left & Right) -->
    <!-- Left Wing -->
    <path d="M-80,-100 C-220,-220 -380,-200 -480,-100 C-380,-50 -260,-60 -80,-30 Z" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="3"/>
    <path d="M-120,-115 C-240,-200 -360,-180 -440,-100" fill="none" stroke="#00f0ff" stroke-width="3" filter="url(#cyanGlow)"/>
    
    <!-- Right Wing -->
    <path d="M80,-100 C220,-220 380,-200 480,-100 C380,-50 260,-60 80,-30 Z" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="3"/>
    <path d="M120,-115 C240,-200 360,-180 440,-100" fill="none" stroke="#00f0ff" stroke-width="3" filter="url(#cyanGlow)"/>

    <!-- Wing Pendulum Blades / Time Needles -->
    <path d="M-480,-100 L-540,-50 L-420,-40 Z" fill="url(#brassGold)"/>
    <path d="M480,-100 L540,-50 L420,-40 Z" fill="url(#brassGold)"/>
  </g>

  <!-- 3. MECH GUARDIAN - MAIN BODY ASSEMBLY -->
  <g id="mech-guardian">
    
    <!-- LEGS & LOWER BODY -->
    <g id="legs" transform="translate(600, 750)">
      <!-- Left Leg -->
      <path d="M-140,80 L-180,220 L-120,320 L-60,320 L-80,200 L-60,80 Z" fill="url(#obsidianArmor)" stroke="#1a2233" stroke-width="2"/>
      <path d="M-180,220 L-120,320 L-200,340 L-240,320 Z" fill="url(#polishedSteel)"/>
      <path d="M-140,90 L-170,210" fill="none" stroke="url(#brassGold)" stroke-width="4"/>

      <!-- Right Leg -->
      <path d="M140,80 L180,220 L120,320 L60,320 L80,200 L60,80 Z" fill="url(#obsidianArmor)" stroke="#1a2233" stroke-width="2"/>
      <path d="M180,220 L120,320 L200,340 L240,320 Z" fill="url(#polishedSteel)"/>
      <path d="M140,90 L170,210" fill="none" stroke="url(#brassGold)" stroke-width="4"/>

      <!-- Knee Armor Plates with Clockwork Rotors -->
      <circle cx="-130" cy="180" r="32" fill="url(#brassGold)"/>
      <circle cx="-130" cy="180" r="22" fill="#0b0d14"/>
      <circle cx="-130" cy="180" r="10" fill="#00f0ff" filter="url(#cyanGlow)"/>

      <circle cx="130" cy="180" r="32" fill="url(#brassGold)"/>
      <circle cx="130" cy="180" r="22" fill="#0b0d14"/>
      <circle cx="130" cy="180" r="10" fill="#00f0ff" filter="url(#cyanGlow)"/>

      <!-- Tassets / Faulds (Hanging Hip Armor) -->
      <path d="M-120,10 L-160,110 L-80,140 L-40,10 Z" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="2"/>
      <path d="M120,10 L160,110 L80,140 L40,10 Z" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="2"/>
      <path d="M-40,10 L-50,150 L0,170 L50,150 L40,10 Z" fill="url(#polishedSteel)" stroke="url(#brassGold)" stroke-width="2"/>
    </g>

    <!-- TORSO & TEMPORAL CORE REACTOR -->
    <g id="torso" transform="translate(600, 500)">
      <!-- Abdominal Segment / Mechanism -->
      <path d="M-90,120 L90,120 L110,240 L-110,240 Z" fill="url(#obsidianArmor)"/>
      <!-- Spine Pistons -->
      <rect x="-70" y="130" width="20" height="90" fill="url(#polishedSteel)"/>
      <rect x="-10" y="130" width="20" height="90" fill="url(#polishedSteel)"/>
      <rect x="50" y="130" width="20" height="90" fill="url(#polishedSteel)"/>
      
      <!-- Main Chest Plate -->
      <path d="M-160,-60 L160,-60 L200,60 L120,140 L-120,140 L-200,60 Z" fill="url(#obsidianArmor)" stroke="#2a354d" stroke-width="3"/>
      
      <!-- Golden Chest Filigree / Frame -->
      <path d="M-160,-60 L0,-30 L160,-60 L180,40 L110,120 L0,50 L-110,120 L-180,40 Z" fill="none" stroke="url(#brassGold)" stroke-width="5"/>

      <!-- CENTRAL TEMPORAL CORE (Hourglass Gyroscope) -->
      <circle cx="0" cy="30" r="65" fill="#040812" stroke="url(#brassGold)" stroke-width="6"/>
      <circle cx="0" cy="30" r="55" fill="url(#coreEnergy)" filter="url(#intenseGlow)"/>

      <!-- Inner Spinning Gyro Rings -->
      <ellipse cx="0" cy="30" rx="50" ry="18" fill="none" stroke="#ffffff" stroke-width="2" transform="rotate(30, 0, 30)"/>
      <ellipse cx="0" cy="30" rx="50" ry="18" fill="none" stroke="url(#brassGold)" stroke-width="3" transform="rotate(-45, 0, 30)"/>

      <!-- Futuristic Energy Hourglass inside Core -->
      <polygon points="-18,-12 18,-12 0,26" fill="#ffffff" opacity="0.9" filter="url(#cyanGlow)"/>
      <polygon points="-18,72 18,72 0,34" fill="#ffffff" opacity="0.9" filter="url(#cyanGlow)"/>
    </g>

    <!-- HEAVY PAULDRONS (SHOULDERS) -->
    <g id="shoulders" transform="translate(600, 420)">
      <!-- Left Shoulder -->
      <g>
        <path d="M-150,-10 C-220,-80 -320,-40 -310,60 C-250,120 -180,100 -140,20 Z" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="3"/>
        <path d="M-180,-30 C-240,-70 -290,-30 -280,40" fill="none" stroke="#00f0ff" stroke-width="3" filter="url(#cyanGlow)"/>
        <!-- Embedded Gear in Shoulder -->
        <circle cx="-230" cy="15" r="25" fill="url(#brassGold)"/>
        <circle cx="-230" cy="15" r="15" fill="#0a0d14"/>
      </g>

      <!-- Right Shoulder -->
      <g>
        <path d="M150,-10 C220,-80 320,-40 310,60 C250,120 180,100 140,20 Z" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="3"/>
        <path d="M180,-30 C240,-70 290,-30 280,40" fill="none" stroke="#00f0ff" stroke-width="3" filter="url(#cyanGlow)"/>
        <!-- Embedded Gear in Shoulder -->
        <circle cx="230" cy="15" r="25" fill="url(#brassGold)"/>
        <circle cx="230" cy="15" r="15" fill="#0a0d14"/>
      </g>
    </g>

    <!-- HEAD & TEMPORAL HELM -->
    <g id="head" transform="translate(600, 360)">
      <!-- Neck Mechanical Plating -->
      <path d="M-40,20 L40,20 L50,60 L-50,60 Z" fill="url(#polishedSteel)"/>
      <line x1="-30" y1="30" x2="30" y2="30" stroke="#00f0ff" stroke-width="2" filter="url(#cyanGlow)"/>

      <!-- Helm Main Form -->
      <path d="M-50,-10 L0,-70 L50,-10 L60,40 L0,70 L-60,40 Z" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="3"/>
      
      <!-- Side Crests / Clock Hand Antennas -->
      <path d="M-50,-10 L-110,-80 L-60,-40 Z" fill="url(#brassGold)"/>
      <path d="M50,-10 L110,-80 L60,-40 Z" fill="url(#brassGold)"/>

      <!-- Crown / Sundial Spikes -->
      <path d="M-30,-50 L-40,-100 L-15,-60 L0,-110 L15,-60 L40,-100 L30,-50 Z" fill="url(#brassGold)"/>

      <!-- Glowing Chrono Visor (Eye Slot) -->
      <polygon points="-42,0 0,-15 42,0 35,18 0,10 -35,18" fill="#ffffff" filter="url(#intenseGlow)"/>
      <polygon points="-42,0 0,-15 42,0 35,18 0,10 -35,18" fill="#00f0ff" opacity="0.8"/>
      <!-- Single Central Cybernetic Lens Eye -->
      <circle cx="0" cy="2" r="7" fill="#ffffff" filter="url(#cyanGlow)"/>

      <!-- Face Plate Markings -->
      <path d="M0,10 L0,55" stroke="url(#brassGold)" stroke-width="3"/>
      <line x1="-25" y1="35" x2="25" y2="35" stroke="url(#brassGold)" stroke-width="2"/>
    </g>

    <!-- ARMS & WEAPONS -->
    <!-- Guardian's Right Arm (Viewer's Left) with FACELESS CLOCK SHIELD -->
    <g id="left-arm" transform="translate(360, 460)">
      <!-- Bicep -->
      <path d="M10,0 L-40,80 L0,120 L40,40 Z" fill="url(#obsidianArmor)"/>
      <!-- Forearm Gauntlet -->
      <path d="M-20,100 L-80,200 L-20,230 L20,130 Z" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="2"/>
      <circle cx="-45" cy="165" r="16" fill="url(#brassGold)"/>

      <!-- FACELESS CLOCK SHIELD -->
      <g id="clock-shield" transform="translate(-75, 220) rotate(-15)">
        <!-- Outer Clockwork Teeth Ring -->
        <circle cx="0" cy="0" r="115" fill="none" stroke="url(#brassGold)" stroke-width="9" stroke-dasharray="12,18.1"/>
        
        <!-- Main Shield Outer Rim -->
        <circle cx="0" cy="0" r="108" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="6" filter="url(#goldGlow)"/>
        <circle cx="0" cy="0" r="96" fill="url(#polishedSteel)" stroke="url(#brassGold)" stroke-width="2"/>
        <circle cx="0" cy="0" r="86" fill="url(#obsidianArmor)" stroke="url(#chronoCyan)" stroke-width="2" opacity="0.85"/>

        <!-- 12 Hour Tick Markers (Faceless) -->
        <g stroke="url(#brassGold)" stroke-width="3.5" stroke-linecap="round" fill="none">
          <line x1="0" y1="-93" x2="0" y2="-80"/>
          <line x1="46.5" y1="-80.5" x2="40" y2="-69.2"/>
          <line x1="80.5" y1="-46.5" x2="69.2" y2="-40"/>
          <line x1="93" y1="0" x2="80" y2="0"/>
          <line x1="80.5" y1="46.5" x2="69.2" y2="40"/>
          <line x1="46.5" y1="80.5" x2="40" y2="69.2"/>
          <line x1="0" y1="93" x2="0" y2="80"/>
          <line x1="-46.5" y1="80.5" x2="-40" y2="69.2"/>
          <line x1="-80.5" y1="46.5" x2="-69.2" y2="40"/>
          <line x1="-93" y1="0" x2="-80" y2="0"/>
          <line x1="-80.5" y1="-46.5" x2="-69.2" y2="-40"/>
          <line x1="-46.5" y1="-80.5" x2="-40" y2="-69.2"/>
        </g>

        <!-- Inner Shield Plate & Concentric Chrono Rings -->
        <circle cx="0" cy="0" r="68" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="2"/>
        <circle cx="0" cy="0" r="48" fill="none" stroke="#00f0ff" stroke-width="2" stroke-dasharray="6,6" filter="url(#cyanGlow)"/>

        <!-- Central Shield Core Boss -->
        <circle cx="0" cy="0" r="32" fill="url(#brassGold)"/>
        <circle cx="0" cy="0" r="22" fill="url(#coreEnergy)" filter="url(#intenseGlow)"/>
        <circle cx="0" cy="0" r="9" fill="#ffffff"/>
      </g>
    </g>

    <!-- Guardian's Left Arm (Viewer's Right - Holding Chrono Blade Staff Pointing Away) -->
    <g id="right-arm" transform="translate(840, 460)">
      <!-- Bicep -->
      <path d="M-10,0 L40,80 L0,120 L-40,40 Z" fill="url(#obsidianArmor)"/>
      <!-- Forearm Gauntlet -->
      <path d="M0,110 L40,220 L80,200 L20,100 Z" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="2"/>
      
      <!-- CHRONO BLADE STAFF (Rotated Away From Head + Gear Removed) -->
      <g id="staff" transform="translate(50, 160) rotate(35)">
        <!-- Staff Shaft -->
        <rect x="-12" y="-550" width="24" height="1000" fill="url(#polishedSteel)" rx="5"/>
        <rect x="-6" y="-550" width="12" height="1000" fill="url(#brassGold)"/>

        <!-- Staff Head Mechanism -->
        <circle cx="0" cy="-450" r="65" fill="#050810" stroke="url(#brassGold)" stroke-width="5"/>
        <circle cx="0" cy="-450" r="45" fill="url(#coreEnergy)" filter="url(#cyanGlow)"/>

        <!-- Large Curved Temporal Scythe Blades -->
        <path d="M30,-480 C120,-580 180,-520 220,-380 C140,-420 60,-420 0,-420 Z" fill="url(#brassGold)" filter="url(#goldGlow)"/>
        <path d="M40,-470 C110,-550 160,-500 195,-390 C130,-415 70,-415 10,-415 Z" fill="#ffffff" filter="url(#cyanGlow)"/>

        <path d="M-30,-480 C-120,-580 -180,-520 -220,-380 C-140,-420 -60,-420 0,-420 Z" fill="url(#brassGold)" filter="url(#goldGlow)"/>
        <path d="M-40,-470 C-110,-550 -160,-500 -195,-390 C-130,-415 -70,-415 -10,-415 Z" fill="#ffffff" filter="url(#cyanGlow)"/>

        <!-- Bottom Spear Tip -->
        <polygon points="-15,400 15,400 0,480" fill="url(#brassGold)"/>
      </g>

      <!-- Clenched Hand Gauntlet -->
      <circle cx="42" cy="180" r="22" fill="url(#obsidianArmor)" stroke="url(#brassGold)" stroke-width="3"/>
    </g>
  </g>

  <!-- 4. FOREGROUND FLOATING CLOCKWORK GEARS (Dynamic Overlap & Perspective) -->
  <g id="foreground-gears">
    <!-- Mid-Right Floating Brass Gear (Angled/Skewed Effect) -->
    <g transform="translate(980, 680) rotate(-25) scale(1, 0.75)">
      <use href="#gear-12teeth" x="0" y="0" transform="scale(1.4)" filter="url(#goldGlow)"/>
    </g>

    <!-- Front Left Hovering Cyan Holographic Gear (Close to Camera) -->
    <g transform="translate(260, 720) rotate(35) scale(1.3)">
      <use href="#gear-holo" x="0" y="0" filter="url(#intenseGlow)"/>
      <!-- Rotating Clock Hands on the Holographic Gear -->
      <line x1="0" y1="0" x2="0" y2="-55" stroke="#ffffff" stroke-width="4" stroke-linecap="round" filter="url(#cyanGlow)"/>
      <line x1="0" y1="0" x2="35" y2="20" stroke="#ffffff" stroke-width="3" stroke-linecap="round" filter="url(#cyanGlow)"/>
      <circle cx="0" cy="0" r="6" fill="#ffffff"/>
    </g>

    <!-- Top Right Small Accent Gear -->
    <g transform="translate(780, 220) rotate(50)">
      <use href="#gear-12teeth" x="0" y="0" transform="scale(0.6)"/>
    </g>

    <!-- Center-Left Medium Floating Brass Gear -->
    <g transform="translate(420, 280) rotate(-10) scale(0.85)">
      <use href="#gear-12teeth" x="0" y="0"/>
      <use href="#gear-holo" x="0" y="0" transform="scale(0.9)" filter="url(#cyanGlow)"/>
    </g>
  </g>

  <!-- 5. TEMPORAL ENERGY ARCS & TIME DISTORTION EFFECTS -->
  <g id="temporal-effects">
    <!-- Energy Lightning Arcs between Gears & Mech -->
    <path d="M 280,620 Q 340,550 420,580 T 540,530" fill="none" stroke="#00f0ff" stroke-width="3" opacity="0.8" filter="url(#cyanGlow)"/>
    <path d="M 900,580 Q 820,640 760,590 T 660,650" fill="none" stroke="#00f0ff" stroke-width="2.5" opacity="0.7" filter="url(#cyanGlow)"/>
    <path d="M 600,300 Q 680,220 780,220" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.9" filter="url(#cyanGlow)"/>

    <!-- Floating Glowing Roman Numerals (Dispersing in Time) -->
    <g fill="#00f0ff" font-family="'Times New Roman', serif" font-size="28" font-weight="bold" filter="url(#cyanGlow)" opacity="0.8">
      <text x="290" y="600" transform="rotate(-15, 290, 600)">XII</text>
      <text x="850" y="750" transform="rotate(20, 850, 750)">III</text>
      <text x="360" y="240" transform="rotate(-10, 360, 240)">VI</text>
      <text x="820" y="180" transform="rotate(15, 820, 180)">IX</text>
    </g>

    <!-- Floating Time Particles (Golden & Cyan Hourglass Sand) -->
    <use href="#timeDust" x="580" y="480" transform="scale(2.5)"/>
    <use href="#timeDust" x="620" y="520" transform="scale(1.8)"/>
    <use href="#timeDust" x="280" y="680" transform="scale(2)"/>
    <use href="#timeDust" x="320" y="740"/>
    <use href="#timeDust" x="920" y="620" transform="scale(2.2)"/>
    <use href="#timeDust" x="860" y="660"/>
    <use href="#timeDust" x="600" y="260" transform="scale(1.5)"/>
  </g>
</svg>` 
            }
        ];
