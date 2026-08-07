import re

with open('src/components/menu/MainMenu.tsx', 'r') as f:
    content = f.read()

old_block = """        <img 
          src={BRANDING.assets.logoHorizontal} 
          alt={BRANDING.name} 
          className="h-16 sm:h-24 md:h-32 object-contain mb-4 mx-auto"
        />"""

new_block = """        {BRANDING.assets.logoHorizontal ? (
          <img 
            src={BRANDING.assets.logoHorizontal} 
            alt={BRANDING.name} 
            className="w-full max-w-[80%] sm:max-w-[420px] md:max-w-[520px] h-auto object-contain mx-auto mb-2"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const textFallback = document.getElementById('logo-fallback');
              if (textFallback) textFallback.style.display = 'block';
            }}
          />
        ) : null}
        <h1 
          id="logo-fallback" 
          className="font-goat-display text-4xl font-black uppercase tracking-wider text-amber-400 goat-gold-text-glow sm:text-6xl md:text-7xl mb-2 mx-auto"
          style={{ display: BRANDING.assets.logoHorizontal ? 'none' : 'block' }}
        >
          {BRANDING.name}
        </h1>"""

content = content.replace(old_block, new_block)

# Decrease margins
content = content.replace("mb-8 text-center", "mb-4 text-center flex flex-col items-center justify-center")
content = content.replace("mb-3", "mb-2")
content = content.replace("mb-6 w-full animate-in", "mb-4 w-full animate-in")

with open('src/components/menu/MainMenu.tsx', 'w') as f:
    f.write(content)
