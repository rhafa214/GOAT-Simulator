export function useValidatedGLBUrl(url: string): string {
  // A validação pesada do GLB no navegador (fetch + arrayBuffer) foi removida, 
  // pois o arquivo já é validado pelo hash no pipeline de build (scripts/check-protected-assets.mjs).
  // O hook useGLTF do @react-three/drei já realiza o fetch e faz o cache da promise internamente.
  // Isso evita o download duplo de arquivos grandes (ex: 9.7MB) e
  // o travamento do React Suspense (spinner infinito) causado por promises não controladas.
  return url;
}
