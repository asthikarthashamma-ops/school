import React from 'react';
import { School, MapPin, Truck, AlertTriangle } from 'lucide-react';

const TransportMap = ({ route, routesList, showAll = false }) => {
  // SVG grid limits: viewBox="0 0 360 240"
  // AuraAcademy Campus resides at (180, 120)
  
  const drawRoutePath = (r) => {
    if (r.stops.length < 2) return null;
    
    // Connect stops sequentially using SVG path string
    let pathD = `M ${r.stops[0].x} ${r.stops[0].y}`;
    for (let i = 1; i < r.stops.length; i++) {
      pathD += ` L ${r.stops[i].x} ${r.stops[i].y}`;
    }
    return (
      <path
        key={`path-${r.id}`}
        d={pathD}
        fill="none"
        stroke={r.id === 'route-1' ? '#38bdf8' : '#fb7185'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-70"
        strokeDasharray="6 4"
      />
    );
  };

  const activeRoutes = showAll ? routesList : [route].filter(Boolean);

  return (
    <div className="relative rounded-3xl border border-slate-950 bg-slate-900 dark:border-slate-800 p-4 text-white overflow-hidden shadow-inner flex flex-col justify-between min-h-[360px]">
      
      {/* HUD Telemetry Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 z-10 bg-slate-900/40 backdrop-blur-sm">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">GPS SYSTEM ENGINE</span>
          {showAll ? (
            <h4 className="text-sm font-bold">MONITORING ALL TRANSITS ({routesList?.length || 0} Routes)</h4>
          ) : (
            route && <h4 className="text-sm font-bold">{route.routeName} • {route.busNumber}</h4>
          )}
        </div>
        
        {/* Connection status indicator */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono text-green-400">TELEMETRY LINK ACTIVE</span>
        </div>
      </div>

      {/* SVG Canvas Map Grid */}
      <div className="relative flex-1 w-full h-full my-4 flex items-center justify-center">
        <svg
          viewBox="0 0 360 240"
          className="w-full h-full max-h-[300px] text-slate-700 bg-slate-950 rounded-2xl border border-slate-850 shadow-inner"
        >
          {/* Schematic Suburban Road Grid layout */}
          {/* Roads blocks */}
          <rect x="0" y="0" width="360" height="240" fill="#0f172a" />
          
          {/* Grass blocks overlays */}
          <rect x="15" y="15" width="130" height="85" rx="8" fill="#14532d" fillOpacity="0.15" />
          <rect x="215" y="15" width="130" height="85" rx="8" fill="#14532d" fillOpacity="0.15" />
          <rect x="15" y="140" width="130" height="85" rx="8" fill="#14532d" fillOpacity="0.15" />
          <rect x="215" y="140" width="130" height="85" rx="8" fill="#14532d" fillOpacity="0.15" />

          {/* Streets Grid */}
          {/* Main East-West Street */}
          <line x1="0" y1="120" x2="360" y2="120" stroke="#1e293b" strokeWidth="20" strokeLinecap="square" />
          <line x1="0" y1="120" x2="360" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5 5" strokeOpacity="0.3" />
          <text x="10" y="112" fontSize="7" fill="#64748b" className="font-mono">WESTGATE EXPRESSWAY</text>

          {/* North-South Street 1 */}
          <line x1="80" y1="0" x2="80" y2="240" stroke="#1e293b" strokeWidth="20" />
          <line x1="80" y1="0" x2="80" y2="240" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5 5" strokeOpacity="0.3" />

          {/* North-South Street 2 */}
          <line x1="270" y1="0" x2="270" y2="240" stroke="#1e293b" strokeWidth="20" />
          <line x1="270" y1="0" x2="270" y2="240" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5 5" strokeOpacity="0.3" />
          <text x="278" y="232" fontSize="7" fill="#64748b" className="font-mono rotate-90 origin-top-left">LAKESIDE BLVD</text>

          {/* Draw active routes line pathways */}
          {activeRoutes.map(r => drawRoutePath(r))}

          {/* Draw stop pin rings */}
          {activeRoutes.map(r => 
            r.stops.map((stop, idx) => {
              const isSchool = stop.name.includes("Campus");
              if (isSchool) return null; // Drawn separately below
              return (
                <g key={`grp-stop-${r.id}-${idx}`}>
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r="6"
                    fill="#1e293b"
                    stroke={r.id === 'route-1' ? '#38bdf8' : '#fb7185'}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r="2.5"
                    fill={r.id === 'route-1' ? '#38bdf8' : '#fb7185'}
                  />
                  <text
                    x={stop.x + 8}
                    y={stop.y + 3}
                    fontSize="6.5"
                    fill="#94a3b8"
                    className="font-bold font-sans pointer-events-none drop-shadow"
                  >
                    {stop.name}
                  </text>
                </g>
              );
            })
          )}

          {/* School Campus Marker Pin */}
          <g transform="translate(180, 120)">
            {/* Pulsing ring behind school */}
            <circle cx="0" cy="0" r="16" fill="#0369a1" fillOpacity="0.15" className="animate-pulse" />
            <circle cx="0" cy="0" r="10" fill="#0284c7" fillOpacity="0.3" />
            <circle cx="0" cy="0" r="5" fill="#0ea5e9" />
            <foreignObject x="-7" y="-7" width="14" height="14">
              <div className="text-white">
                <School className="h-3.5 w-3.5" />
              </div>
            </foreignObject>
            <text x="12" y="3" fontSize="8" fill="#e2f1ff" className="font-bold drop-shadow">
              CAMPUS
            </text>
          </g>

          {/* Live School Bus Position Marker */}
          {activeRoutes.map(r => {
            if (r.status === 'Idle' && r.coordinates.x === r.stops[r.stops.length-1].x && r.coordinates.y === r.stops[r.stops.length-1].y) {
              // Idle at School, offset slightly so it doesn't overlap campus icon
              return null; 
            }
            return (
              <g key={`bus-marker-${r.id}`} transform={`translate(${r.coordinates.x}, ${r.coordinates.y})`}>
                {/* Ping rings */}
                {r.status === 'En Route' && (
                  <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill={r.id === 'route-1' ? '#38bdf8' : '#fb7185'}
                    fillOpacity="0.3"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill="#eab308"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="shadow-lg"
                />
                <foreignObject x="-5" y="-5" width="10" height="10">
                  <div className="text-slate-950 flex items-center justify-center">
                    <Truck className="h-2.5 w-2.5" />
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Live HUD Telemetry status footer details */}
      {!showAll && route && (
        <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-800 pt-3 z-10 bg-slate-900/40 backdrop-blur-sm rounded-xl px-2">
          <div>
            <span className="block text-[9px] text-slate-450 uppercase font-mono">STATUS</span>
            <span className={`text-xs font-bold ${
              route.status === 'En Route' ? 'text-green-400' : route.status === 'Delayed' ? 'text-amber-400' : 'text-slate-400'
            }`}>
              {route.status}
            </span>
          </div>
          <div>
            <span className="block text-[9px] text-slate-450 uppercase font-mono">ETA CAMPUS</span>
            <span className="text-xs font-bold text-white">
              {route.status === 'En Route'
                ? `${Math.max(5, (route.stops.length - route.currentStopIndex) * 5)} mins`
                : 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-[9px] text-slate-450 uppercase font-mono">TELEMETRY</span>
            <span className="text-xs font-bold text-sky-400 font-mono">
              {route.status === 'En Route' ? '32 MPH' : '0 MPH'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportMap;
