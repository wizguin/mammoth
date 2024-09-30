import { authenticateUser, getCrumb, getExpiryDate, getParentHint, type User } from '../user/User'
import { buildError, buildResponse } from '../response/Response'
import { Database, Logger, Redis } from '@vanilla/shared'
import { dateString } from '../utils/Utils'
import Errors from '../errors/Errors'

import type { FastifyInstance } from 'fastify'
import { hash } from 'bcrypt'
import { randomBytes } from 'crypto'

enum Alerts {
    MembershipExpired = 100,
    RunAway = 200
}

export default async function(app: FastifyInstance) {
    app.post<{
        Body: {
            Username: string,
            Password: string
        }

    }>('/login.php', async (request, reply) => {
        try {
            const { Username, Password } = request.body

            const { user, error, message } = await authenticateUser(Username, Password, true)

            if (error) {
                reply.send(buildError(error, message))
                return
            }

            const loginKey = await setLoginKey(user)

            reply.send(await getResponse(user, loginKey))

        } catch (error) {
            Logger.error(error)

            reply.send(buildError(Errors.UserNotFound))
        }
    })
}

async function setLoginKey(user: User) {
    const loginKey = randomBytes(16).toString('hex')
    const loginKeyHash = await hash(loginKey, 10)

    await Redis.set(`${user.id}:loginkey`, loginKeyHash, {
        // 10 minutes
        EX: 600
    })

    return loginKey
}

async function getResponse(user: User, loginKey: string) {
    const joinDate = dateString(user.joinDate)
    const expiryDate = getExpiryDate(user)
    const hint = getParentHint(user)
    const worlds = await getWorldPopulations()
    const messages = await getMessages(user)

    const crumb = getCrumb(user)

    return buildResponse({
        crumb: crumb,
        k1: loginKey,
        c: user.coins,
        s: user.safeMode,
        jd: joinDate,
        ed: expiryDate,
        h: hint,
        w: worlds,
        m: messages
    })
}

async function getWorldPopulations() {
    const worlds = await Redis.hGetAll('population')

    return Object.entries(worlds)
        .map(([id, population]) => [id, population].join('|'))
        .join(',')
}

async function getMessages(user: User) {
    const membershipMessages = await checkMemberships(user)
    const petMessages = await checkPets(user)

    return [...membershipMessages, ...petMessages].join(',')
}

async function checkMemberships(user: User) {
    const now = new Date()

    const toExpire = user.memberships.filter(m =>
        !m.expired && !m.autoRenew && m.end < now
    )

    for (const membership of toExpire) {
        await Database.membership.update({
            where: {
                id: membership.id
            },
            data: {
                expired: true
            }
        })

        membership.expired = true
    }

    return toExpire.length ? [Alerts.MembershipExpired] : []
}

async function checkPets(user: User) {
    const deadPets = user.pets.filter(pet =>
        pet.health === 0 && pet.hunger === 0 && pet.rest === 0
    )

    for (const pet of deadPets) {
        await Database.pet.delete({
            where: {
                id: pet.id
            }
        })
    }

    return deadPets.map(pet =>
        [Alerts.RunAway, pet.name, pet.typeId].join('|')
    )
}
