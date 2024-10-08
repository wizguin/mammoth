import * as Data from '@vanilla/shared/data'
import { BaseHandler, Logger, policy } from '@vanilla/shared'

import PlayerRooms from '@objects/room/PlayerRooms'
import PluginLoader from '../plugin/PluginLoader'
import Room from '@objects/room/Room'
import { updateWorldPopulation } from '../World'
import type User from '@objects/user/User'

export type Rooms = Record<number, Room>

export default class Handler extends BaseHandler<User> {

    users: Record<number, User> = {}
    rooms: Rooms
    playerRooms: PlayerRooms
    plugins: PluginLoader

    constructor() {
        super()

        this.rooms = this.setRooms()
        this.playerRooms = new PlayerRooms()
        this.plugins = new PluginLoader(this)

        this.setTables()
        this.setWaddles()
    }

    get usersLength() {
        return Object.keys(this.users).length
    }

    setRooms() {
        const rooms: Record<number, Room> = {}

        for (const room of Data.rooms) {
            const { id, name, member, maxUsers, game, spawn } = room

            rooms[room.id] = new Room(id, name, member, maxUsers, game, spawn)
        }

        return rooms
    }

    setTables() {
        for (const table of Data.tables) {
            const { id, roomId, type } = table

            if (!(roomId in this.rooms)) {
                Logger.error('Could not create table', { table })
                continue
            }

            this.rooms[roomId].addTable(id, type)
        }
    }

    setWaddles() {
        for (const waddle of Data.waddles) {
            const { id, roomId, seats, gameId } = waddle

            if (!(roomId in this.rooms) || !(gameId in this.rooms)) {
                Logger.error('Could not create waddle', { waddle })
                continue
            }

            this.rooms[roomId].addWaddle(id, seats, this.rooms[gameId])
        }
    }

    emitXtEvent(action: string, user: User, args: (string | number)[]) {
        super.emitXtEvent(action, user, args)

        user.events.emit(action, user, ...args)
    }

    sendPolicyResponse(user: User) {
        user.sendXml(policy)
    }

    close(user: User) {
        Logger.info(`Closing: ${user.socket.remoteAddress}`)

        user.leaveRoom()

        this.playerRooms.closeRoom(user)

        if (user.pets) {
            user.pets.stopPetUpdate()
        }

        if (user.id && this.users[user.id] === user) {
            delete this.users[user.id]
        }

        updateWorldPopulation(this.usersLength)
    }

}
