import { type AddressInfo, Server as NetServer, type Socket as NetSocket } from 'net'

import Logger from '../logger/Logger'
import RateLimiter from './ratelimit/RateLimiter'

const rateLimitEnabled = process.env.RATELIMIT_ENABLED === 'true'

export type Socket = NetSocket & {
    id: number
}

export default abstract class BaseServer<Client> extends NetServer {

    socketIdCounter = 0
    rateLimiter?: RateLimiter

    constructor(host: string, port: number) {
        super()

        if (rateLimitEnabled) {
            this.rateLimiter = new RateLimiter()
        }

        this.on('listening', () => this.onListening())

        this.listen(port, host)
    }

    onListening() {
        this.on('connection', (socket: Socket) => this.onConnection(socket))

        const { port } = this.address() as AddressInfo

        Logger.success(`Listening on port ${port}`)
    }

    async onConnection(socket: Socket) {
        if (!socket.remoteAddress) {
            socket.destroy()
            return
        }

        Logger.info(`New connection from: ${socket.remoteAddress}`)

        try {
            if (this.rateLimiter) {
                await this.rateLimiter.addressConnects.consume(socket.remoteAddress)
            }

            this.initSocket(socket)

        } catch (res) {
            Logger.warn(`Rate limiting connection from: ${socket.remoteAddress}`, { res })

            socket.destroy()
        }
    }

    initSocket(socket: Socket) {
        socket.setEncoding('utf8')
        socket.id = ++this.socketIdCounter

        this.addSocketEvents(socket)
    }

    addSocketEvents(socket: Socket) {
        const client = this.createClient(socket)

        socket.on('data', (data: string) => this.onData(data, client))
        socket.on('close', () => this.onClose(client))
        socket.on('error', error => Logger.error(error))
    }

    createClient(socket: Socket) {
        return socket as Client
    }

    abstract onData(data: string, client: Client): void

    abstract onClose(client: Client): void

}
