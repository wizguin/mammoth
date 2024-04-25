import config from '@config'
import IWorlds from './config/IWorlds'

import Handler from './handler/Handler'
import Logger from '@Logger'
import User from '@objects/user/User'

import { Server, Socket } from 'net'

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

        socket.on('data', (data: string) => this.onData(data, user))
        socket.on('end', () => Logger.debug('end'))
        socket.on('error', error => Logger.error(error))
    }

    onData(data: string, user: User) {
        this.handler.handle(data, user)
    }

}

const worlds: IWorlds = config.worlds
const id = process.argv[2]

if (id in worlds) new World()
