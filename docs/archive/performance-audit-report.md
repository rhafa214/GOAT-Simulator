# Relatório de Auditoria e Otimização de Performance

## Análise de Bundle
- **Antes**: Chunk principal (Main) pesava mais de 2.6 MB, e o motor 3D carregava no momento da inicialização da aplicação inteira, impactando telas simples como o menu. A biblioteca pesada `chart.js` estava sendo usada em paralelo com a `recharts`, inflando o tamanho de pacotes.
- **Depois**: 
  - O componente de controle de roteamento (`FlowController`) agora utiliza `React.lazy` e `Suspense`. Isso dividiu o projeto em pacotes muito menores (ex: `MainMenu`, `MuseumView`, `MainHub` separadamente).
  - Componentes tridimensionais do `@react-three/fiber` em `PlayerPortrait` também são carregados sob demanda com lazy-loading e um skeleton loader leve antes do parse do WebGL.
  - O pacote `chart.js` foi desinstalado da aplicação, e o gráfico "radar" de atributos na `AttributesView` foi refatorado para utilizar o próprio `recharts`, reduzindo redundância e poupando cerca de ~300KB de bundle total (não minificado).

## Análise de Renders e Contexto
- A visualização de gráficos do HUB como o `DashboardView` e `PlayerRadarChart` estavam causando re-renderizações excessivas durante o avanço do calendário. 
- Refatorado para o uso de `React.memo`, extraindo componentes independentes (`PlayerEvolutionChart`), que isolam atualizações das barras.

## Simulações e Simulações Longas
- Verificamos a mecânica da "simulação em lote". Atualmente ela utiliza *Generator functions* acopladas com `requestAnimationFrame` que simulam até 5 steps por ciclo (`useSimulation.ts`). Isso se provou eficiente ao balancear o travamento da thread da UI com a transferência do contexto. Sendo assim, um Web Worker não seria estritamente necessário (o que causaria delay no parse do object gigantesco `GameState` via JSON bridge).

## Resultados Finais
- Os testes rodam 100% corretos sob as melhorias.
- Linters sem alertas adicionais.
- A aplicação é notavelmente mais rápida no carregamento inicial (`TTV` - Time to View).
- Carregamento assíncrono melhora experiência em redes 3G e dispositivos mobile.
