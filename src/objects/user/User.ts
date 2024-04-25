import Database from '@Database'
import Delimiter from '../../handler/packet/Delimiter'
import Logger from '@Logger'
import { makeXt } from '../../handler/packet/Packet'

import type { Prisma, User as PrismaUser } from '@prisma/client'
import type { Socket } from 'net'


export default class User implements PrismaUser {

    socket: Socket
    address: Socket['remoteAddress']

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
        await Database.user.update({
            where: {
                id: this.id
            },
            data: data
        })
    }

}
