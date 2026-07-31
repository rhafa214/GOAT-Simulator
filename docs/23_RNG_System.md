# RNG System

O sistema de geração de números aleatórios (RNG) foi centralizado no módulo `src/utils/rng.ts`. 

## Problema Resolvido
Anteriormente, o `GameEngine.tsx` e outros sistemas chamavam `Math.random()` diretamente. Isso dificultava a criação de testes determinísticos e a reprodução de cenários complexos (como a evolução de uma carreira com a mesma semente).

## Abstração: `IRNG`
A interface `IRNG` define operações de domínio comuns e seguras:
- `random()`: Float [0, 1).
- `integer(min, max)`: Inteiro [min, max].
- `float(min, max)`: Float [min, max).
- `chance(percent)`: Booleano representando chance (0 a 100).
- `pick(items)`: Elemento aleatório de array.
- `shuffle(items)`: Retorna uma cópia embaralhada do array.

## Implementações
- `DefaultRNG`: Baseada em `Math.random()`, usada em produção por padrão.
- `SeededRNG`: Baseada num PRNG (Mulberry32) permitindo que sementes garantam os mesmos resultados, ideal para simulações ou testes.

## Uso
No código do domínio, importar `rng` e usar seus métodos:
```typescript
import { rng } from '../utils/rng';

const randomValue = rng.integer(1, 10);
if (rng.chance(50)) { ... }
const item = rng.pick(myArray);
```

As funções testáveis ou que requeiram determinismo podem injetar/substituir o RNG global via `setRNG(new SeededRNG(seed))`.
