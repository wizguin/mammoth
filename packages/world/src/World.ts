import { BaseServer, Database, Logger, Redis, type Socket } from '@vanilla/shared'

import './setup/Setup'

import { host, id, port } from '@Args'
import Handler from './handler/Handler'
import User from '@objects/user/User'

export default class World extends BaseServer<User> {

    handler = new Handler()

    constructor() {
        super(host, port)
    }

    createClient(socket: Socket) {
        return new User(socket)
    }

    async onData(data: string, user: User) {
        if (!user.socket.remoteAddress) {
            user.socket.destroy()
            return
        }

        try {
            if (this.rateLimiter) {
                await this.rateLimiter.addressEvents.consume(user.socket.remoteAddress)
                await this.rateLimiter.socketEvents.consume(user.socket.id)
            }

            this.handler.handle(data, user)

        } catch (res) {
            Logger.warn(`Rate limiting data from: ${user.socket.remoteAddress}`, { res })
        }
    }

    onClose(user: User) {
        this.handler.close(user)
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
