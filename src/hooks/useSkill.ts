import { useState, useCallback } from 'react';
import { useLLM, useLLMSettings } from './useLLM';

export interface Skill {
  name: string;
  description: string;
  tools: string[];
  model: string;
  systemPrompt: string;
}

// Skill definitions (loaded from localStorage or defaults)
const DEFAULT_SKILLS: Record<string, Skill> = {
  architect: {
    name: 'Architect',
    description: 'Especialista em arquitetura narrativa',
    tools: ['read', 'write', 'llm_generate'],
    model: 'anthropic/claude-3.5-sonnet',
    systemPrompt: `Você é o Architect, um especialista em estrutura narrativa.
Analise ideias e proponha estruturas de livros com múltiplas variações.
Para cada projeto, gere: Logline, Conceito, Tom, Estrutura, Arcos, 3 variações.`,
  },
  'bible-keeper': {
    name: 'Bible Keeper',
    description: 'Guardião da consistência do worldbuilding',
    tools: ['read'],
    model: 'gpt-4o-mini',
    systemPrompt: `Você é o Bible Keeper. Verifique se elementos respeitam as regras da Bible.
Identifique inconsistências e sugira correções.`,
  },
  'voice-smith': {
    name: 'Voice Smith',
    description: 'Especialista em diálogos',
    tools: ['read', 'write'],
    model: 'anthropic/claude-3-haiku',
    systemPrompt: `Você é o Voice Smith, mestre em diálogos.
Cada personagem tem voz ÚNICA. Diálogos revelam personalidade, não explicam.
Use subtexto, conflito, ritmo variado.`,
  },
  'consistency-guard': {
    name: 'Consistency Guard',
    description: 'Verifica continuidade cronológica',
    tools: ['read'],
    model: 'gpt-4o-mini',
    systemPrompt: `Você é o Consistency Guard. Verifique timeline, causa-efeito, estado de personagens.
Alerte sobre plot holes e continuidade quebrada.`,
  },
  'red-pen': {
    name: 'Red Pen',
    description: 'Editor literário',
    tools: ['read', 'write'],
    model: 'anthropic/claude-3.5-sonnet',
    systemPrompt: `Você é o Red Pen, editor sem piedade.
"Kill your darlies", mostre não diga, clareza é rei.
Marque: 🔴 CORTAR, 🟡 CONDENSAR, 🟢 EXPANDIR, 🔵 REESCREVER.`,
  },
};

export interface UseSkillOptions {
  skillName: string;
}

export function useSkill({ skillName }: UseSkillOptions) {
  const skill = DEFAULT_SKILLS[skillName] || null;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { settings } = useLLMSettings();
  const { isLoading: isGenerating, generate } = useLLM({ config: settings });

  // Execute skill with input
  const execute = useCallback(async (input: string, context?: string) => {
    if (!skill) {
      throw new Error(`Skill "${skillName}" not found`);
    }

    setIsLoading(true);
    setError(null);

    try {
      const prompt = `${skill.systemPrompt}

${context ? `Context:\n${context}\n\n` : ''}
Input: ${input}

Respond according to your role as ${skill.name}.`;

      await generate(prompt);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [skill, skillName, generate]);

  return {
    skill,
    isLoading,
    isGenerating,
    error,
    execute,
  };
}

// Get all available skills
export function getAvailableSkills(): Array<{ id: string; name: string; description: string }> {
  return Object.entries(DEFAULT_SKILLS).map(([id, skill]) => ({
    id,
    name: skill.name,
    description: skill.description,
  }));
}
