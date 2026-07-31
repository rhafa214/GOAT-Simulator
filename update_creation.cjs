const fs = require('fs');
let code = fs.readFileSync('src/components/creation/CreationAttributes.tsx', 'utf8');

const regex = /export default function CreationAttributes\(\) \{[\s\S]*?const currentCat = DRAFT_CATEGORIES\[currentStep\];/;

const replacement = `export default function CreationAttributes() {
  const { state, dispatch } = useGameEngine();
  const [draftMode, setDraftMode] = useState<'SELECT' | 'STRATEGIC' | 'SCOUT'>('SELECT');
  const [currentStep, setCurrentStep] = useState(0);
  const [options, setOptions] = useState<DraftPlayer[]>([]);
  const [selectedCards, setSelectedCards] = useState<DraftPlayer[]>(Array(20).fill(null));
  
  // Animation states
  const [cardsEntering, setCardsEntering] = useState(true);
  const [cardsRevealed, setCardsRevealed] = useState<boolean[]>(Array(5).fill(false));
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  
  const [chemistryBonus, setChemistryBonus] = useState(0);

  useEffect(() => {
    if (draftMode !== 'SELECT' && currentStep < 20) {
      setOptions(generateOptions(DRAFT_CATEGORIES[currentStep].id));
      setCardsEntering(true);
      setCardsRevealed(Array(5).fill(false));
      setSelectedCardIndex(null);
      
      // Animate entry and reveal
      setTimeout(() => {
        setCardsEntering(false);
        // If Strategic, reveal all immediately after entry
        if (draftMode === 'STRATEGIC' || draftMode === 'SCOUT') {
           setTimeout(() => {
             setCardsRevealed(Array(5).fill(true));
           }, 500);
        }
      }, 800);
    }
  }, [currentStep, draftMode]);

  const handleSelect = (player: DraftPlayer, index: number) => {
    // Only allow selection if all cards are fully revealed
    if (!cardsRevealed.every(Boolean) || selectedCardIndex !== null) return;
    
    setSelectedCardIndex(index);
    
    setTimeout(() => {
      const newSelected = [...selectedCards];
      newSelected[currentStep] = player;
      setSelectedCards(newSelected);
      
      const styles = newSelected.filter(p => p !== null).map(p => p.style);
      const uniqueStyles = new Set(styles);
      const bonus = Math.min(3, Math.floor((styles.length - uniqueStyles.size) * 0.5));
      setChemistryBonus(bonus);

      if (currentStep < 19) {
        setCurrentStep(currentStep + 1);
      } else {
        finishDraft(newSelected, bonus);
      }
    }, 1500); // 1.5s delay to show glow and value
  };

  const finishDraft = (finalCards: DraftPlayer[], bonus: number) => {
    const technical: Record<string, number> = { ...state.player.technical };
    const rpg: Record<string, number> = { ...state.player.rpg };
    
    finalCards.forEach((card, index) => {
      if (!card) return;
      const cat = DRAFT_CATEGORIES[index];
      const val = card.stats[cat.id] || 50;
      const valWithBonus = Math.min(99, val + Math.floor(val * (bonus / 100)));
      
      if (cat.type === 'technical') technical[cat.id] = valWithBonus;
      if (cat.type === 'rpg') rpg[cat.id] = valWithBonus;
    });

    dispatch({
      type: 'INITIALIZE_PLAYER',
      payload: { technical, rpg }
    });
    dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_PERSONALITY' });
  };

  // Compute live stats for right panel
  const currentPAC = selectedCards[0] ? selectedCards[0].stats.PAC : 50;
  const currentSHO = selectedCards[1] ? selectedCards[1].stats.SHO : 50;
  const currentPAS = selectedCards[2] ? selectedCards[2].stats.PAS : 50;
  const currentDRI = selectedCards[3] ? selectedCards[3].stats.DRI : 50;
  const currentDEF = selectedCards[4] ? selectedCards[4].stats.DEF : 50;
  const currentPHY = selectedCards[5] ? selectedCards[5].stats.PHY : 50;
  const currentMEN = selectedCards[15] ? selectedCards[15].stats.DET : 50;

  const estimatedOvr = Math.floor((currentPAC + currentSHO + currentPAS + currentDRI + currentDEF + currentPHY + currentMEN) / 7);
  
  let playstyle = 'Desconhecido';
  if (currentSHO > 80 && currentPAC > 80) playstyle = 'Ponta Explosivo';
  else if (currentSHO > 85) playstyle = 'Finalizador';
  else if (currentPAS > 85 && currentDRI > 85) playstyle = 'Maestro';
  else if (currentDEF > 85) playstyle = 'Zagueiro Defensivo';
  else if (currentPHY > 85 && currentDEF > 80) playstyle = 'Volante Marcador';
  else if (currentPAC > 80 && currentDRI > 80) playstyle = 'Driblador';
  else if (currentStep > 5) playstyle = 'Equilibrado';

  if (currentStep >= 20) return null;

  const currentCat = DRAFT_CATEGORIES[currentStep];`;

if (regex.test(code)) {
   code = code.replace(regex, replacement);
   fs.writeFileSync('src/components/creation/CreationAttributes.tsx', code);
   console.log('Success state update');
} else {
   console.log('Regex 1 failed');
}
