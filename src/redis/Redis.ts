import Logger from '@Logger'
import { redisUrl } from '@Config'

import { createClient } from 'redis'

const client = createClient({ url: redisUrl })

client.on('error', error => Logger.error(error))
client.on('connect', () => Logger.success('Connected to redis'))

export default client
