import fs from 'fs';

const path = 'src/components/creation/CreationDraftClub.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("style={{ backgroundColor: selectedClub.primaryColor, color: selectedClub.secondaryColor || '#fff' }}", "style={{ backgroundColor: selectedClub.primaryColor, color: '#fff' }}");
content = content.replace(/<p className="text-sm text-zinc-300 bg-black\/40 p-4 rounded-xl border border-white\/5 italic">\s*"\{selectedClub\.description\}"\s*<\/p>/g, '');

fs.writeFileSync(path, content);
