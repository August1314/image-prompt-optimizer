// Server-side safety check — runs before any LLM call
// More thorough than the client-side pre-check.

const DISALLOWED_PATTERNS: RegExp[] = [
  // Sexual / exploitative content
  /\b(child pornography|csam|cp\s*porn|underage\s*porn|kiddy\s*porn|nude\s*child)\b/i,
  /\b(incest|pedophi|pedophi|minor\s*sex|underage\s*sex|sex\s*with\s*(child|minor|underage))\b/i,
  /\b(bestiali|zoophi|beastiali|animal\s*sex|animal\s*rape)\b/i,
  /\b(revenge\s*porn|nonconsensual|deep\s*nude|nudif)\b/i,
  // Hate speech
  /\b(kill all\s+(jews|blacks|mexicans|asians|muslims|gays|trans|women|men))\b/i,
  /\b(ethnically cleanse|master race|white supremac|racial holy war|race war)\b/i,
  /\b(gas the|final solution|holocaust was good|hitler did nothing wrong)\b/i,
  // Illegal content
  /\b(how to make\s+(bombs|explosives|meth|heroin|cocaine|fentanyl|weapons))\b/i,
  /\b(manufacture\s+(meth|heroin|cocaine|fentanyl|explosives|weapons))\b/i,
  /\b(murder\s+for\s+hire|hire\s+a\s+hitman|assassinate\s+(the president|someone))\b/i,
  /\b(identity\s+theft\s+guide|steal\s+someone.*identity|credit\s+card\s+fraud\s+guide)\b/i,
  // Safety bypass attempts
  /\b(ignore (all |previous |above )?(instructions?|safety|rules|restrictions))\b/i,
  /\b(DAN mode|developer mode|jailbreak|bypass\s+(safety|filter|restriction))\b/i,
  /\b(pretend you (are|can) (not|no longer) .*(safe|filtered|restricted))\b/i,
  // CSAM-adjacent
  /\b(loli|lolicon|shotacon|cp\b|pedo\b|pedophile)\b/i,
]

interface SafetyResult {
  safe: boolean
  reason?: string
}

export function checkServerSafety(input: string): SafetyResult {
  const text = input.trim()

  if (!text) {
    return { safe: false, reason: 'Empty input is not allowed.' }
  }

  if (text.length > 5000) {
    return { safe: false, reason: 'Input exceeds maximum length of 5000 characters.' }
  }

  for (const pattern of DISALLOWED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        safe: false,
        reason:
          'We cannot process this request. Your input contains content that violates our usage policy. This includes hateful, sexual/exploitative, illegal, or safety-bypass content. Please revise your description and try again.',
      }
    }
  }

  return { safe: true }
}
