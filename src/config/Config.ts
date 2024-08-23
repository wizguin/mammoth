const env = process.env

export const redisUrl = env.REDIS_URL || 'redis://localhost:6379'

export const clientVersion = env.CLIENT_VERSION || '097'

export const rateLimitEnabled = env.RATELIMIT_ENABLED === 'true'

export const addressConnectsPerSecond = parseInt(env.ADDRESS_CONNECTS_PER_SECOND || '5')
export const addressEventsPerSecond = parseInt(env.ADDRESS_EVENTS_PER_SECOND || '50')
export const userEventsPerSecond = parseInt(env.USER_EVENTS_PER_SECOND || '10')

export const whitelistEnabled = env.WHITELIST_ENABLED === 'true'

export const preferredSpawn = parseInt(env.PREFERRED_SPAWN || '') || null

export const maxUsers = parseInt(env.MAX_USERS || '500')
