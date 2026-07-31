# 16. Assets - Brasil (Semente de Dados)

Os arquivos JSON foram gerados com sucesso na estrutura `/assets`, seguindo a padronização de IDs únicos e nomenclatura.

## Arquivos Gerados
*   **País (`assets/nations/brazil.json`)**: ID `nation_brazil`.
*   **Competições (`assets/competitions/brazil.json`)**: 
    *   Campeonato Brasileiro Série A (`comp_bra_serie_a`)
    *   Campeonato Brasileiro Série B (`comp_bra_serie_b`)
    *   Copa do Brasil (`comp_bra_copa_do_brasil`)
*   **Cidades (`assets/cities/brazil.json`)**:
    *   Rio de Janeiro (`city_rio_de_janeiro`)
    *   São Paulo (`city_sao_paulo`)
    *   Belo Horizonte (`city_belo_horizonte`)
    *   Porto Alegre (`city_porto_alegre`)
*   **Estádios (`assets/stadiums/brazil.json`)**:
    *   Maracanã (`stad_maracana`)
    *   Allianz Parque (`stad_allianz_parque`)
    *   Morumbi (`stad_morumbi`)
    *   Mineirão (`stad_mineirao`)
    *   Beira-Rio (`stad_beira_rio`)
*   **Clubes (`assets/clubs/brazil.json`)**:
    *   Flamengo (`club_flamengo`)
    *   Palmeiras (`club_palmeiras`)
    *   São Paulo (`club_sao_paulo`)
    *   Atlético Mineiro (`club_atletico_mineiro`)
*   **Técnicos (`assets/managers/brazil.json`)**:
    *   Tite (`man_tite`) - Flamengo
    *   Abel Ferreira (`man_abel_ferreira`) - Palmeiras
    *   Dorival Júnior (`man_dorival_junior`) - São Paulo
*   **Jogadores (`assets/players/brazil.json`)**:
    *   Gabigol (`pla_gabigol`) - Flamengo
    *   Raphael Veiga (`pla_raphael_veiga`) - Palmeiras
    *   Lucas Moura (`pla_lucas_moura`) - São Paulo
    *   Hulk (`pla_hulk`) - Atlético Mineiro

## Padrões Utilizados
*   **Chaves Primárias (IDs)**: Estilo snake_case com prefixo da entidade (`club_`, `pla_`, `comp_`, `city_`, `stad_`, `man_`, `nation_`).
*   **Relacionamentos (Foreign Keys)**: Os jogadores referenciam `club_id` e `nation_id`, os clubes referenciam `city_id` e `stadium_id`.
*   **Atributos de Jogadores**: Normalizados com stats baseados em 0-100 para facilitar os cálculos matemáticos pelo Engine.
*   **Cores dos Clubes**: Propriedades `colors_primary` e `colors_secondary` em HEX para injeção dinâmica no Tailwind (UI).
