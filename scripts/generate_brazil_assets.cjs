const fs = require('fs');
const path = require('path');

const writeJson = (filePath, data) => {
  fs.writeFileSync(path.join(process.cwd(), filePath), JSON.stringify(data, null, 2));
};

// 1. Nation
const brazilNation = {
  id: "nation_brazil",
  name: "Brasil",
  code: "BRA",
  continent: "SA",
  reputation: 9000
};
writeJson('assets/nations/brazil.json', brazilNation);

// 2. Competitions
const brazilCompetitions = [
  {
    id: "comp_bra_serie_a",
    name: "Campeonato Brasileiro Série A",
    nation_id: "nation_brazil",
    type: "LEAGUE",
    tier: 1,
    reputation: 7500
  },
  {
    id: "comp_bra_serie_b",
    name: "Campeonato Brasileiro Série B",
    nation_id: "nation_brazil",
    type: "LEAGUE",
    tier: 2,
    reputation: 5000
  },
  {
    id: "comp_bra_copa_do_brasil",
    name: "Copa do Brasil",
    nation_id: "nation_brazil",
    type: "CUP",
    tier: 1,
    reputation: 7000
  }
];
writeJson('assets/competitions/brazil.json', brazilCompetitions);

// 3. Cities
const brazilCities = [
  { id: "city_rio_de_janeiro", name: "Rio de Janeiro", nation_id: "nation_brazil" },
  { id: "city_sao_paulo", name: "São Paulo", nation_id: "nation_brazil" },
  { id: "city_belo_horizonte", name: "Belo Horizonte", nation_id: "nation_brazil" },
  { id: "city_porto_alegre", name: "Porto Alegre", nation_id: "nation_brazil" }
];
writeJson('assets/cities/brazil.json', brazilCities);

// 4. Stadiums
const brazilStadiums = [
  { id: "stad_maracana", name: "Maracanã", city_id: "city_rio_de_janeiro", capacity: 78838, quality: 90 },
  { id: "stad_allianz_parque", name: "Allianz Parque", city_id: "city_sao_paulo", capacity: 43713, quality: 95 },
  { id: "stad_morumbi", name: "Morumbi", city_id: "city_sao_paulo", capacity: 66795, quality: 85 },
  { id: "stad_mineirao", name: "Mineirão", city_id: "city_belo_horizonte", capacity: 61927, quality: 88 },
  { id: "stad_beira_rio", name: "Beira-Rio", city_id: "city_porto_alegre", capacity: 50128, quality: 87 }
];
writeJson('assets/stadiums/brazil.json', brazilStadiums);

// 5. Clubs
const brazilClubs = [
  {
    id: "club_flamengo",
    name: "Clube de Regatas do Flamengo",
    short_name: "Flamengo",
    nation_id: "nation_brazil",
    city_id: "city_rio_de_janeiro",
    stadium_id: "stad_maracana",
    reputation: 8200,
    balance: 150000000,
    transfer_budget: 30000000,
    colors_primary: "#C8102E",
    colors_secondary: "#000000"
  },
  {
    id: "club_palmeiras",
    name: "Sociedade Esportiva Palmeiras",
    short_name: "Palmeiras",
    nation_id: "nation_brazil",
    city_id: "city_sao_paulo",
    stadium_id: "stad_allianz_parque",
    reputation: 8100,
    balance: 120000000,
    transfer_budget: 25000000,
    colors_primary: "#006437",
    colors_secondary: "#FFFFFF"
  },
  {
    id: "club_sao_paulo",
    name: "São Paulo Futebol Clube",
    short_name: "São Paulo",
    nation_id: "nation_brazil",
    city_id: "city_sao_paulo",
    stadium_id: "stad_morumbi",
    reputation: 7900,
    balance: 80000000,
    transfer_budget: 15000000,
    colors_primary: "#FF0000",
    colors_secondary: "#FFFFFF"
  },
  {
    id: "club_atletico_mineiro",
    name: "Clube Atlético Mineiro",
    short_name: "Atlético Mineiro",
    nation_id: "nation_brazil",
    city_id: "city_belo_horizonte",
    stadium_id: "stad_mineirao",
    reputation: 7800,
    balance: 90000000,
    transfer_budget: 18000000,
    colors_primary: "#000000",
    colors_secondary: "#FFFFFF"
  }
];
writeJson('assets/clubs/brazil.json', brazilClubs);

// 6. Managers
const brazilManagers = [
  {
    id: "man_tite",
    first_name: "Adenor",
    last_name: "Bachi",
    nickname: "Tite",
    nation_id: "nation_brazil",
    club_id: "club_flamengo",
    tactical_knowledge: 85,
    style: "Possession"
  },
  {
    id: "man_abel_ferreira",
    first_name: "Abel",
    last_name: "Ferreira",
    nickname: "Abel",
    nation_id: "nation_portugal",
    club_id: "club_palmeiras",
    tactical_knowledge: 88,
    style: "Gegenpressing"
  },
  {
    id: "man_dorival_junior",
    first_name: "Dorival",
    last_name: "Júnior",
    nickname: "Dorival Jr",
    nation_id: "nation_brazil",
    club_id: "club_sao_paulo",
    tactical_knowledge: 82,
    style: "Attacking"
  }
];
writeJson('assets/managers/brazil.json', brazilManagers);

// 7. Players
const brazilPlayers = [
  {
    id: "pla_gabigol",
    first_name: "Gabriel",
    last_name: "Barbosa",
    nickname: "Gabigol",
    birth_date: "1996-08-30",
    nation_id: "nation_brazil",
    club_id: "club_flamengo",
    position: "ST",
    status: "ACTIVE",
    current_ability: 82,
    potential_ability: 84,
    attributes: {
      pac: 80, sho: 85, pas: 72, dri: 81, def: 35, phy: 75, fitness: 100, morale: 80
    }
  },
  {
    id: "pla_raphael_veiga",
    first_name: "Raphael",
    last_name: "Veiga",
    nickname: "Veiga",
    birth_date: "1995-06-19",
    nation_id: "nation_brazil",
    club_id: "club_palmeiras",
    position: "CAM",
    status: "ACTIVE",
    current_ability: 83,
    potential_ability: 83,
    attributes: {
      pac: 76, sho: 84, pas: 85, dri: 82, def: 50, phy: 70, fitness: 100, morale: 90
    }
  },
  {
    id: "pla_lucas_moura",
    first_name: "Lucas",
    last_name: "Moura",
    nickname: "Lucas",
    birth_date: "1992-08-13",
    nation_id: "nation_brazil",
    club_id: "club_sao_paulo",
    position: "RW",
    status: "ACTIVE",
    current_ability: 81,
    potential_ability: 81,
    attributes: {
      pac: 86, sho: 78, pas: 75, dri: 85, def: 40, phy: 68, fitness: 100, morale: 85
    }
  },
  {
    id: "pla_hulk",
    first_name: "Givanildo",
    last_name: "Vieira de Sousa",
    nickname: "Hulk",
    birth_date: "1986-07-25",
    nation_id: "nation_brazil",
    club_id: "club_atletico_mineiro",
    position: "ST",
    status: "ACTIVE",
    current_ability: 82,
    potential_ability: 82,
    attributes: {
      pac: 78, sho: 88, pas: 76, dri: 80, def: 45, phy: 92, fitness: 100, morale: 90
    }
  }
];
writeJson('assets/players/brazil.json', brazilPlayers);

console.log('JSON assets successfully generated!');
