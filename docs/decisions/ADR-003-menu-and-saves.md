# ADR 003: Menu Inicial e Gerenciamento de Saves

## Contexto
O jogo iniciava diretamente na tela de criação de personagem (`CREATION_BASIC_INFO`), dificultando o retorno a carreiras anteriores ou a importação de saves compartilhados, indo contra o requisito de implementar as funcionalidades do Save System em uma interface.

## Decisão
Foi adicionado o fluxo do "Menu Inicial" (`MAIN_MENU`) como a nova porta de entrada (`initialState.phase = 'MAIN_MENU'`). O `FlowController` passa a renderizar o componente `MainMenu` como a principal rota inicial. 

A interface `GameState` foi atualizada com a propriedade `saveSlot` para que, ao carregar ou iniciar uma nova carreira, o Engine saiba qual slot pertence à sessão atual, facilitando o autosave futuramente.

O `MainMenu` foi implementado como uma interface contida, com as seguintes funcionalidades:
- **Nova Carreira:** Inicia um novo save a partir da fase de criação.
- **Continuar:** Carrega a carreira mais recente salva.
- **Gerenciar Saves:** Lista todos os saves armazenados localmente ordenados por data da atualização.
- **Excluir:** Botão com dupla confirmação para remoção permanente.
- **Importar/Exportar:** Lida com leitura/escrita de arquivos `.json` ou texto cru.

## Consequências
- A experiência de jogo agora possui um fluxo tradicional (Menu -> Jogo).
- Usuários podem compartilhar carreiras através de arquivos JSON via interface visual.
- A fase inicial requer que o menu defina a transição para a criação da carreira quando necessário.
