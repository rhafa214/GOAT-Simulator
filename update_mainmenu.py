import re

with open('src/components/menu/MainMenu.tsx', 'r') as f:
    content = f.read()

old_block = """        <h1 className="font-goat-display text-5xl font-black uppercase tracking-wider text-amber-400 goat-gold-text-glow sm:text-7xl md:text-8xl">
          GOAT SIMULATOR
        </h1>"""

new_block = """        <img 
          src={BRANDING.assets.logoHorizontal} 
          alt={BRANDING.name} 
          className="h-16 sm:h-24 md:h-32 object-contain mb-4 mx-auto"
        />"""

content = content.replace(old_block, new_block)

with open('src/components/menu/MainMenu.tsx', 'w') as f:
    f.write(content)
