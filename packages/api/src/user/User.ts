import { dateString, maxDate, titleCase } from '../utils/Utils'
import Database from '../database/Database'
import Errors from '../errors/Errors'

import { compare, hash } from 'bcrypt'
import type { Prisma } from '@prisma/client'

export type User = Exclude<Prisma.PromiseReturnType<typeof getUser>, null>

export interface CreateUser {
    username: string,
    email: string,
    password: string,
    color: number,
    safeMode: number,
    parentPassword?: string,
    parentHint?: string
}

export async function getUserByUsername(username: string) {
    if (!username) {
        return null
    }

    return getUser({ username })
}

export async function getUserById(id: number) {
    if (!id) {
        return null
    }

    return getUser({ id })
}

export async function checkUserExists(username: string) {
    const user = await getUserByUsername(username)

    return user !== null
}

async function getUser(where: Prisma.UserWhereUniqueInput) {
    return Database.user.findUnique({
        where: where,
        include: {
            bans: true,
            memberships: true,
            parentPassword: true,
            pets: true
        }
    })
}

export async function createUser(data: CreateUser) {
    const passwordHash = await hash(data.password, 10)

    const user = await Database.user.create({
        data: {
            username: titleCase(data.username),
            email: data.email,
            password: passwordHash,
            color: data.color,
            safeMode: data.safeMode
        }
    })

    if (data.safeMode && data.parentPassword) {
        const parentPasswordHash = await hash(data.parentPassword, 10)

        await Database.parentPassword.create({
            data: {
                userId: user.id,
                password: parentPasswordHash,
                hint: data.parentHint
            }
        })
    }

    await Database.inventory.create({
        data: {
            userId: user.id,
            itemId: data.color
        }
    })

    await Database.playerRoom.create({
        data: {
            userId: user.id
        }
    })

    const end = new Date()

    renewDate(end)

    await Database.membership.create({
        data: {
            userId: user.id,
            end: end,
            autoRenew: true
        }
    })
}

export async function authenticateUser(username: string, password: string, checkBan = false) {
    const user = await getUserByUsername(username)

    if (!user) {
        return { error: Errors.UserNotFound }
    }

    const ban = checkBan ? getBan(user) : false

    if (ban) {
        return { error: ban.error, message: ban.message }
    }

    const match = await compare(password, user.password)

    if (!match) {
        return { error: Errors.IncorrectPassword }
    }

    await renewMemberships(user)

    return { user }
}

function getBan(user: User) {
    if (user.bans.length > 3 || user.bans.some(b => !b.end)) {
        return { error: Errors.BannedForever }
    }

    const now = new Date()
    const activeBans = user.bans.filter(b => b.end && b.end > now)

    if (!activeBans.length) {
        return false
    }

    const latestBan = maxDate(activeBans.map(b => b.end as Date))
    const message = dateString(latestBan)

    return { error: Errors.Banned, message: message }
}

async function renewMemberships(user: User) {
    const now = new Date()

    const autoRenewMemberships = user.memberships.filter(m =>
        !m.expired && m.autoRenew && m.end <= now
    )

    for (const membership of autoRenewMemberships) {
        const newEnd = new Date(membership.end)

        while (newEnd <= now) {
            renewDate(newEnd)
        }

        await Database.membership.update({
            where: {
                id: membership.id
            },
            data: {
                end: newEnd
            }
        })

        membership.end = newEnd
    }
}

function renewDate(date: Date) {
    const originalDay = date.getDate()

    date.setMonth(date.getMonth() + 1)

    // Adjust to the last day of the previous month if the day overflowed
    if (date.getDate() < originalDay) {
        date.setDate(0)
    }
}

export function getExpiryDate(user: User) {
    if (!user.memberships.length) {
        return ''
    }

    const isAutoRenew = user.memberships.some(m => !m.expired && m.autoRenew)

    if (isAutoRenew) {
        return '10000-1-1'
    }

    const latestMembership = maxDate(user.memberships.map(m => m.end))

    return dateString(latestMembership)
}

export function getParentHint(user: User) {
    return user.parentPassword
        ? user.parentPassword.hint || 'No hint given'
        : ''
}

export function getCrumb(user: User) {
    const x = 0
    const y = 0
    const frame = 0

    const isActiveMembership = user.memberships.some(m => !m.expired)
    const member = isActiveMembership ? 1 : 0

    return [
        user.id,
        user.username,
        user.color,
        user.head,
        user.face,
        user.neck,
        user.body,
        user.hand,
        user.feet,
        user.flag,
        user.photo,
        x,
        y,
        frame,
        member
    ].join('|')
}
