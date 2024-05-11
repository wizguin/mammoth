import { Server, type Socket } from 'net'

import './utils/Setup'

import Handler from './handler/Handler'
import Logger from '@Logger'
import User from '@objects/user/User'
import { worlds } from '@Config'

export default class World extends Server {

    port: number
    users: User[]
    handler: Handler

    constructor() {
        super()

        this.port = worlds[id].port
        this.users = []
        this.handler = new Handler(this)

        this.on('listening', this.onListening.bind(this))

        this.listen(this.port)
    }

    onListening() {
        this.on('connection', this.onConnection.bind(this))

        Logger.success(`Listening on port ${this.port}`)
    }

    onConnection(socket: Socket) {
        const user = new User(socket)

        this.users.push(user)

        socket.setEncoding('utf8')

        socket.on('data', (data: string) => this.handler.handle(data, user))
        socket.on('close', () => this.handler.close(user))
        socket.on('error', error => Logger.error(error))
    }

}

const id = process.argv[2]

if (id in worlds) new World()
