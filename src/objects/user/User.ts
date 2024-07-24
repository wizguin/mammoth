import { delimiter, makeXt } from '../../handler/packet/Packet'
import Database from '@Database'
import Logger from '@Logger'
import type Room from '@objects/room/Room'

import BuddyCollection from '../../database/collection/collections/BuddyCollection'
import IgnoreCollection from '../../database/collection/collections/IgnoreCollection'
import InventoryCollection from '../../database/collection/collections/InventoryCollection'

import type { Prisma, User as PrismaUser } from '@prisma/client'
import { nanoid } from 'nanoid'
import type { Socket } from 'net'

export default class User implements Partial<PrismaUser> {

    socket: Socket
    rateLimitKey: string

    room: Room | null
    x: number
    y: number
    frame: number

    buddyRequests: number[]

    id!: number
    username!: string
    email!: string | null
    password!: string
    loginKey!: string | null
    rank!: boolean
    permaBan!: boolean
    joinTime!: Date
    coins!: number
    head!: number
    face!: number
    neck!: number
    body!: number
    hand!: number
    feet!: number
    color!: number
    photo!: number
    flag!: number

    buddies!: BuddyCollection
    ignores!: IgnoreCollection
    inventory!: InventoryCollection

    constructor(socket: Socket) {
        this.socket = socket

        this.rateLimitKey = nanoid()

        this.room = null
        this.x = 0
        this.y = 0
        this.frame = 0

        this.buddyRequests = []
    }

    send(...args: (number | string | object)[]) {
        this.write(makeXt(args))
    }

    sendXml(data: string) {
        this.write(data)
    }

    sendRoom(...args: (number | string | object)[]) {
        if (this.room) {
            this.room.send(...args)
        }
    }

    write(data: string) {
        Logger.debug(`Sending: ${data}`)

        this.socket.write(`${data}${delimiter}`)
    }

    joinRoom(room: Room, x = 0, y = 0) {
        if (!room) return

        if (this.room) this.room.remove(this)

        this.setPosition(x, y)

        this.room = room
        this.room.add(this)
    }

    setPosition(x: number, y: number) {
        this.x = x
        this.y = y
        this.frame = 1
    }

    addBuddyRequest(userId: number, username: string) {
        if (userId === this.id) return

        if (this.buddies.includes(userId)) return

        if (this.buddyRequests.includes(userId)) return

        if (this.buddies.count < 100) {
            this.buddyRequests.push(userId)
        }

        this.send('bq', userId, username)
    }

    removeBuddyRequest(userId: number) {
        this.buddyRequests = this.buddyRequests.filter(requestId => requestId !== userId)
    }

    async addBuddy(buddyId: number) {
        this.buddies.add(buddyId)
    }

    async removeBuddy(buddyId: number) {
        this.buddies.remove(buddyId)
    }

    async load(username: string) {
        const user = await Database.user.findFirst({
            where: {
                username: username
            },
            include: {
                buddies: {
                    include: {
                        buddy: { select: { username: true } }
                    }
                },

                ignores: {
                    include: {
                        ignore: { select: { username: true } }
                    }
                },

                inventory: true
            }
        })

        if (!user) return false

        const { buddies, ignores, inventory, ...rest } = user

        Object.assign(this, rest)

        this.buddies = new BuddyCollection(this, buddies)
        this.ignores = new IgnoreCollection(this, ignores)
        this.inventory = new InventoryCollection(this, inventory)

        return true
    }

    async update(data: Prisma.UserUpdateInput) {
        try {
            await Database.user.update({
                where: {
                    id: this.id
                },
                data: data
            })

            Object.assign(this, data)

            Logger.debug(`Updated user: ${this.username}, data: %O`, data)

        } catch (error) {
            if (error instanceof Error) {
                Logger.error(`Could not update user: ${this.username}, data: %O, error: ${error.stack}`, data)
            }
        }
    }

    disconnect() {
        this.socket.destroy()
    }

    close() {
        if (this.room) this.room.remove(this)
    }

    toString() {
        return [
            this.id,
            this.username,
            this.color,
            this.head,
            this.face,
            this.neck,
            this.body,
            this.hand,
            this.feet,
            this.flag,
            this.photo,
            this.x,
            this.y,
            this.frame,
            1,
            0
        ].join('|')
    }

}
