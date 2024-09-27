import Logger from '../logger/Logger'

import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

const client = createClient({ url: redisUrl })

client.on('error', error => Logger.error(error))
client.on('connect', () => Logger.success('Connected to redis'))

export default client
