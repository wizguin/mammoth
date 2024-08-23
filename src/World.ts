import 'dotenv/config'

import { Server, type Socket } from 'net'

import './utils/Setup'

import { host, id, port } from '@Args'
import Database from '@Database'
import Handler from './handler/Handler'
import Logger from '@Logger'
import { rateLimitEnabled } from '@Config'
import RateLimiter from './ratelimit/RateLimiter'
import Redis from './redis/Redis'
import User from '@objects/user/User'

export default class World extends Server {

    users: Record<number, User>
    handler: Handler
    rateLimiter?: RateLimiter

    constructor() {
        super()

        this.users = {}
        this.handler = new Handler(this)

        if (rateLimitEnabled) {
            this.rateLimiter = new RateLimiter()
        }

        this.on('listening', () => this.onListening())

        this.listen(port, host)
    }

    onListening() {
        this.on('connection', (socket: Socket) => this.onConnection(socket))

        Logger.success(`Listening on port ${port}`)
    }

    async onConnection(socket: Socket) {
        if (!socket.remoteAddress) {
            return
        }

        Logger.info(`New connection from: ${socket.remoteAddress}`)

        try {
            if (this.rateLimiter) {
                await this.rateLimiter.addressConnects.consume(socket.remoteAddress)
            }

            this.createUser(socket)

        } catch (res) {
            Logger.warn(`Rate limiting connection from: ${socket.remoteAddress}`, { res })

            socket.destroy()
        }
    }

    createUser(socket: Socket) {
        const user = new User(socket)

        socket.setEncoding('utf8')

        socket.on('data', (data: string) => this.onData(data, user))
        socket.on('close', () => this.handler.close(user))
        socket.on('error', error => Logger.error(error))
    }

    async onData(data: string, user: User) {
        if (!user.socket.remoteAddress) {
            return
        }

        try {
            if (this.rateLimiter) {
                await this.rateLimiter.addressEvents.consume(user.socket.remoteAddress)
                await this.rateLimiter.userEvents.consume(user.id || user.rateLimitKey)
            }

            this.handler.handle(data, user)

        } catch (res) {
            Logger.warn(`Rate limiting data from: ${user.socket.remoteAddress}`, { res })
        }
    }

}

export async function updateWorldPopulation(population: number) {
    await Redis.hSet('population', id, population)
}

(async () => {
    await Database.connect()
    await Redis.connect()

    await updateWorldPopulation(0)

    new World()
})()
