const env = process.env

export const maxUsers = parseInt(env.MAX_USERS || '500')
export const preferredSpawn = parseInt(env.PREFERRED_SPAWN || '') || null
export const whitelistEnabled = env.WHITELIST_ENABLED === 'true'
