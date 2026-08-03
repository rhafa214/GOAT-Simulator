import { useState, useCallback } from 'react';

export function useAI() {
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async (prompt: string, systemInstruction: string, schema?: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction, schema })
      });
      if (!response.ok) {
        throw new Error('Server returned ' + response.status);
      }
      const data = await response.json();
      setLoading(false);
      return data.text || "Uma nova etapa se inicia com grandes ambições e um plano de carreira meticuloso para alcançar o topo do futebol mundial.";
    } catch (e) {
      console.warn('Servidor de IA indisponível. Utilizando fallback local:', e);
      setLoading(false);
      
      // Simple dynamic fallback generator based on keywords in prompt
      if (prompt.includes('notícia') || prompt.includes('jornalista')) {
        return "A comissão técnica e a torcida estão extremamente otimistas com a evolução diária demonstrada nos treinamentos. A dedicação demonstrada nos bastidores promete render frutos valiosos nas próximas semanas da liga profissional.";
      }
      return "Um momento marcante no desenvolvimento do jovem atleta. Com uma determinação impecável e foco tático absoluto, o jogador consolida sua trajetória demonstrando maestria técnica sob as expectativas do clube.";
    }
  }, []);

  return { generate, loading };
}
