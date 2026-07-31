import React, { useMemo } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function AttributesView() {
  const { state } = useGameEngine();
  const player = state.player;

  const chartData = useMemo(() => {
    return {
      labels: ['Finalização', 'Passe', 'Drible', 'Físico', 'Defesa', 'Tática'],
      datasets: [
        {
          label: 'Atributos Atuais',
          data: [
            player.technical.SHO,
            player.technical.PAS,
            player.technical.DRI,
            player.rpg.fitness, // Using fitness as físico
            player.technical.DEF, 
            player.technical.VIS, 
          ],
          backgroundColor: 'rgba(234, 179, 8, 0.2)', // Yellow-500
          borderColor: 'rgba(234, 179, 8, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(234, 179, 8, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(234, 179, 8, 1)'
        },
      ],
    };
  }, [player.rpg]);

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 12,
            family: 'system-ui, sans-serif',
            weight: 'bold' as const
          }
        },
        ticks: {
          display: false,
          min: 0,
          max: 100
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 h-full">
      {/* Radar Chart Area */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-xl flex flex-col"
      >
        <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-6 text-center">Análise de Desempenho (Chart.js)</h3>
        <div className="flex-1 min-h-[300px] relative w-full">
           <Radar data={chartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Details Area */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 flex flex-col gap-4"
      >
        <AttributeBar label="Finalização" value={player.technical.SHO} />
        <AttributeBar label="Passe" value={player.technical.PAS} />
        <AttributeBar label="Drible" value={player.technical.DRI} />
        <AttributeBar label="Condição Física" value={player.rpg.fitness} />
        <div className="mt-auto bg-black/40 border border-white/5 p-6 rounded-[2rem]">
          <h4 className="text-white font-bold mb-2">Desenvolvimento</h4>
          <p className="text-zinc-400 text-sm">Treine para melhorar seus atributos ou evolua em partidas oficiais. Os atributos afetam diretamente a simulação de jogo.</p>
        </div>
      </motion.div>
    </div>
  );
}

function AttributeBar({ label, value }: { label: string, value: number }) {
  const displayValue = Math.floor(value);
  const getColor = (v: number) => {
    if (v >= 90) return 'from-yellow-400 to-yellow-600';
    if (v >= 75) return 'from-green-400 to-green-600';
    if (v >= 60) return 'from-blue-400 to-blue-600';
    return 'from-zinc-500 to-zinc-600';
  };

  return (
    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-5">
      <div className="flex justify-between items-end mb-3">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
        <span className="text-xl font-black text-white">{displayValue}</span>
      </div>
      <div className="w-full bg-black/50 rounded-full h-2 shadow-inner overflow-hidden">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${getColor(displayValue)}`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}
