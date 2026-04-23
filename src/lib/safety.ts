// Client-side safety pre-check
// This is a fast first-pass filter. The server does its own check too.

const DISALLOWED_PATTERNS: RegExp[] = [
  // Explicit sexual content
  /\b(incest|pedophi|child pornography|csam|nude\s*child|underage\s*nude|underage\s*sex)\b/i,
  // Hate speech patterns
  /\b(ethnically cleanse|genocide is good|kill all\s+(jews|blacks|mexicans|asians|muslims|gays|trans|women))\b/i,
  // Illegal activity
  /\b(make|manufacture|cook|synthesize)\s+(meth|heroin|cocaine|fentanyl|bombs|explosives)\b/i,
  // CSAM-adjacent
  /\b(loli|lolicon|shotacon)\b/i,
]

interface SafetyResult {
  safe: boolean
  reason?: string
}

export function checkSafety(input: string): SafetyResult {
  const text = input.trim()

  if (!text) {
    return { safe: false, reason: 'Empty input is not allowed.' }
  }

  if (text.length > 5000) {
    return { safe: false, reason: 'Input is too long. Please keep it under 5000 characters.' }
  }

  for (const pattern of DISALLOWED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        safe: false,
        reason:
          'Your input contains content that is not allowed. Please review your description and remove any disallowed content (hateful, sexual, illegal, or exploitative themes).',
      }
    }
  }

  return { safe: true }
}
