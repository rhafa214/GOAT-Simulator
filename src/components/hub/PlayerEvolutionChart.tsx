import React, { memo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface PlayerEvolutionChartProps {
  evolutionData: { name: string; ovr: number }[];
}

const PlayerEvolutionChart = memo(function PlayerEvolutionChart({ evolutionData }: PlayerEvolutionChartProps) {
  return (
    <div className="w-full flex-1 min-h-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={evolutionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#34d399' }}
          />
          <Line type="monotone" dataKey="ovr" stroke="#34d399" strokeWidth={2} dot={{ r: 4, fill: '#000', stroke: '#34d399', strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default PlayerEvolutionChart;
