const fs = require('fs');
let code = fs.readFileSync('src/components/creation/CreationAttributes.tsx', 'utf8');

const regex = /return \([\s\S]*?\);\n\}/;

const replacement = `if (draftMode === 'SELECT') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
        <h1 className="text-5xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] uppercase mb-4 text-center">Modo de Draft</h1>
        <p className="text-zinc-400 font-bold mb-12 max-w-2xl text-center">O Draft definirá os atributos base do seu jogador. Escolha o modo de jogo que mais combina com seu estilo.</p>
        
        <div className="flex gap-8 max-w-4xl w-full">
           <button 
             onClick={() => setDraftMode('STRATEGIC')}
             className="flex-1 bg-white/5 border border-white/10 hover:border-yellow-500/50 hover:bg-yellow-500/10 rounded-[2rem] p-8 text-left transition-all duration-300 group"
           >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <span className="text-3xl">🧠</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Estratégico</h2>
              <ul className="space-y-3 text-sm font-bold text-zinc-400">
                <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500" /> Todas as cartas são reveladas.</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500" /> Você visualiza todos os atributos.</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500" /> Compare antes de escolher.</li>
              </ul>
           </button>

           <button 
             onClick={() => setDraftMode('SCOUT')}
             className="flex-1 bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 rounded-[2rem] p-8 text-left transition-all duration-300 group"
           >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <span className="text-3xl">🕵️</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Scout (Às Cegas)</h2>
              <ul className="space-y-3 text-sm font-bold text-zinc-400">
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> O atributo da categoria fica oculto (???).</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Deduza pelo nome, foto e posição.</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Revelado somente após a escolha.</li>
              </ul>
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 relative">
      {/* Top Bar - Draft Progress */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between p-4 bg-black/40 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-4">
          <span>Seu Jogador</span>
          <span className="text-yellow-500">{currentStep}/20 Slots</span>
        </div>
        <div className="flex gap-1 overflow-x-auto hide-scrollbar max-w-[50vw]">
          {selectedCards.map((c, i) => (
            <div key={i} className={\`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold \${c ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500' : 'border-white/10 bg-black/50 text-white/20'}\`}>
              {c ? DRAFT_CATEGORIES[i].id : '-'}
            </div>
          ))}
        </div>
      </div>

      {/* Main Draft Area */}
      <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-6 px-4 relative">
        <motion.div 
          key={currentCat.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-xl font-bold text-zinc-500 uppercase tracking-widest mb-2">Escolha um atributo</h2>
          <h1 className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase">
            {currentCat.name}
          </h1>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-5xl perspective-1000">
          <AnimatePresence mode="popLayout">
            {options.map((player, index) => {
              const isSelected = selectedCardIndex === index;
              const notSelected = selectedCardIndex !== null && !isSelected;
              const showAttr = draftMode === 'STRATEGIC' || isSelected;

              return (
                <motion.div
                  key={\`\${currentCat.id}-\${index}\`}
                  initial={{ opacity: 0, y: cardsEntering ? -100 : 0, scale: 0.8, rotateY: 90 }}
                  animate={{ 
                    opacity: notSelected ? 0.3 : 1, 
                    y: 0, 
                    scale: isSelected ? 1.05 : 1, 
                    rotateY: cardsRevealed[index] ? 180 : 0 
                  }}
                  transition={{ duration: 0.6, type: 'spring', bounce: 0.4, delay: cardsEntering ? index * 0.1 : 0 }}
                  onClick={() => handleSelect(player, index)}
                  className={\`relative w-40 md:w-52 aspect-[2/3] rounded-2xl cursor-pointer group transform-style-3d \${!selectedCardIndex && 'hover:scale-105'} transition-transform duration-300\`}
                >
                  {/* Highlight Selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-2xl z-0" />
                  )}

                  {/* Back of Card (Before Click) */}
                  <div className={\`absolute inset-0 backface-hidden bg-gradient-to-br from-zinc-800 to-black rounded-2xl border border-white/20 shadow-xl flex items-center justify-center overflow-hidden z-10\`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5">
                      <span className="text-white/50 text-2xl font-black">?</span>
                    </div>
                  </div>

                  {/* Front of Card (After Click) */}
                  <div className={\`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br \${RARITY_COLORS[player.rarity]} rounded-2xl p-4 flex flex-col justify-between overflow-hidden z-10 \${isSelected ? 'shadow-[0_0_40px_rgba(234,179,8,0.6)] border-yellow-400 border-2' : ''}\`}>
                    {/* Glass highlight */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-2xl md:text-4xl font-black">{player.overall}</span>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80">{player.position}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] md:text-xs mb-1">{RARITY_STARS[player.rarity]}</div>
                        <div className="text-[10px] font-bold uppercase opacity-90">{player.nationality}</div>
                        <div className="text-[9px] uppercase opacity-70 mt-1">{player.club}</div>
                      </div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center mt-2 mb-4">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-black/20 rounded-full border-2 border-white/20 mb-2 flex items-center justify-center overflow-hidden">
                         <span className="text-4xl">👤</span>
                      </div>
                      <span className="text-center font-black text-sm md:text-base leading-tight uppercase truncate w-full">{player.name}</span>
                    </div>

                    <div className="relative z-10 bg-black/40 rounded-xl p-2 md:p-3 text-center border border-white/20 backdrop-blur-md">
                      <div className="text-[10px] uppercase font-bold opacity-80 mb-1">{currentCat.name}</div>
                      <div className="text-2xl md:text-3xl font-black text-white">
                        {showAttr ? (player.stats[currentCat.id] || 50) : '???'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel - Live Player Status */}
      <div className="w-full md:w-80 bg-black/60 backdrop-blur-3xl border-l border-white/10 p-6 flex flex-col pt-24 shrink-0 overflow-y-auto hide-scrollbar z-40">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-amber-950 font-black text-4xl shadow-[0_0_30px_rgba(251,191,36,0.3)] mb-4 border-4 border-black">
            {estimatedOvr}
          </div>
          <div className="font-bold text-white uppercase tracking-widest">OVR Estimado</div>
          <div className="text-xs text-yellow-500 font-bold mt-1 uppercase">Química: +{chemistryBonus}%</div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-xs font-bold text-zinc-400 uppercase">Estilo de Jogo</span>
            <span className="text-sm font-black text-white">{playstyle}</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-xs font-bold text-zinc-400 uppercase">Posição</span>
            <span className="text-sm font-black text-white">{state.player.position || '-'}</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-xs font-bold text-zinc-400 uppercase">Altura / Peso</span>
            <span className="text-sm font-black text-white">{state.player.appearance?.height}cm / {state.player.appearance?.weight}kg</span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Principais Atributos</h3>
          <div className="space-y-3">
            <StatRow label="PAC" value={currentPAC} selected={selectedCards[0] !== null} />
            <StatRow label="SHO" value={currentSHO} selected={selectedCards[1] !== null} />
            <StatRow label="PAS" value={currentPAS} selected={selectedCards[2] !== null} />
            <StatRow label="DRI" value={currentDRI} selected={selectedCards[3] !== null} />
            <StatRow label="DEF" value={currentDEF} selected={selectedCards[4] !== null} />
            <StatRow label="PHY" value={currentPHY} selected={selectedCards[5] !== null} />
            <StatRow label="MEN" value={currentMEN} selected={selectedCards[15] !== null} />
          </div>
        </div>
      </div>
    </div>
  );
}`;

if (regex.test(code)) {
   code = code.replace(regex, replacement);
   fs.writeFileSync('src/components/creation/CreationAttributes.tsx', code);
   console.log('Success state update');
} else {
   console.log('Regex failed');
}
