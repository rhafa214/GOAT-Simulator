# Regras de Desenvolvimento (Workflow)

Conforme as diretrizes estabelecidas:

1. **Iteração por Etapas:** NUNCA desenvolva o projeto inteiro em uma única resposta.
2. **Ordem de Planejamento:** 
   1. Análise técnica completa.
   2. Game Design Document (GDD).
   3. Arquitetura do sistema.
   4. Modelagem de banco de dados.
   5. Descrição de telas.
   6. Descrição de componentes.
   7. Design System.
3. **Implementação:** Implementar apenas UMA funcionalidade por vez. A funcionalidade deve ser entregue completamente pronta, testável e integrada.
4. **Contexto:** Manter a documentação na pasta `/docs` atualizada e como fonte de verdade para não contradizer decisões anteriores.
5. **Trade-offs:** Sempre que houver múltiplas soluções, apresentar vantagens e desvantagens antes de aplicar a escolha.


## PROTECTED BINARY ASSETS
- arquivos .glb, .gltf, .fbx, .blend, .png, .jpg, .jpeg, .webp, .mp3, .wav, .mp4 e .zip são somente leitura para agentes de IA;
- nunca editar, recriar, converter, reserializar, mover ou excluir esses arquivos;
- nunca gerar conteúdo textual e salvá-lo com extensão binária;
- nunca usar scripts para sobrescrever assets;
- qualquer alteração exige autorização explícita do proprietário;
- o agente pode apenas ler metadados, caminhos, tamanho e hash;
- alterações em manifest.json continuam permitidas, mas o binário não.
