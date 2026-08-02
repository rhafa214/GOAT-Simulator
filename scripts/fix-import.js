const fs = require('fs');
const file = 'src/__tests__/AvatarComponents.test.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("import { render } from '@testing-library/react';", "import { render, act } from '@testing-library/react';");
fs.writeFileSync(file, content);
