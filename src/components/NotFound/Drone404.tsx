// src/components/Drone404.tsx

export function Drone404() {
  return (
    <div
      className="w-full max-w-lg h-64 md:h-72 mx-auto"
      id="animated-svg-ANIMATION_23"
      style={{ display: "block" }}
    >
      <svg
        className="w-full h-full select-none"
        height="100%"
        viewBox="0 0 600 360"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="neonCyanGlow" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="glitchViolet" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="portalGrad" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </linearGradient>

          {/* Glow Filter */}
          <filter
            height="160%"
            id="cyanGlowFilter"
            width="160%"
            x="-30%"
            y="-30%"
          >
            <feGaussianBlur result="blur1" stdDeviation="8" />
            <feGaussianBlur result="blur2" stdDeviation="16" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter height="100%" id="scanlineEffect" width="100%" x="0" y="0">
            <feTurbulence
              baseFrequency="0.05 0.95"
              numOctaves="1"
              result="noise"
              type="fractalNoise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0"
            />
            <feComposite in="glitch" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* Ambient Portal Pedestal Grid */}
        <g opacity="0.4">
          <ellipse cx="300" cy="275" fill="url(#portalGrad)" rx="190" ry="38" />
          <ellipse
            cx="300"
            cy="275"
            fill="none"
            opacity="0.6"
            rx="170"
            ry="32"
            stroke="#06b6d4"
            strokeDasharray="6 4"
            strokeWidth="1.2"
          />
          <ellipse
            cx="300"
            cy="275"
            fill="none"
            opacity="0.5"
            rx="120"
            ry="22"
            stroke="#8b5cf6"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
          <ellipse
            cx="300"
            cy="275"
            fill="none"
            opacity="0.8"
            rx="60"
            ry="12"
            stroke="#06b6d4"
            strokeWidth="1.5"
          />
          <path
            d="M190 275 L190 250 M410 275 L410 250 M250 283 L250 265 M350 283 L350 265"
            opacity="0.4"
            stroke="#06b6d4"
            strokeDasharray="2 3"
            strokeWidth="1"
          />
        </g>

        {/* Radar Scanning Effect Behind Character */}
        <g opacity="0.3">
          <circle
            cx="300"
            cy="150"
            fill="none"
            r="95"
            stroke="#1e293b"
            strokeWidth="1"
          />
          <circle
            cx="300"
            cy="150"
            fill="none"
            r="130"
            stroke="#334155"
            strokeDasharray="8 8"
            strokeWidth="1"
          />
          <line
            className="radar-line"
            opacity="0.7"
            stroke="#06b6d4"
            strokeWidth="2"
            x1="300"
            x2="430"
            y1="150"
            y2="150"
          />
        </g>

        {/* Orbiting Floating Loot / Quest Nodes */}
        <g className="orbit-1">
          <rect
            fill="#06b6d4"
            filter="url(#cyanGlowFilter)"
            height="16"
            opacity="0.85"
            rx="4"
            transform="rotate(45)"
            width="16"
            x="-8"
            y="-8"
          />
        </g>
        <g className="orbit-2">
          <polygon
            fill="#a855f7"
            filter="url(#cyanGlowFilter)"
            opacity="0.9"
            points="0,-10 9,6 -9,6"
          />
        </g>

        {/* Giant Glitch 404 Backdrop Numbers */}
        <g className="glitch-code" opacity="0.88">
          <text
            fill="#0f172a"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="140"
            fontWeight="900"
            letterSpacing="-4"
            opacity="0.4"
            stroke="#06b6d4"
            strokeWidth="2"
            x="80"
            y="195"
          >
            4
          </text>
          <text
            fill="none"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="140"
            fontWeight="900"
            opacity="0.6"
            stroke="#a855f7"
            strokeWidth="1.2"
            x="83"
            y="193"
          >
            4
          </text>
          <text
            fill="#0f172a"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="140"
            fontWeight="900"
            letterSpacing="-4"
            opacity="0.4"
            stroke="#06b6d4"
            strokeWidth="2"
            x="390"
            y="195"
          >
            4
          </text>
          <text
            fill="none"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="140"
            fontWeight="900"
            opacity="0.6"
            stroke="#a855f7"
            strokeWidth="1.2"
            x="393"
            y="193"
          >
            4
          </text>
        </g>

        {/* Floating Holographic Game Drone / Operative Mascot */}
        <g className="hero-group">
          <circle
            className="pulse-ring"
            cx="300"
            cy="150"
            fill="none"
            r="60"
            stroke="#06b6d4"
          />
          <circle
            className="portal-core"
            cx="300"
            cy="150"
            fill="none"
            r="48"
            stroke="#8b5cf6"
            strokeDasharray="14 8 4 8"
            strokeWidth="2"
          />
          <polygon
            fill="#090d16"
            filter="url(#cyanGlowFilter)"
            points="300,105 342,128 342,172 300,195 258,172 258,128"
            stroke="#06b6d4"
            strokeWidth="3"
          />
          <polygon
            fill="#131b2e"
            points="300,114 334,133 334,167 300,186 266,167 266,133"
            stroke="#1e293b"
            strokeWidth="1.5"
          />

          {/* Visor / Face */}
          <g>
            <rect
              fill="#030712"
              height="26"
              rx="6"
              stroke="#3b82f6"
              strokeWidth="1"
              width="52"
              x="274"
              y="137"
            />
            {/* Left X Eye */}
            <line
              stroke="#ef4444"
              strokeLinecap="round"
              strokeWidth="3"
              x1="282"
              x2="292"
              y1="145"
              y2="155"
            />
            <line
              stroke="#ef4444"
              strokeLinecap="round"
              strokeWidth="3"
              x1="292"
              x2="282"
              y1="145"
              y2="155"
            />
            {/* Right X Eye */}
            <line
              stroke="#ef4444"
              strokeLinecap="round"
              strokeWidth="3"
              x1="308"
              x2="318"
              y1="145"
              y2="155"
            />
            <line
              stroke="#ef4444"
              strokeLinecap="round"
              strokeWidth="3"
              x1="318"
              x2="308"
              y1="145"
              y2="155"
            />
            <circle cx="300" cy="158" fill="#f59e0b" r="1.5" />
          </g>

          {/* Antennas */}
          <path d="M258 135 L242 122 L242 142 Z" fill="#06b6d4" opacity="0.8" />
          <path d="M342 135 L358 122 L358 142 Z" fill="#06b6d4" opacity="0.8" />

          {/* Warning Beacon */}
          <polygon
            className="warning-blink"
            fill="#f59e0b"
            points="300,82 308,98 292,98"
          />
          <circle cx="300" cy="94" fill="#fff" r="1" />
          <line
            stroke="#f59e0b"
            strokeWidth="2"
            x1="300"
            x2="300"
            y1="98"
            y2="105"
          />

          {/* Health Bar */}
          <g transform="translate(265, 208)">
            <rect
              fill="#050811"
              height="12"
              rx="4"
              stroke="#334155"
              strokeWidth="1"
              width="70"
              x="0"
              y="0"
            />
            <text
              fill="#94a3b8"
              fontFamily="'Plus Jakarta Sans', monospace"
              fontSize="7"
              fontWeight="700"
              x="5"
              y="9"
            >
              HP
            </text>
            <rect fill="#1e293b" height="6" rx="2" width="42" x="22" y="3" />
            <rect
              className="warning-blink"
              fill="#ef4444"
              height="6"
              rx="2"
              width="8"
              x="22"
              y="3"
            />
          </g>

          {/* Badge DESYNC */}
          <g className="glitch-code" transform="translate(230, 68)">
            <rect
              fill="#1e1329"
              height="20"
              opacity="0.9"
              rx="6"
              stroke="#a855f7"
              strokeWidth="1"
              width="140"
              x="0"
              y="0"
            />
            <circle
              className="warning-blink"
              cx="12"
              cy="10"
              fill="#ef4444"
              r="3.5"
            />
            <text
              fill="#e2e8f0"
              fontFamily="'Plus Jakarta Sans', monospace"
              fontSize="8.5"
              fontWeight="800"
              letterSpacing="1"
              x="22"
              y="14"
            >
              DESYNC: 404 SECTOR
            </text>
          </g>
        </g>

        {/* Sparkles */}
        <circle cx="150" cy="110" fill="#06b6d4" opacity="0.6" r="3" />
        <circle cx="450" cy="120" fill="#a855f7" opacity="0.7" r="2.5" />
        <circle cx="190" cy="220" fill="#38bdf8" opacity="0.5" r="2" />
        <circle cx="410" cy="230" fill="#06b6d4" opacity="0.6" r="3" />
        <line
          opacity="0.5"
          stroke="#06b6d4"
          strokeDasharray="2 2"
          strokeWidth="1"
          x1="170"
          x2="185"
          y1="180"
          y2="180"
        />
        <line
          opacity="0.5"
          stroke="#a855f7"
          strokeDasharray="2 2"
          strokeWidth="1"
          x1="420"
          x2="435"
          y1="175"
          y2="175"
        />
      </svg>
    </div>
  );
}
