import { Server, type Socket } from 'net'

import './utils/Setup'

import { rateLimit, worlds } from '@Config'
import Handler from './handler/Handler'
import Logger from '@Logger'
import RateLimiter from './ratelimit/RateLimiter'
import User from '@objects/user/User'

export default class World extends Server {

    port: number
    users: User[]
    handler: Handler
    rateLimiter?: RateLimiter

    constructor() {
        super()

        this.port = worlds[id].port
        this.users = []
        this.handler = new Handler(this)

        if (rateLimit.enabled) {
            this.rateLimiter = new RateLimiter()
        }

        this.on('listening', () => this.onListening())

        this.listen(this.port)
    }

    onListening() {
        this.on('connection', (socket: Socket) => this.onConnection(socket))

        Logger.success(`Listening on port ${this.port}`)
    }

    async onConnection(socket: Socket) {
        if (!socket.remoteAddress) return

        Logger.info(`New connection from: ${socket.remoteAddress}`)

        try {
            if (this.rateLimiter) {
                await this.rateLimiter.addressConnects.consume(socket.remoteAddress)
            }

            this.createUser(socket)

        } catch (res) {
            Logger.warn(`Rate limiting connection from: ${socket.remoteAddress}, response: ${res}`)

            socket.destroy()
        }
    }

    createUser(socket: Socket) {
        const user = new User(socket)

        this.users.push(user)

        socket.setEncoding('utf8')

        socket.on('data', (data: string) => this.onData(data, user))
        socket.on('close', () => this.handler.close(user))
        socket.on('error', error => Logger.error(error))
    }

    async onData(data: string, user: User) {
        if (!user.socket.remoteAddress) return

        try {
            if (this.rateLimiter) {
                await this.rateLimiter.addressEvents.consume(user.socket.remoteAddress)
                await this.rateLimiter.userEvents.consume(user.id || user.rateLimitKey)
            }

            this.handler.handle(data, user)

        } catch (res) {
            Logger.warn(`Rate limiting data from: ${user.socket.remoteAddress}, response: ${res}`)
        }
    }

}

const id = process.argv[2]

if (id in worlds) new World()
