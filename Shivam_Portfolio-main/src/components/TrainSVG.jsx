export default function TrainSVG({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 620 180"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* === PASSENGER CAR 2 (rightmost) === */}
      <g transform="translate(420,0)">
        <rect x="0" y="50" width="180" height="90" rx="8" fill="#003580" stroke="#f5a623" strokeWidth="1.5"/>
        <rect x="10" y="60" width="160" height="12" rx="2" fill="#f5a623" opacity="0.7"/>
        {/* windows */}
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x={18 + i*42} y="82" width="28" height="22" rx="4" fill="#5dade2" opacity="0.85"/>
            <rect x={18 + i*42} y="82" width="13" height="22" rx="3" fill="#3498db" opacity="0.6"/>
            <rect x={18 + i*42} y="82" width="28" height="4" rx="2" fill="white" opacity="0.3"/>
          </g>
        ))}
        {/* door */}
        <rect x="78" y="108" width="24" height="32" rx="2" fill="#002060" stroke="#f5a623" strokeWidth="1"/>
        <rect x="88" y="118" width="4" height="6" rx="2" fill="#f5a623"/>
        {/* undercarriage */}
        <rect x="5" y="138" width="170" height="8" rx="2" fill="#002060"/>
        {/* wheels */}
        {[25, 75, 125, 155].map(wx => (
          <g key={wx} className="wheel-group" style={{ transformOrigin: `${wx}px 158px` }}>
            <circle cx={wx} cy="158" r="16" fill="#1a1a2e" stroke="#f5a623" strokeWidth="2"/>
            <circle cx={wx} cy="158" r="8" fill="#003580" stroke="#aaa" strokeWidth="1"/>
            <circle cx={wx} cy="158" r="3" fill="#f5a623"/>
            {[0,1,2,3,4,5].map(s => (
              <line key={s}
                x1={wx} y1={158 - 8} x2={wx} y2={158 - 15}
                stroke="#aaa" strokeWidth="1"
                transform={`rotate(${s * 60} ${wx} 158)`}
              />
            ))}
          </g>
        ))}
        {/* coupling left */}
        <rect x="-14" y="128" width="16" height="6" rx="2" fill="#666"/>
        <circle cx="-14" cy="131" r="4" fill="#555" stroke="#888" strokeWidth="1"/>
        {/* coupling right */}
        <rect x="180" y="128" width="16" height="6" rx="2" fill="#666"/>
        <circle cx="196" cy="131" r="4" fill="#555" stroke="#888" strokeWidth="1"/>
        {/* car label */}
      </g>

      {/* === PASSENGER CAR 1 === */}
      <g transform="translate(220,0)">
        <rect x="0" y="50" width="190" height="90" rx="8" fill="#1a4080" stroke="#f5a623" strokeWidth="1.5"/>
        <rect x="10" y="60" width="170" height="12" rx="2" fill="#f5a623" opacity="0.7"/>
        {[0,1,2,3,4].map(i => (
          <g key={i}>
            <rect x={14 + i*36} y="82" width="26" height="22" rx="4" fill="#5dade2" opacity="0.85"/>
            <rect x={14 + i*36} y="82" width="12" height="22" rx="3" fill="#3498db" opacity="0.6"/>
            <rect x={14 + i*36} y="82" width="26" height="4" rx="2" fill="white" opacity="0.3"/>
          </g>
        ))}
        <rect x="80" y="108" width="24" height="32" rx="2" fill="#002060" stroke="#f5a623" strokeWidth="1"/>
        <rect x="90" y="118" width="4" height="6" rx="2" fill="#f5a623"/>
        <rect x="5" y="138" width="180" height="8" rx="2" fill="#002060"/>
        {[25, 75, 125, 165].map(wx => (
          <g key={wx} className="wheel-group" style={{ transformOrigin: `${wx}px 158px` }}>
            <circle cx={wx} cy="158" r="16" fill="#1a1a2e" stroke="#f5a623" strokeWidth="2"/>
            <circle cx={wx} cy="158" r="8" fill="#1a4080" stroke="#aaa" strokeWidth="1"/>
            <circle cx={wx} cy="158" r="3" fill="#f5a623"/>
            {[0,1,2,3,4,5].map(s => (
              <line key={s}
                x1={wx} y1={158 - 8} x2={wx} y2={158 - 15}
                stroke="#aaa" strokeWidth="1"
                transform={`rotate(${s * 60} ${wx} 158)`}
              />
            ))}
          </g>
        ))}
        <rect x="-14" y="128" width="16" height="6" rx="2" fill="#666"/>
        <circle cx="-14" cy="131" r="4" fill="#555" stroke="#888" strokeWidth="1"/>
        <rect x="190" y="128" width="16" height="6" rx="2" fill="#666"/>
        <circle cx="206" cy="131" r="4" fill="#555" stroke="#888" strokeWidth="1"/>
      </g>

      {/* === LOCOMOTIVE === */}
      <g transform="translate(0,0)">
        {/* boiler body */}
        <rect x="20" y="55" width="195" height="80" rx="12" fill="#8b1a1a"/>
        {/* boiler cylinder */}
        <ellipse cx="60" cy="95" rx="35" ry="40" fill="#922b21"/>
        <rect x="25" y="55" width="160" height="80" fill="#a93226"/>

        {/* cab */}
        <rect x="155" y="30" width="70" height="105" rx="6" fill="#7b241c"/>
        {/* cab window */}
        <rect x="163" y="40" width="50" height="35" rx="4" fill="#1a6b8a" stroke="#f5a623" strokeWidth="1.5"/>
        <line x1="188" y1="40" x2="188" y2="75" stroke="#f5a623" strokeWidth="1" opacity="0.5"/>
        {/* reflection on window */}
        <rect x="164" y="41" width="22" height="33" rx="3" fill="white" opacity="0.08"/>

        {/* cab door */}
        <rect x="163" y="88" width="22" height="47" rx="2" fill="#6e1f1a" stroke="#f5a623" strokeWidth="1"/>
        <circle cx="183" cy="115" r="2.5" fill="#f5a623"/>

        {/* front plate */}
        <rect x="20" y="75" width="30" height="55" rx="4" fill="#7b241c"/>
        {/* headlight */}
        <circle cx="35" cy="88" r="10" fill="#1a1a1a" stroke="#f5a623" strokeWidth="2"/>
        <circle cx="35" cy="88" r="6" fill="#fff7c0" opacity="0.9"/>
        <circle cx="35" cy="88" r="3" fill="white"/>
        {/* number plate */}
        <rect x="22" y="105" width="26" height="14" rx="2" fill="#f5a623"/>

        {/* chimney */}
        <rect x="60" y="15" width="22" height="40" rx="4" fill="#7b241c"/>
        <rect x="55" y="12" width="32" height="8" rx="4" fill="#6e1f1a" stroke="#f5a623" strokeWidth="1"/>

        {/* steam dome */}
        <ellipse cx="110" cy="52" rx="18" ry="12" fill="#7b241c" stroke="#f5a623" strokeWidth="1"/>
        {/* safety valve */}
        <rect x="107" y="38" width="6" height="14" rx="2" fill="#922b21"/>
        <ellipse cx="110" cy="37" rx="5" ry="3" fill="#7b241c"/>

        {/* boiler bands */}
        {[80, 100, 130, 155].map(bx => (
          <line key={bx} x1={bx} y1="55" x2={bx} y2="135" stroke="#f5a623" strokeWidth="1.5" opacity="0.4"/>
        ))}

        {/* running plate */}
        <rect x="15" y="132" width="215" height="10" rx="2" fill="#6e1f1a"/>
        {/* step */}
        <rect x="25" y="140" width="30" height="5" fill="#5d1a16"/>

        {/* main wheels (large driving wheels) */}
        {[70, 118].map(wx => (
          <g key={wx} className="wheel-group" style={{ transformOrigin: `${wx}px 158px` }}>
            <circle cx={wx} cy="158" r="22" fill="#1a1a2e" stroke="#f5a623" strokeWidth="2.5"/>
            <circle cx={wx} cy="158" r="14" fill="#2c1a1a" stroke="#888" strokeWidth="1"/>
            <circle cx={wx} cy="158" r="5" fill="#f5a623"/>
            {[0,1,2,3,4,5,6,7].map(s => (
              <line key={s}
                x1={wx} y1={158 - 14} x2={wx} y2={158 - 21}
                stroke="#888" strokeWidth="1.5"
                transform={`rotate(${s * 45} ${wx} 158)`}
              />
            ))}
          </g>
        ))}
        {/* small front wheel */}
        <g className="wheel-group" style={{ transformOrigin: '35px 162px' }}>
          <circle cx="35" cy="162" r="14" fill="#1a1a2e" stroke="#f5a623" strokeWidth="2"/>
          <circle cx="35" cy="162" r="7" fill="#2c1a1a" stroke="#888" strokeWidth="1"/>
          <circle cx="35" cy="162" r="2.5" fill="#f5a623"/>
          <line x1="35" y1="148" x2="35" y2="176" stroke="#888" strokeWidth="1" />
          <line x1="21" y1="162" x2="49" y2="162" stroke="#888" strokeWidth="1" />
        </g>
        {/* small rear wheel */}
        <g className="wheel-group" style={{ transformOrigin: '175px 162px' }}>
          <circle cx="175" cy="162" r="12" fill="#1a1a2e" stroke="#f5a623" strokeWidth="2"/>
          <circle cx="175" cy="162" r="6" fill="#2c1a1a" stroke="#888" strokeWidth="1"/>
          <circle cx="175" cy="162" r="2" fill="#f5a623"/>
          <line x1="175" y1="150" x2="175" y2="174" stroke="#888" strokeWidth="1" />
          <line x1="163" y1="162" x2="187" y2="162" stroke="#888" strokeWidth="1" />
        </g>

        {/* connecting rods */}
        <rect x="35" y="153" width="98" height="5" rx="2" fill="#c0392b" stroke="#f5a623" strokeWidth="0.5"/>
        <rect x="70" y="150" width="48" height="5" rx="2" fill="#922b21" stroke="#f5a623" strokeWidth="0.5"/>

        {/* cow catcher */}
        <polygon points="20,135 0,170 20,170" fill="#7b241c" stroke="#f5a623" strokeWidth="1"/>
        <line x1="20" y1="140" x2="3" y2="168" stroke="#f5a623" strokeWidth="0.8"/>
        <line x1="20" y1="148" x2="7" y2="168" stroke="#f5a623" strokeWidth="0.8"/>
        <line x1="20" y1="155" x2="12" y2="168" stroke="#f5a623" strokeWidth="0.8"/>

        {/* coupling right */}
        <rect x="218" y="128" width="16" height="6" rx="2" fill="#666"/>
        <circle cx="234" cy="131" r="4" fill="#555" stroke="#888" strokeWidth="1"/>

      </g>

      {/* === TRACK === */}
      <g>
        {/* rails */}
        <line x1="-50" y1="175" x2="640" y2="175" stroke="#666" strokeWidth="3"/>
        <line x1="-50" y1="170" x2="640" y2="170" stroke="#555" strokeWidth="1.5"/>
        {/* sleepers */}
        {Array.from({ length: 22 }).map((_, i) => (
          <rect key={i} x={-40 + i * 30} y="167" width="18" height="10" rx="2" fill="#4a3728"/>
        ))}
      </g>
    </svg>
  )
}
