const fs = require('fs');
const path = 'src/components/hub/DashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace ResponsiveContainer block with a placeholder
content = content.replace(
  /<div className="w-full h-full border-b-2 border-l-2 border-green-500\/20 relative">[\s\S]*?<\/div>/m,
  `<ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0C10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Line type="monotone" dataKey="ovr" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#1A1C23', stroke: '#22c55e', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>`
);

fs.writeFileSync(path, content);
