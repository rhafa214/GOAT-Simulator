import re

with open('src/components/creation/DraftCard.tsx', 'r') as f:
    content = f.read()

old_block = """          {option.photoUrl ? (
            <img
              src={option.photoUrl}
              alt={option.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-zinc-400" />
          )}"""

new_block = """          {option.photoUrl ? (
            <img
              src={option.photoUrl}
              alt={option.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={BRANDING.assets.shield} alt="GOAT" className="w-10 h-10 object-contain opacity-60" />
          )}"""

if 'import { BRANDING } from' not in content:
    content = "import { BRANDING } from '../../core/constants/branding';\n" + content

content = content.replace(old_block, new_block)

with open('src/components/creation/DraftCard.tsx', 'w') as f:
    f.write(content)
