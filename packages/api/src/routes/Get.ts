import { getCrumb, getUserById } from '../user/User'
import { buildResponse } from '../response/Response'
import { Logger } from '@vanilla/shared'

import type { FastifyInstance } from 'fastify'

export default async function(app: FastifyInstance) {
    app.post<{
        Body: {
            PlayerId: string
        }

    }>('/gp.php', async (request, reply) => {
        try {
            const { PlayerId } = request.body

            const user = await getUserById(parseInt(PlayerId))

            if (!user) {
                reply.callNotFound()
                return
            }

            reply.send(buildResponse({ crumb: getCrumb(user) }))

        } catch (error) {
            Logger.error(error)

            reply.callNotFound()
        }
    })
}
