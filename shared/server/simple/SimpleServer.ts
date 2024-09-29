import BaseServer, { type Socket } from '../BaseServer'

import Logger from '../../logger/Logger'
import SimpleHandler from './SimpleHandler'

type EventHandler = (socket: Socket, ...args: any) => void | Promise<void>

export default class SimpleServer extends BaseServer<Socket> {

    handler = new SimpleHandler()

    constructor(host: string, port: number) {
        super(host, port)
    }

    async onData(data: string, socket: Socket) {
        if (!socket.remoteAddress) {
            socket.destroy()
            return
        }

        try {
            if (this.rateLimiter) {
                await this.rateLimiter.addressEvents.consume(socket.remoteAddress)
                await this.rateLimiter.socketEvents.consume(socket.id)
            }

            this.handler.handle(data, socket)

        } catch (res) {
            Logger.warn(`Rate limiting data from: ${socket.remoteAddress}`, { res })
        }
    }

    onClose(socket: Socket) {
        Logger.info(`Closing: ${socket.remoteAddress}`)
    }

    addEvent(eventName: string, eventHandler: EventHandler) {
        this.handler.events.on(eventName, eventHandler)
    }

    write(socket: Socket, data: string) {
        this.handler.write(socket, data)
    }

}
