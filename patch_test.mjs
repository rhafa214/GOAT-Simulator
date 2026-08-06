import fs from 'fs';
let content = fs.readFileSync('src/components/3d/anim/__tests__/useProceduralIdle.test.tsx', 'utf8');

content = content.replace(
  `  it('handles fallback gracefully without skeleton (missing bones)', () => {
    const emptyScene = new THREE.Scene(); // No bones
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    renderHook(() => useProceduralIdle({ scene: emptyScene }));
    
    // In DEV, it should warn about missing bones
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Missing bones'));
    
    // Should not crash on frame
    expect(() => {
      frameCallback({ clock: { getElapsedTime: () => 1.0 } });
    }).not.toThrow();
  });`,
  `  it('handles fallback gracefully without skeleton (missing bones)', () => {
    const emptyScene = new THREE.Scene(); // No bones
    
    renderHook(() => useProceduralIdle({ scene: emptyScene }));
    
    // Should not crash on frame when bones are missing
    expect(() => {
      frameCallback({ clock: { getElapsedTime: () => 1.0 } });
    }).not.toThrow();
  });`
);

fs.writeFileSync('src/components/3d/anim/__tests__/useProceduralIdle.test.tsx', content);
console.log('patched');
