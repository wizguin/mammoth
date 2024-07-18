import * as Data from '../data/Data'
import { delimiter, parseXml, parseXt } from './packet/Packet'
import Logger from '@Logger'
import PluginLoader from '../plugin/PluginLoader'
import Room from '@objects/room/Room'
import type User from '@objects/user/User'
import type World from '../World'

import type { Element } from 'elementtree'
import EventEmitter from 'events'

const policy = '<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>'

export default class Handler {

    users: User[]
    usersById: { [key: string]: User }
    rooms: Record<number, Room>
    events: EventEmitter
    plugins: PluginLoader

    constructor(world: World) {
        this.users = world.users

        this.usersById = {}
        this.rooms = this.setRooms()

        this.events = new EventEmitter({ captureRejections: true })
        this.plugins = new PluginLoader(this)

        this.events.on('error', error => Logger.error(error))
    }

    setRooms() {
        const rooms: Record<number, Room> = {}

        for (const room of Data.rooms) {
            rooms[room.id] = new Room(room)
        }

        return rooms
    }

    handle(data: string, user: User) {
        try {
            const packets = data.split(delimiter).filter(Boolean)

            for (const packet of packets) {
                Logger.info(`Received: ${packet}`)

                if (packet.startsWith('<')) this.handleXml(packet, user)

                if (packet.startsWith('%')) this.handleXt(packet, user)
            }

        } catch (error) {
            if (error instanceof Error) Logger.error(error.stack)
        }
    }

    handleXml(data: string, user: User) {
        const parsed = parseXml(data)

        if (!parsed) {
            Logger.warn(`Invalid XML data: ${data}`)
            return
        }

        switch (parsed.tag) {
            case 'policy-file-request':
                user.sendXml(policy)
                break

            case 'msg':
                this.handleXmlMsg(parsed, user)
                break
        }
    }

    handleXmlMsg(parsed: Element, user: User) {
        const body = parsed.find('body')

        if (!body) return

        const action = body.get('action')

        if (action) {
            this.events.emit(action, user, body)
        }
    }

    handleXt(data: string, user: User) {
        const parsed = parseXt(data)

        if (!parsed) {
            Logger.warn(`Invalid XT data: ${data}`)
            return
        }

        Logger.debug('Parsed args: %O', parsed)

        this.events.emit(parsed.action, user, ...parsed.args)
    }

    close(user: User) {
        Logger.info(`Closing: ${user.socket.remoteAddress}`)

        user.close()

        if (this.usersById[user.id] === user) {
            delete this.usersById[user.id]
        }

        this.users = this.users.filter(u => u !== user)
    }

}
