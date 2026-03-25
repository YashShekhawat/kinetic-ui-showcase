// Shared module-level cache for pro status — kept separate to avoid
// circular imports between AuthContext ↔ usePro.
export const proCache = {
  status: null as { isPro: boolean; isActive: boolean } | null,
  userId: null as string | null,
}

export function clearProStatusCache() {
  proCache.status = null
  proCache.userId = null
}
