import * as schema from '../schema/JoinSchema'
import { authenticateUser, getExpiryDate, getParentHint, type User } from '../user/User'
import { buildError, buildResponse } from '../response/Response'
import Database from '@Database'
import { dateString } from '../utils/Utils'
import Errors from '../errors/Errors'
import Logger from '@Logger'

import { compare, hash } from 'bcrypt'
import type { FastifyInstance, FastifyReply } from 'fastify'

enum Actions {
    Login = 'Login',
    Cancel = 'Cancel',
    Password = 'Password',
    IsSafeMode = 'IsSafeMode'
}

type Credentials = {
    Username: string,
    Password: string
}

type LoginBody = Credentials & {
    Action: Actions.Login
}

type CancelBody = Credentials & {
    Action: Actions.Cancel
}

type PasswordBody = Credentials & {
    Action: Actions.Password,
    Email: string,
    NewPassword: string
}

type IsSafeModeBody = Credentials & {
    Action: Actions.IsSafeMode,
    ParentPassword: string,
    IsSafeMode: string
}

type Body = LoginBody | CancelBody | PasswordBody | IsSafeModeBody

export default async function(app: FastifyInstance) {
    app.post<{
        Body: Body

    }>('/edit.php', async (request, reply) => {
        try {
            const { Action, ...body } = request.body

            const { user, error } = await authenticateUser(body.Username, body.Password)

            if (error) {
                reply.send(buildError(error))
                return
            }

            switch (Action) {
                case Actions.Login:
                    await handleLogin(reply, user)
                    break

                case Actions.Cancel:
                    await handleCancel(reply, user)
                    break

                case Actions.Password:
                    await handlePassword(reply, body as PasswordBody, user)
                    break

                case Actions.IsSafeMode:
                    await handleIsSafeMode(reply, body as IsSafeModeBody, user)
                    break

                default:
                    break
            }

        } catch (error) {
            Logger.error(error)

            reply.callNotFound()
        }
    })
}

async function handleLogin(reply: FastifyReply, user: User) {
    reply.send(buildResponse({
        IsMember: 1,
        IsSafeMode: user.safeMode,
        ExpiryDate: 86400,
        JoinDate: dateString(user.joinDate),
        ParentHint: getParentHint(user)
    }))
}

async function handleCancel(reply: FastifyReply, user: User) {
    const autoRenewMemberships = user.memberships.filter(m => m.autoRenew)

    for (const membership of autoRenewMemberships) {
        await Database.membership.update({
            where: {
                id: membership.id
            },
            data: {
                autoRenew: false
            }
        })

        membership.autoRenew = false
    }

    reply.send(buildResponse({
        e: 0,
        ExpiryDate: getExpiryDate(user)
    }))
}

async function handlePassword(reply: FastifyReply, body: PasswordBody, user: User) {
    if (body.Email !== user.email) {
        reply.send(buildError(Errors.IncorrectEmail))
        return
    }

    const password = schema.password.validate(body.NewPassword)

    if (password.error) {
        reply.send(buildError(Errors.IncorrectPassword))
        return
    }

    const passwordHash = await hash(password.value, 10)

    await Database.user.update({
        where: {
            id: user.id
        },
        data: {
            password: passwordHash
        }
    })

    reply.send(buildError(0))
}

async function handleIsSafeMode(reply: FastifyReply, body: IsSafeModeBody, user: User) {
    const safeMode = schema.safeMode.validate(body.IsSafeMode)

    if (safeMode.error) {
        reply.send(buildError(Errors.IncorrectPassword))
        return
    }

    if (safeMode.value === 0 && user.parentPassword) {
        const match = await compare(body.ParentPassword, user.parentPassword.password)

        if (!match) {
            reply.send(buildError(Errors.IncorrectParentPassword))
            return
        }
    }

    await Database.user.update({
        where: {
            id: user.id
        },
        data: {
            safeMode: safeMode.value
        }
    })

    reply.send(buildError(0))
}
