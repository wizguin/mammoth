const env = process.env

export const redisUrl = env.REDIS_URL || 'redis://localhost:6379'
export const whitelistEnabled = env.WHITELIST_ENABLED === 'true'
export const preferredSpawn = parseInt(env.PREFERRED_SPAWN || '') || null
export const maxUsers = parseInt(env.MAX_USERS || '500')
