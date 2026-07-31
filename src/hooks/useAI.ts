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
      const data = await response.json();
      setLoading(false);
      return data.text;
    } catch (e) {
      console.error(e);
      setLoading(false);
      return "Não foi possível carregar a história.";
    }
  }, []);

  return { generate, loading };
}
