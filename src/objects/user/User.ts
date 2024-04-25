import Database from '@Database'
import Delimiter from '../../handler/packet/Delimiter'
import Logger from '@Logger'
import { makeXt } from '../../handler/packet/Packet'

import type { Prisma, User as PrismaUser } from '@prisma/client'
import type Room from '@objects/room/Room'
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
    inventory!: { itemId: number }[]

    constructor(socket: Socket) {
        this.socket = socket

        this.address = socket.remoteAddress

        this.room = null
        this.x = 0
        this.y = 0
    }

    send(...args: (number | string)[]) {
        this.write(makeXt(args))
    }

    sendXml(data: string) {
        this.write(data)
    }

    write(data: string) {
        Logger.debug(`Sending: ${data}`)

        this.socket.write(`${data}${Delimiter}`)
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

        Object.assign(this, user)

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

    get string() {
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
