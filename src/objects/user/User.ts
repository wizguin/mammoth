import Database from '@Database'
import Delimiter from '../../handler/packet/Delimiter'
import Logger from '@Logger'
import type Room from '@objects/room/Room'

import InventoryCollection from '../../database/collection/collections/InventoryCollection'

import type { Socket } from 'net'

export default class User implements Partial<PrismaUser> {

    socket: Socket
    address: Socket['remoteAddress']
    room: Room | null
    x: number
    y: number

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
    inventory!: InventoryCollection

    constructor(socket: Socket) {
        this.socket = socket

        this.address = socket.remoteAddress

        this.room = null
        this.x = 0
        this.y = 0
    }

    send(...args: (number | string | object)[]) {
        this.write(makeXt(args))
    }

    sendXml(data: string) {
        this.write(data)
    }

    write(data: string) {
        Logger.debug(`Sending: ${data}`)

        this.socket.write(`${data}${Delimiter}`)
    }

    joinRoom(room: Room, x = 0, y = 0) {
        if (!room) return

        if (this.room) this.room.remove(this)

        this.x = x
        this.y = y
        this.room = room

        this.room.add(this)
    }

    async load(username: string) {
        const user = await Database.user.findFirst({
            where: {
                username: username
            },
            include: {
                inventory: true
            }
        })

        if (!user) return false

        const { inventory, ...rest } = user

        Object.assign(this, rest)

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

            Logger.debug(`Updated User: ${this.username}, Data: %O`, data)

        } catch (error) {
            if (error instanceof Error) {
                Logger.error(`Could not update User: ${this.username}, Data: %O, Error: ${error.stack}`, data)
            }
        }
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
            0,
            1,
            0
        ].join('|')
    }

}
