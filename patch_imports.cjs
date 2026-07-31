const fs = require('fs');
const path = 'src/components/hub/DashboardView.tsx';

let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "Play,\n  ArrowRight\n} from 'lucide-react';",
  "Play,\n  ArrowRight,\n  Shield,\n  Goal\n} from 'lucide-react';"
);

fs.writeFileSync(path, content);
