export interface RawClub {
  external_id?: string | number;
  name?: string;
  short_name?: string;
  code?: string;
  city?: string;
  state?: string;
  country?: string;
  stadium?: string;
  capacity?: number;
  founded?: number;
  colors?: string[];
  logo?: string;
}

export interface ValidatedClub {
  external_id: string;
  official_name: string;
  short_name: string;
  abbreviation: string | null;
  city: string;
  state: string | null;
  country: string;
  stadium_name: string | null;
  stadium_capacity: number | null;
  foundation_year: number | null;
  colors: string[];
  logo_url: string | null;
}

export interface ValidationResult {
  valid: ValidatedClub[];
  invalid: { data: RawClub; reason: string }[];
  warnings: { data: ValidatedClub; warning: string }[];
}

export function validateClubs(rawClubs: RawClub[]): ValidationResult {
  const result: ValidationResult = {
    valid: [],
    invalid: [],
    warnings: []
  };

  for (const raw of rawClubs) {
    // Regra Crítica: Deve ter ID externo para não perdermos a rastreabilidade (sem id falso)
    if (!raw.external_id) {
      result.invalid.push({ data: raw, reason: "ID Externo ausente. Não pode ser vinculado a uma base oficial." });
      continue;
    }

    // Regra Crítica: Deve ter Nome Oficial
    if (!raw.name || raw.name.trim() === '') {
      result.invalid.push({ data: raw, reason: "Nome Oficial ausente." });
      continue;
    }

    // Regra Crítica: Não aceitar times "B" fictícios ou descrições inválidas 
    // (Pode ser refinado se a fonte oficial listar times B reais, mas como segurança evitamos)
    if (raw.name.match(/ Fictício| Fake| Test/i)) {
       result.invalid.push({ data: raw, reason: "Identificado como dado de teste/fictício." });
       continue;
    }

    if (!raw.country) {
       result.invalid.push({ data: raw, reason: "País de origem ausente." });
       continue;
    }

    const validated: ValidatedClub = {
      external_id: String(raw.external_id),
      official_name: raw.name.trim(),
      short_name: raw.short_name ? raw.short_name.trim() : raw.name.trim(),
      abbreviation: raw.code ? raw.code.trim().substring(0, 3).toUpperCase() : null,
      city: raw.city ? raw.city.trim() : "Desconhecida", // Cidade pode exigir fallback provisório, mas o País não.
      state: raw.state ? raw.state.trim() : null,
      country: raw.country.trim(),
      stadium_name: raw.stadium ? raw.stadium.trim() : null,
      stadium_capacity: raw.capacity && raw.capacity > 0 ? raw.capacity : null,
      foundation_year: raw.founded && raw.founded > 1850 && raw.founded <= new Date().getFullYear() ? raw.founded : null,
      colors: raw.colors || [],
      logo_url: raw.logo ? raw.logo.trim() : null
    };

    if (validated.city === "Desconhecida") {
       result.warnings.push({ data: validated, warning: "Cidade desconhecida. Preenchido com placeholder temporário, requer curadoria." });
    }

    if (!validated.stadium_name || !validated.stadium_capacity) {
       result.warnings.push({ data: validated, warning: "Informações de estádio incompletas (nome ou capacidade ausente)." });
    }

    result.valid.push(validated);
  }

  return result;
}
