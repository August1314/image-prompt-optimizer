import type { AIProvider, ProviderConfig } from './types'

export interface ProviderDefinition {
  id: AIProvider
  label: string
  description: string
  defaultModel: string
  baseURL?: string
  envKey: 'OPENAI_API_KEY' | 'GEMINI_API_KEY'
  keyPlaceholder: string
  modelPlaceholder: string
}

export const PROVIDERS: Record<AIProvider, ProviderDefinition> = {
  openai: {
    id: 'openai',
    label: 'OpenAI',
    description: 'Direct OpenAI chat completions API.',
    defaultModel: 'gpt-4o-mini',
    envKey: 'OPENAI_API_KEY',
    keyPlaceholder: 'sk-... your OpenAI API key',
    modelPlaceholder: 'gpt-4o-mini',
  },
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    description: 'Google AI Studio via the official OpenAI-compatible endpoint.',
    defaultModel: 'gemini-2.5-flash',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    envKey: 'GEMINI_API_KEY',
    keyPlaceholder: 'AIza... your Gemini API key',
    modelPlaceholder: 'gemini-2.5-flash',
  },
}

export const DEFAULT_PROVIDER: AIProvider = 'openai'

export function isAIProvider(value: unknown): value is AIProvider {
  return value === 'openai' || value === 'gemini'
}

export function getProviderDefinition(provider: AIProvider): ProviderDefinition {
  return PROVIDERS[provider]
}

export function getDefaultProviderConfig(): ProviderConfig {
  return {
    provider: DEFAULT_PROVIDER,
    apiKey: '',
    model: '',
  }
}

export function normalizeProviderConfig(config?: Partial<ProviderConfig>): ProviderConfig {
  const provider = isAIProvider(config?.provider) ? config.provider : DEFAULT_PROVIDER
  return {
    provider,
    apiKey: typeof config?.apiKey === 'string' ? config.apiKey : '',
    model: typeof config?.model === 'string' ? config.model : '',
  }
}

export function getResolvedModel(provider: AIProvider, override?: string): string {
  const trimmed = override?.trim()
  return trimmed || getProviderDefinition(provider).defaultModel
}
