const fs = require('fs');

const path = 'src/components/hub/PostMatchScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

// The h3 currently contains:
/*
      <h3 className="text-3xl md:text-5xl font-black mb-12 z-10 drop-shadow-lg">
        {lastMatch.home ? career.currentClub?.name : lastMatch.opponent} 
        <span className="text-zinc-600 mx-4 font-serif italic">vs</span> 
        {!lastMatch.home ? career.currentClub?.name : lastMatch.opponent}
      </h3>
*/

const newH3 = `
      <div className="flex items-center justify-center gap-6 mb-12 z-10 w-full px-4">
        <div className="flex flex-col items-center gap-4 w-2/5">
          {lastMatch.home ? (
            career.currentClub?.logo ? <img src={career.currentClub.logo} alt="Home" className="w-24 h-24 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" /> : null
          ) : (
            lastMatch.opponentLogo ? <img src={lastMatch.opponentLogo} alt="Home" className="w-24 h-24 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" /> : null
          )}
          <h3 className="text-2xl md:text-4xl font-black drop-shadow-lg text-center leading-tight">
            {lastMatch.home ? career.currentClub?.name : lastMatch.opponent} 
          </h3>
        </div>
        
        <div className="text-zinc-600 font-serif italic text-2xl md:text-4xl w-1/5 text-center">vs</div> 
        
        <div className="flex flex-col items-center gap-4 w-2/5">
          {!lastMatch.home ? (
            career.currentClub?.logo ? <img src={career.currentClub.logo} alt="Away" className="w-24 h-24 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" /> : null
          ) : (
            lastMatch.opponentLogo ? <img src={lastMatch.opponentLogo} alt="Away" className="w-24 h-24 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" /> : null
          )}
          <h3 className="text-2xl md:text-4xl font-black drop-shadow-lg text-center leading-tight">
            {!lastMatch.home ? career.currentClub?.name : lastMatch.opponent}
          </h3>
        </div>
      </div>
`;

content = content.replace(/<h3 className="text-3xl md:text-5xl font-black mb-12 z-10 drop-shadow-lg">[\s\S]*?<\/h3>/m, newH3.trim());

fs.writeFileSync(path, content);
