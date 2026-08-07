import re

with open('src/components/ui/PlayerPortrait.tsx', 'r') as f:
    content = f.read()

old_block = """        {/* Silhouette SVG */}
        <svg className="w-16 h-16 text-zinc-500 mt-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>"""

new_block = """        <img src={BRANDING.assets.shield} alt="GOAT" className="w-12 h-12 object-contain opacity-50" />"""

if 'import { BRANDING } from' not in content:
    content = "import { BRANDING } from '../../core/constants/branding';\n" + content

content = content.replace(old_block, new_block)

with open('src/components/ui/PlayerPortrait.tsx', 'w') as f:
    f.write(content)
