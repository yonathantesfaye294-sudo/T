import React from 'react';
import { LogoItem } from '../types';

export const REVEAL_STAGES = [
  {
    stage: 1,
    label: 'Heavy Distortion',
    blurPx: 22,
    pixelation: 24,
    points: 100,
    multiplier: '3.0x',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    description: 'Logo is 80% distorted — maximum risk & reward!',
  },
  {
    stage: 2,
    label: 'Partial Reveal',
    blurPx: 12,
    pixelation: 12,
    points: 75,
    multiplier: '2.0x',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Logo is 50% blurred — moderate points',
  },
  {
    stage: 3,
    label: 'Mild Focus',
    blurPx: 5,
    pixelation: 4,
    points: 50,
    multiplier: '1.5x',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    description: 'Logo is mostly visible — safe guess',
  },
  {
    stage: 4,
    label: 'Clear View',
    blurPx: 0,
    pixelation: 0,
    points: 25,
    multiplier: '1.0x',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Logo is fully visible — minimum points',
  },
];

export const LOGO_DATABASE: LogoItem[] = [
  // ==========================================
  // ETHIOPIAN LOCAL BRANDS (Major Differentiator)
  // ==========================================
  {
    id: 'ethiopian-airlines',
    name: 'Ethiopian Airlines',
    category: 'Aviation',
    region: 'ethiopia',
    options: ['Ethiopian Airlines', 'Kenya Airways', 'EgyptAir', 'Emirates'],
    clue: "Africa's largest airline carrier, famous for its green, yellow & red tail plumage and 'The New Spirit of Africa' slogan.",
    funFact: 'Founded in 1945, Ethiopian Airlines is one of the fastest-growing airline groups globally and operates to over 130 destinations.',
    difficulty: 'easy',
    colorTheme: '#0b6623',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Ethiopian Flag Tail Fin */}
        <path d="M 40 160 L 120 30 C 135 25 160 30 165 50 L 150 160 Z" fill="#008000" />
        <path d="M 60 160 L 130 50 C 145 45 165 55 165 70 L 150 160 Z" fill="#FFD700" />
        <path d="M 85 160 L 140 70 C 155 70 165 85 165 95 L 150 160 Z" fill="#DA121A" />
        {/* Flying stylized bird/airplane motif */}
        <path d="M 50 110 Q 110 80 170 85 Q 120 110 70 125 Z" fill="#FFFFFF" />
        <circle cx="140" cy="80" r="10" fill="#FFD700" opacity="0.9" />
        <text x="100" y="185" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" letterSpacing="1">ETHIOPIAN</text>
      </svg>
    ),
  },
  {
    id: 'telebirr',
    name: 'telebirr',
    category: 'Finance',
    region: 'ethiopia',
    options: ['telebirr', 'M-Pesa', 'CBE Birr', 'E-Birr'],
    clue: "Ethiopia's leading mobile money super-app launched by Ethio telecom in 2021.",
    funFact: 'Telebirr surpassed 40 million users within three years of launch, driving Ethiopia’s digital cash revolution.',
    difficulty: 'easy',
    colorTheme: '#00a8e8',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#00A3E0" />
        {/* Yellow coin curved swoosh */}
        <path d="M 45 95 C 45 50 155 40 160 85 C 165 130 60 155 45 95 Z" fill="#FFCC00" />
        {/* Mobile bird / coin slit */}
        <circle cx="100" cy="95" r="30" fill="#00A3E0" />
        <path d="M 92 75 L 115 95 L 92 115 Z" fill="#FFFFFF" />
        <text x="100" y="172" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="sans-serif">telebirr</text>
      </svg>
    ),
  },
  {
    id: 'ethio-telecom',
    name: 'Ethio Telecom',
    category: 'Telecom',
    region: 'ethiopia',
    options: ['Ethio Telecom', 'Safaricom Ethiopia', 'MTN', 'Orange'],
    clue: "The historic national telecommunications service provider of Ethiopia, established over a century ago in 1894.",
    funFact: 'It was originally established during Emperor Menelik II’s reign with the introduction of telephone lines between Harar and Addis Ababa.',
    difficulty: 'easy',
    colorTheme: '#0072bc',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#F8FAFC" />
        {/* Interlocking green & cyan communication arcs */}
        <circle cx="100" cy="85" r="45" fill="none" stroke="#8DC63F" strokeWidth="12" strokeDasharray="60 30" />
        <circle cx="100" cy="85" r="28" fill="none" stroke="#0072BC" strokeWidth="10" strokeDasharray="40 20" />
        <circle cx="100" cy="85" r="12" fill="#8DC63F" />
        <text x="100" y="152" textAnchor="middle" fill="#0072BC" fontSize="15" fontWeight="900">ethio telecom</text>
        <text x="100" y="172" textAnchor="middle" fill="#8DC63F" fontSize="12" fontWeight="700">ኢትዮ ቴሌኮም</text>
      </svg>
    ),
  },
  {
    id: 'cbe',
    name: 'Commercial Bank of Ethiopia',
    category: 'Finance',
    region: 'ethiopia',
    options: ['Commercial Bank of Ethiopia', 'Awash Bank', 'Dashen Bank', 'National Bank of Ethiopia'],
    clue: "The largest commercial bank in Ethiopia with distinctive purple branding, an iconic skyscraper in Addis Ababa.",
    funFact: 'CBE operates over 1,900 branches across Ethiopia and its new headquarters is the tallest building in East Africa at 209m.',
    difficulty: 'easy',
    colorTheme: '#5e2750',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Purple Shield */}
        <path d="M 40 40 L 160 40 C 160 110 130 155 100 175 C 70 155 40 110 40 40 Z" fill="#5E2750" stroke="#E5A823" strokeWidth="6" />
        {/* Golden inner coin / scales symbol */}
        <circle cx="100" cy="95" r="35" fill="#E5A823" />
        <path d="M 85 95 L 115 95 M 100 80 L 100 115" stroke="#5E2750" strokeWidth="6" strokeLinecap="round" />
        <polygon points="100,75 110,90 90,90" fill="#5E2750" />
        <text x="100" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900">CBE</text>
      </svg>
    ),
  },
  {
    id: 'awash-bank',
    name: 'Awash Bank',
    category: 'Finance',
    region: 'ethiopia',
    options: ['Awash Bank', 'Bank of Abyssinia', 'Nib Bank', 'Cooperative Bank of Oromia'],
    clue: "The first private commercial bank in Ethiopia established post-1991, with blue and red rising chevrons.",
    funFact: 'Named after the historic Awash River, the cradle of mankind where the fossil Lucy (Dinknesh) was discovered.',
    difficulty: 'medium',
    colorTheme: '#002f6c',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="25" fill="#FFFFFF" />
        {/* Rising sun blue & red chevron waves */}
        <path d="M 40 120 L 100 50 L 160 120 L 135 120 L 100 80 L 65 120 Z" fill="#002F6C" />
        <path d="M 65 125 L 100 88 L 135 125 L 120 125 L 100 102 L 80 125 Z" fill="#D9222A" />
        <circle cx="100" cy="65" r="10" fill="#D9222A" />
        <text x="100" y="160" textAnchor="middle" fill="#002F6C" fontSize="17" fontWeight="900">AWASH BANK</text>
      </svg>
    ),
  },
  {
    id: 'dashen-bank',
    name: 'Dashen Bank',
    category: 'Finance',
    region: 'ethiopia',
    options: ['Dashen Bank', 'Wegagen Bank', 'Zemen Bank', 'Enat Bank'],
    clue: "Named after Mount Ras Dashen (the highest peak in Ethiopia), this bank features a distinct blue and gold diamond mark.",
    funFact: 'Ras Dashen stands at 4,550 meters above sea level in the scenic Simien Mountains National Park.',
    difficulty: 'medium',
    colorTheme: '#004B87',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#004B87" />
        {/* Mountain diamond peak in gold & white */}
        <polygon points="100,45 145,100 100,155 55,100" fill="none" stroke="#FDB913" strokeWidth="8" />
        <polygon points="100,60 130,100 100,140 70,100" fill="#FFFFFF" />
        <polygon points="100,75 118,100 100,125 82,100" fill="#004B87" />
        <text x="100" y="180" textAnchor="middle" fill="#FDB913" fontSize="13" fontWeight="800" letterSpacing="1.5">DASHEN</text>
      </svg>
    ),
  },
  {
    id: 'bank-of-abyssinia',
    name: 'Bank of Abyssinia',
    category: 'Finance',
    region: 'ethiopia',
    options: ['Bank of Abyssinia', 'Oromia Bank', 'Hibret Bank', 'Amhara Bank'],
    clue: "Carries the historic golden Lion of Judah emblem, named after ancient Abyssinia.",
    funFact: 'The original Bank of Abyssinia was established in 1905 under Emperor Menelik II, minting the first Ethiopian banknotes.',
    difficulty: 'medium',
    colorTheme: '#f39c12',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0B1A30" />
        {/* Golden Crowned Lion */}
        <circle cx="100" cy="85" r="50" fill="#F39C12" opacity="0.15" />
        <path d="M 80 60 C 80 50 120 50 120 60 L 125 75 C 135 85 130 110 115 115 L 105 125 L 85 125 L 75 110 C 65 95 70 75 80 60 Z" fill="#F39C12" />
        {/* Crown on lion */}
        <polygon points="90,50 95,40 100,48 105,40 110,50" fill="#FFFFFF" />
        <circle cx="93" cy="75" r="4" fill="#0B1A30" />
        <text x="100" y="155" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800">BANK OF ABYSSINIA</text>
        <text x="100" y="175" textAnchor="middle" fill="#F39C12" fontSize="11" fontWeight="700">የአቢሲንያ ባንክ</text>
      </svg>
    ),
  },
  {
    id: 'saint-george-sc',
    name: 'Saint George SC',
    category: 'Sports',
    region: 'ethiopia',
    options: ['Saint George SC', 'Ethiopian Coffee SC', 'Fasil Kenema SC', 'Bahir Dar Kenema'],
    clue: "Ethiopia's most successful football club (Kidus Giorgis), founded in 1935 with historic yellow & red stripes.",
    funFact: 'Saint George SC has won a record 31 Ethiopian Premier League titles and was founded as a symbol of Ethiopian resistance.',
    difficulty: 'easy',
    colorTheme: '#e60000',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Shield */}
        <path d="M 40 40 L 160 40 C 160 115 130 160 100 180 C 70 160 40 115 40 40 Z" fill="#FFDD00" stroke="#D32F2F" strokeWidth="7" />
        {/* Red stripes */}
        <path d="M 65 40 L 65 140 C 75 152 85 160 100 170 L 100 40 Z" fill="#D32F2F" />
        <path d="M 135 40 L 135 140 C 125 152 115 160 100 170 L 100 40 Z" fill="#D32F2F" opacity="0.3" />
        {/* Saint George spear & horse silhouette */}
        <circle cx="100" cy="95" r="28" fill="#FFFFFF" stroke="#D32F2F" strokeWidth="3" />
        <polygon points="100,75 106,90 94,90" fill="#D32F2F" />
        <line x1="88" y1="110" x2="112" y2="80" stroke="#D32F2F" strokeWidth="4" />
        <text x="100" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">KIDUS GIORGIS</text>
      </svg>
    ),
  },
  {
    id: 'habesha-beer',
    name: 'Habesha Beer',
    category: 'Food & Beverage',
    region: 'ethiopia',
    options: ['Habesha Beer', 'Walia Beer', 'St. George Beer', 'Harar Beer'],
    clue: "Popular Ethiopian brewery with the slogan 'Reach for the Golden Warrior' featuring an iconic traditional head profile.",
    funFact: 'Brewed in Debre Birhan with 100% Ethiopian pure highland water.',
    difficulty: 'medium',
    colorTheme: '#c99218',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#1C1C1C" stroke="#C99218" strokeWidth="6" />
        {/* Golden Warrior Profile */}
        <circle cx="100" cy="85" r="35" fill="#C99218" />
        {/* Afro / traditional headdress & collar */}
        <path d="M 75 80 C 75 55 125 55 125 80 C 130 95 120 110 100 115 C 80 110 70 95 75 80 Z" fill="#E5B232" />
        <path d="M 65 125 Q 100 105 135 125 L 125 140 Q 100 120 75 140 Z" fill="#C99218" />
        <text x="100" y="165" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" letterSpacing="2">HABESHA</text>
      </svg>
    ),
  },
  {
    id: 'walia-beer',
    name: 'Walia Beer',
    category: 'Food & Beverage',
    region: 'ethiopia',
    options: ['Walia Beer', 'Bedele Beer', 'Castel Beer', 'Raya Beer'],
    clue: "Named after the Walia Ibex, an endangered wild mountain goat endemic only to northern Ethiopia.",
    funFact: 'The Walia Ibex is featured on Ethiopian currency and the national football team is nicknamed the Walia Ibexes.',
    difficulty: 'medium',
    colorTheme: '#154734',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#154734" stroke="#D4AF37" strokeWidth="6" />
        {/* Walia Ibex Horns & Head */}
        <path d="M 85 85 C 60 40 100 30 70 25 C 90 45 95 65 95 85 Z" fill="#D4AF37" />
        <path d="M 115 85 C 140 40 100 30 130 25 C 110 45 105 65 105 85 Z" fill="#D4AF37" />
        <polygon points="100,75 112,110 88,110" fill="#FFFFFF" />
        <circle cx="95" cy="95" r="3" fill="#154734" />
        <circle cx="105" cy="95" r="3" fill="#154734" />
        <text x="100" y="155" textAnchor="middle" fill="#D4AF37" fontSize="20" fontWeight="900" letterSpacing="3">WALIA</text>
      </svg>
    ),
  },
  {
    id: 'anbessa-bus',
    name: 'Anbessa City Bus',
    category: 'Ethiopian Brands',
    region: 'ethiopia',
    options: ['Anbessa City Bus', 'Sheger Bus', 'Alliance Bus', 'Selam Bus'],
    clue: "The iconic yellow-and-red public transit buses carrying millions daily in Addis Ababa with a roaring lion emblem.",
    funFact: 'Established in 1943, Anbessa is one of the oldest public bus transit operators in all of Africa.',
    difficulty: 'easy',
    colorTheme: '#ffb300',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#E65100" />
        <circle cx="100" cy="90" r="55" fill="#FFB300" stroke="#FFFFFF" strokeWidth="4" />
        {/* Roaring lion face silhouette */}
        <path d="M 80 80 Q 100 60 120 80 Q 130 100 115 115 Q 100 125 85 115 Q 70 100 80 80 Z" fill="#E65100" />
        <polygon points="100,90 92,105 108,105" fill="#FFFFFF" />
        <text x="100" y="172" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" letterSpacing="1">ANBESSA BUS</text>
      </svg>
    ),
  },
  {
    id: 'ride-ethiopia',
    name: 'RIDE Ethiopia',
    category: 'Tech',
    region: 'ethiopia',
    options: ['RIDE Ethiopia', 'Feres', 'ZayRide', 'Little Cab'],
    clue: "Ethiopia's pioneer ride-hailing app dialed via 8294 with green and yellow branding.",
    funFact: 'Founded by Samrawit Fikru, RIDE revolutionized city transport across Addis Ababa before smartphone penetration was widespread.',
    difficulty: 'easy',
    colorTheme: '#00a651',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#00A651" />
        {/* Location Pin & Car Motion Wheel in Yellow & White */}
        <circle cx="100" cy="85" r="32" fill="#FFDF00" />
        <circle cx="100" cy="85" r="16" fill="#00A651" />
        <polygon points="90,105 110,105 100,130" fill="#FFDF00" />
        <text x="100" y="165" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" letterSpacing="2">RIDE</text>
      </svg>
    ),
  },
  {
    id: 'addis-ababa-university',
    name: 'Addis Ababa University',
    category: 'Ethiopian Brands',
    region: 'ethiopia',
    options: ['Addis Ababa University', 'Jimma University', 'Hawassa University', 'Bahir Dar University'],
    clue: "Ethiopia's oldest and most prestigious university, founded in 1950 as University College of Addis Ababa (UCAA).",
    funFact: 'Its main Sidist Kilo campus was originally the palace of Emperor Haile Selassie I, who donated it to higher education.',
    difficulty: 'medium',
    colorTheme: '#003366',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#003366" stroke="#D4AF37" strokeWidth="6" />
        {/* Book of knowledge and torch */}
        <path d="M 65 95 Q 100 80 100 115 Q 100 80 135 95 L 135 125 Q 100 110 100 140 Q 100 110 65 125 Z" fill="#FFFFFF" />
        {/* Torch flame */}
        <path d="M 100 50 Q 112 65 100 78 Q 88 65 100 50 Z" fill="#FF9900" />
        <text x="100" y="165" textAnchor="middle" fill="#D4AF37" fontSize="16" fontWeight="900" letterSpacing="3">AAU • አአዩ</text>
      </svg>
    ),
  },

  // ==========================================
  // GLOBAL WORLD BRANDS
  // ==========================================
  {
    id: 'apple',
    name: 'Apple',
    category: 'Tech',
    region: 'global',
    options: ['Apple', 'Microsoft', 'Google', 'Sony'],
    clue: "Famous minimalist fruit silhouette with a signature bite taken out of the right side.",
    funFact: 'The bite in the Apple logo was originally added so people wouldn’t confuse it with a cherry!',
    difficulty: 'easy',
    colorTheme: '#999999',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A" />
        {/* Apple Leaf */}
        <path d="M 105 38 C 115 25 130 25 135 30 C 135 45 120 58 105 55 C 103 48 104 42 105 38 Z" fill="#F8FAFC" />
        {/* Apple Body with Bite */}
        <path d="M 100 62 C 85 62 70 70 60 88 C 45 115 58 155 75 170 C 85 178 95 170 105 170 C 115 170 125 178 135 170 C 148 158 158 130 152 112 C 135 110 130 90 145 78 C 135 65 118 62 100 62 Z" fill="#F8FAFC" />
      </svg>
    ),
  },
  {
    id: 'nike',
    name: 'Nike',
    category: 'Sports',
    region: 'global',
    options: ['Nike', 'Puma', 'Adidas', 'Reebok'],
    clue: "The legendary 'Swoosh' designed for just $35 in 1971, representing the wing of the Greek Goddess of Victory.",
    funFact: 'Graphic design student Carolyn Davidson created the Swoosh in 1971; Nike later gifted her 500 shares of stock.',
    difficulty: 'easy',
    colorTheme: '#ff5722',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A" />
        {/* Nike Swoosh */}
        <path d="M 35 115 C 65 140 105 145 135 125 C 160 108 175 75 180 50 C 150 110 100 120 65 105 L 35 115 Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    category: 'Food & Beverage',
    region: 'global',
    options: ['Starbucks', 'Costa Coffee', 'Dunkin', 'Peet’s Coffee'],
    clue: "Twin-tailed siren mermaid inside a forest-green ring with stars.",
    funFact: 'The company was named after Starbuck, the first mate in Herman Melville’s novel Moby-Dick.',
    difficulty: 'easy',
    colorTheme: '#00704A',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#00704A" />
        <circle cx="100" cy="100" r="65" fill="#FFFFFF" />
        {/* Siren Crown & Face */}
        <circle cx="100" cy="95" r="28" fill="#00704A" />
        <polygon points="100,55 90,75 110,75" fill="#FFFFFF" />
        <polygon points="80,65 90,78 75,78" fill="#FFFFFF" />
        <polygon points="120,65 110,78 125,78" fill="#FFFFFF" />
        {/* Twin Tails */}
        <path d="M 50 110 Q 70 85 85 115 Q 60 135 50 110 Z" fill="#00704A" />
        <path d="M 150 110 Q 130 85 115 115 Q 140 135 150 110 Z" fill="#00704A" />
      </svg>
    ),
  },
  {
    id: 'mcdonalds',
    name: "McDonald's",
    category: 'Food & Beverage',
    region: 'global',
    options: ["McDonald's", 'Burger King', "Wendy's", 'KFC'],
    clue: "Iconic golden twin arches forming an 'M' over a vibrant red backdrop.",
    funFact: 'The Golden Arches were originally architectural elements on the sides of the very first franchised restaurant.',
    difficulty: 'easy',
    colorTheme: '#da291c',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#DA291C" />
        {/* Golden Arches */}
        <path d="M 40 160 C 40 80 90 80 100 145 C 110 80 160 80 160 160 L 140 160 C 140 100 115 100 100 155 C 85 100 60 100 60 160 Z" fill="#FFC72C" />
      </svg>
    ),
  },
  {
    id: 'toyota',
    name: 'Toyota',
    category: 'Automotive',
    region: 'global',
    options: ['Toyota', 'Honda', 'Hyundai', 'Nissan'],
    clue: "Three overlapping ellipses forming a stylized 'T' and representing the union of the customer and the company.",
    funFact: 'If you look closely, the logo contains every single letter in the word T-O-Y-O-T-A.',
    difficulty: 'easy',
    colorTheme: '#eb0a1e',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#1E293B" />
        <ellipse cx="100" cy="100" rx="75" ry="50" fill="none" stroke="#EB0A1E" strokeWidth="12" />
        <ellipse cx="100" cy="85" rx="45" ry="20" fill="none" stroke="#EB0A1E" strokeWidth="10" />
        <ellipse cx="100" cy="105" rx="20" ry="38" fill="none" stroke="#EB0A1E" strokeWidth="10" />
      </svg>
    ),
  },
  {
    id: 'adidas',
    name: 'Adidas',
    category: 'Sports',
    region: 'global',
    options: ['Adidas', 'Under Armour', 'Puma', 'New Balance'],
    clue: "Three diagonal ascending parallel stripes resembling a mountain challenge.",
    funFact: 'Founded by Adolf (Adi) Dassler; his brother Rudolf Dassler went on to found rival sportswear brand Puma.',
    difficulty: 'easy',
    colorTheme: '#000000',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A" />
        {/* Three Mountain Stripes */}
        <polygon points="50,150 75,150 55,115 30,115" fill="#FFFFFF" />
        <polygon points="85,150 110,150 80,85 55,85" fill="#FFFFFF" />
        <polygon points="120,150 145,150 105,55 80,55" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: 'google',
    name: 'Google',
    category: 'Tech',
    region: 'global',
    options: ['Google', 'Microsoft', 'Amazon', 'Meta'],
    clue: "Four-color circular 'G' emblem composed of red, yellow, green, and blue quadrants.",
    funFact: 'Google’s original name back in 1996 when Sergey Brin and Larry Page began development was BackRub.',
    difficulty: 'easy',
    colorTheme: '#4285F4',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#FFFFFF" />
        {/* Google 4-color G */}
        <path d="M 100 70 A 30 30 0 0 1 125 80 L 145 60 A 60 60 0 0 0 45 75 L 72 96 A 32 32 0 0 1 100 70 Z" fill="#EA4335" />
        <path d="M 45 75 A 60 60 0 0 0 45 125 L 72 104 A 32 32 0 0 1 72 96 Z" fill="#FBBC05" />
        <path d="M 45 125 A 60 60 0 0 0 145 140 L 123 118 A 32 32 0 0 1 100 130 A 32 32 0 0 1 72 104 Z" fill="#34A853" />
        <path d="M 145 140 A 60 60 0 0 0 160 100 L 100 100 L 100 125 L 132 125 A 32 32 0 0 1 123 118 Z" fill="#4285F4" />
      </svg>
    ),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Entertainment',
    region: 'global',
    options: ['Spotify', 'SoundCloud', 'Apple Music', 'Deezer'],
    clue: "Vibrant neon green circle with three tilted sound waves.",
    funFact: 'Spotify was launched in Stockholm, Sweden in 2008 and got its name when co-founders misheard a shouted name idea.',
    difficulty: 'easy',
    colorTheme: '#1DB954',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#1DB954" />
        {/* Three curved acoustic waves */}
        <path d="M 50 85 C 80 70 120 70 150 85" fill="none" stroke="#121212" strokeWidth="14" strokeLinecap="round" />
        <path d="M 58 108 C 83 95 117 95 142 108" fill="none" stroke="#121212" strokeWidth="12" strokeLinecap="round" />
        <path d="M 65 130 C 86 120 114 120 135 130" fill="none" stroke="#121212" strokeWidth="10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'tesla',
    name: 'Tesla',
    category: 'Automotive',
    region: 'global',
    options: ['Tesla', 'Rivian', 'Lucid', 'Polestar'],
    clue: "Sleek metallic 'T' cross-section styled after an electric motor rotor pole.",
    funFact: 'Elon Musk confirmed the Tesla logo represents a cross-section of an electric induction motor.',
    difficulty: 'easy',
    colorTheme: '#e82127',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A" />
        {/* Tesla Curved Roof */}
        <path d="M 45 45 C 80 35 120 35 155 45 L 150 55 C 120 48 80 48 50 55 Z" fill="#E82127" />
        {/* Tesla T Body */}
        <path d="M 95 62 L 105 62 L 115 160 C 105 165 95 165 85 160 Z" fill="#E82127" />
        <path d="M 60 62 C 85 58 115 58 140 62 L 135 72 C 115 70 85 70 65 72 Z" fill="#E82127" />
      </svg>
    ),
  },
  {
    id: 'ferrari',
    name: 'Ferrari',
    category: 'Automotive',
    region: 'global',
    options: ['Ferrari', 'Porsche', 'Lamborghini', 'Maserati'],
    clue: "Prancing black stallion (Cavallino Rampante) on a canary yellow shield with Italian tricolor.",
    funFact: 'Enzo Ferrari adopted the prancing horse from the family of Count Francesco Baracca, a legendary Italian WWI fighter ace.',
    difficulty: 'medium',
    colorTheme: '#fff200',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Yellow Shield */}
        <path d="M 45 35 L 155 35 L 155 120 C 155 155 100 180 100 180 C 100 180 45 155 45 120 Z" fill="#FFF200" stroke="#000000" strokeWidth="4" />
        {/* Italian Tricolor Top Bar */}
        <rect x="47" y="36" width="35" height="12" fill="#009246" />
        <rect x="82" y="36" width="36" height="12" fill="#FFFFFF" />
        <rect x="118" y="36" width="35" height="12" fill="#CE2B37" />
        {/* Prancing Horse Silhouette */}
        <path d="M 100 70 C 110 65 115 75 110 85 L 120 85 C 115 95 105 110 105 135 L 95 135 C 95 115 85 105 85 90 C 85 80 95 75 100 70 Z" fill="#000000" />
      </svg>
    ),
  },
  {
    id: 'mastercard',
    name: 'MasterCard',
    category: 'Finance',
    region: 'global',
    options: ['MasterCard', 'Visa', 'American Express', 'Discover'],
    clue: "Two intersecting red and yellow-orange circles creating a distinctive central overlap.",
    funFact: 'MasterCard was originally created under the name "Master Charge: The Interbank Card" in 1966.',
    difficulty: 'easy',
    colorTheme: '#eb001b',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A" />
        {/* Left Red Circle */}
        <circle cx="78" cy="100" r="46" fill="#EB001B" />
        {/* Right Yellow Circle */}
        <circle cx="122" cy="100" r="46" fill="#F79E1B" />
        {/* Center Intersecting Blend */}
        <path d="M 100 64 A 46 46 0 0 1 100 136 A 46 46 0 0 1 100 64 Z" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'Retail',
    region: 'global',
    options: ['Amazon', 'eBay', 'Alibaba', 'Walmart'],
    clue: "Curved yellow arrow swoosh smiling from the letter 'a' to 'z'.",
    funFact: 'The arrow points from A to Z to symbolize that Amazon delivers every product from A to Z.',
    difficulty: 'easy',
    colorTheme: '#ff9900',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A" />
        <text x="100" y="95" textAnchor="middle" fill="#FFFFFF" fontSize="36" fontWeight="900" fontFamily="sans-serif">amazon</text>
        {/* Smiling Arrow */}
        <path d="M 50 120 Q 100 155 150 120" fill="none" stroke="#FF9900" strokeWidth="8" strokeLinecap="round" />
        <polygon points="146,110 162,120 148,132" fill="#FF9900" />
      </svg>
    ),
  },
  {
    id: 'target',
    name: 'Target',
    category: 'Retail',
    region: 'global',
    options: ['Target', 'Costco', 'Macy’s', 'Kohl’s'],
    clue: "Bold concentric red bullseye with an outer ring and solid center dot.",
    funFact: 'The retailer chose the bullseye because the goal was to hit the center of what customers wanted.',
    difficulty: 'easy',
    colorTheme: '#cc0000',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#FFFFFF" />
        <circle cx="100" cy="100" r="75" fill="#CC0000" />
        <circle cx="100" cy="100" r="50" fill="#FFFFFF" />
        <circle cx="100" cy="100" r="25" fill="#CC0000" />
      </svg>
    ),
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    category: 'Food & Beverage',
    region: 'global',
    options: ['Pepsi', 'Coca-Cola', 'Dr Pepper', 'Red Bull'],
    clue: "Circular globe with a swirling white wave separating a red top half and blue bottom half.",
    funFact: 'Invented in 1893 by pharmacist Caleb Bradham, who initially dubbed it "Brad’s Drink".',
    difficulty: 'easy',
    colorTheme: '#004b93',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#FFFFFF" stroke="#004B93" strokeWidth="6" />
        {/* Red Upper Wave */}
        <path d="M 18 100 A 82 82 0 0 1 182 100 C 140 120 120 70 18 100 Z" fill="#E32934" />
        {/* Blue Lower Wave */}
        <path d="M 18 100 A 82 82 0 0 0 182 100 C 140 135 120 85 18 100 Z" fill="#004B93" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Tech',
    region: 'global',
    options: ['Instagram', 'Snapchat', 'Pinterest', 'TikTok'],
    clue: "Smooth gradient square camera outline with a lens circle and flash dot.",
    funFact: 'Instagram was acquired by Facebook in 2012 for $1 billion when it had only 13 employees.',
    difficulty: 'easy',
    colorTheme: '#e1306c',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="25%" stopColor="#F77737" />
            <stop offset="50%" stopColor="#F56040" />
            <stop offset="75%" stopColor="#FD1D1D" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="45" fill="url(#ig-grad)" />
        <rect x="45" y="45" width="110" height="110" rx="30" fill="none" stroke="#FFFFFF" strokeWidth="12" />
        <circle cx="100" cy="100" r="28" fill="none" stroke="#FFFFFF" strokeWidth="12" />
        <circle cx="132" cy="68" r="7" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: 'bmw',
    name: 'BMW',
    category: 'Automotive',
    region: 'global',
    options: ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen'],
    clue: "Circular emblem with alternating blue and white Bavarian quadrants inside a black outer ring.",
    funFact: 'BMW stands for Bayerische Motoren Werke (Bavarian Motor Works) and began as an aircraft engine builder.',
    difficulty: 'easy',
    colorTheme: '#0066b1',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#000000" stroke="#CCCCCC" strokeWidth="4" />
        <circle cx="100" cy="100" r="55" fill="#FFFFFF" />
        {/* Bavarian Blue Quadrants */}
        <path d="M 100 45 A 55 55 0 0 1 155 100 L 100 100 Z" fill="#0066B1" />
        <path d="M 100 155 A 55 55 0 0 1 45 100 L 100 100 Z" fill="#0066B1" />
        <text x="100" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" letterSpacing="4">BMW</text>
      </svg>
    ),
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    category: 'Automotive',
    region: 'global',
    options: ['Mercedes-Benz', 'Volvo', 'Lexus', 'Jaguar'],
    clue: "Three-pointed silver star encased inside a polished circle, representing domination of land, sea, and air.",
    funFact: 'Gottlieb Daimler drew the star on a postcard to his wife in 1872, saying one day it would shine over his factory.',
    difficulty: 'easy',
    colorTheme: '#333333',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="#E2E8F0" strokeWidth="8" />
        {/* Three-Pointed Star */}
        <polygon points="100,30 106,94 100,100" fill="#CBD5E1" />
        <polygon points="100,30 94,94 100,100" fill="#94A3B8" />
        <polygon points="160,135 104,106 100,100" fill="#CBD5E1" />
        <polygon points="160,135 106,95 100,100" fill="#94A3B8" />
        <polygon points="40,135 94,95 100,100" fill="#CBD5E1" />
        <polygon points="40,135 96,106 100,100" fill="#94A3B8" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Entertainment',
    region: 'global',
    options: ['TikTok', 'Triller', 'Twitch', 'Musical.ly'],
    clue: "Futuristic neon musical note with offset cyan and magenta chromatic glitch effect.",
    funFact: 'TikTok reached 1 billion monthly active users faster than any other social media platform in history.',
    difficulty: 'easy',
    colorTheme: '#00f2fe',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#010101" />
        {/* Cyan Offset Note */}
        <path d="M 125 45 C 135 65 150 75 165 78 L 165 100 C 150 98 138 92 130 85 L 130 130 C 130 155 108 172 82 165 C 62 160 50 140 55 120 C 60 100 80 90 102 95 L 102 120 C 92 118 82 122 80 130 C 78 138 85 145 95 145 C 105 145 112 138 112 128 L 112 45 Z" fill="#25F4EE" />
        {/* Magenta Offset Note */}
        <path d="M 132 50 C 142 70 157 80 172 83 L 172 105 C 157 103 145 97 137 90 L 137 135 C 137 160 115 177 89 170 C 69 165 57 145 62 125 C 67 105 87 95 109 100 L 109 125 C 99 123 89 127 87 135 C 85 143 92 150 102 150 C 112 150 119 143 119 133 L 119 50 Z" fill="#FE2C55" opacity="0.85" />
      </svg>
    ),
  },
  {
    id: 'playstation',
    name: 'PlayStation',
    category: 'Entertainment',
    region: 'global',
    options: ['PlayStation', 'Xbox', 'Nintendo', 'Sega'],
    clue: "Upright 'P' standing over a flattened geometric 'S' in four primary colors.",
    funFact: 'Designed by Manabu Sakamoto, the logo symbolized 3D space with the standing P casting a shadow as the S.',
    difficulty: 'medium',
    colorTheme: '#003791',
    svgRender: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#FFFFFF" />
        {/* Red P */}
        <path d="M 75 40 L 105 40 C 120 40 130 50 130 65 C 130 80 120 90 105 90 L 95 90 L 95 125 L 75 125 Z M 95 58 L 95 72 L 105 72 C 110 72 115 68 115 65 C 115 62 110 58 105 58 Z" fill="#DF0024" />
        {/* Cyan, Yellow, Blue flat S shadow */}
        <path d="M 45 130 C 65 115 115 115 145 125 L 125 140 C 105 132 75 132 60 140 Z" fill="#00AA9E" />
        <path d="M 125 140 C 145 148 155 158 140 168 C 120 178 70 178 45 168 L 65 152 C 85 160 115 160 125 152 Z" fill="#003791" />
        <circle cx="100" cy="148" r="6" fill="#F3C300" />
      </svg>
    ),
  },
];
