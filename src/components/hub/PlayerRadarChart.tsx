import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useGameEngine } from '../../engine/GameEngine';

export default function PlayerRadarChart() {
  const { state } = useGameEngine();
  const { technical } = state.player;

  const data = [
    { subject: 'PAC', A: technical.PAC, fullMark: 99 },
    { subject: 'SHO', A: technical.SHO, fullMark: 99 },
    { subject: 'PAS', A: technical.PAS, fullMark: 99 },
    { subject: 'DRI', A: technical.DRI, fullMark: 99 },
    { subject: 'DEF', A: technical.DEF, fullMark: 99 },
    { subject: 'PHY', A: technical.PHY, fullMark: 99 },
  ];

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 'bold' }} />
          <Radar name="Stats" dataKey="A" stroke="#eab308" fill="#eab308" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
