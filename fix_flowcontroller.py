import re

with open('src/components/FlowController.tsx', 'r') as f:
    content = f.read()

old_block = """            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              F
            </div>"""

new_block = """            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 shadow-[0_0_20px_rgba(234,179,8,0.15)] overflow-hidden">
              <img src={BRANDING.assets.shield} alt="Escudo GOAT" className="w-full h-full object-contain p-1" />
            </div>"""

content = content.replace(old_block, new_block)

with open('src/components/FlowController.tsx', 'w') as f:
    f.write(content)
