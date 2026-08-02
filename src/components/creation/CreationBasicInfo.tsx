import React, { useState } from 'react';
import { usePlayer } from '../../engine/selectors';
import { useGameActions } from '../../engine/actions';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '../ui';

export default function CreationBasicInfo() {
  const player = usePlayer();
  const actions = useGameActions();
  
  const [name, setName] = useState(player.name);
  const [nationality, setNationality] = useState(player.nationality || 'BR');

  const NATIONS = [
    { code: 'BR', name: 'Brasil' },
    { code: 'AR', name: 'Argentina' },
    { code: 'FR', name: 'França' },
    { code: 'EN', name: 'Inglaterra' },
    { code: 'ES', name: 'Espanha' },
    { code: 'IT', name: 'Itália' },
    { code: 'PT', name: 'Portugal' },
    { code: 'DE', name: 'Alemanha' }
  ];

  const handleNext = () => {
    if (!name.trim()) return;
    actions.initializePlayer({ name, nationality });
    actions.advancePhase('CREATION_POSITION');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto"
    >
      <Card variant="elevated">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold mb-2">Quem é você?</CardTitle>
          <CardDescription>O primeiro passo de uma lenda começa com o nome.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="playerNameInput" className="text-xs font-semibold text-white/60 uppercase tracking-wider block">Nome do Jogador</label>
            <input 
              id="playerNameInput"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              maxLength={18}
              className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="playerNationalitySelect" className="text-xs font-semibold text-white/60 uppercase tracking-wider block">Nacionalidade</label>
            <select 
              id="playerNationalitySelect"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none"
            >
              {NATIONS.map(n => (
                <option key={n.code} value={n.code} className="bg-zinc-900">{n.name}</option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={!name.trim()}
            className="w-full mt-4 font-bold uppercase tracking-wide"
            size="lg"
          >
            Avançar
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
