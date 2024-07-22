import Logger from '@Logger'
import PlayerRoom from '@objects/room/PlayerRoom'
import type User from '@objects/user/User'

export default class PlayerRooms {

    rooms: Record<number, PlayerRoom>
    openRooms: User[]

    constructor() {
        this.rooms = {}
        this.openRooms = []
    }

    add(userId: number) {
        Logger.debug(`Create player room: ${userId}`)

        return this.rooms[userId] = new PlayerRoom(userId, this)
    }

    remove(userId: number) {
        if (userId in this.rooms) {
            Logger.debug(`Remove player room: ${userId}`)

            delete this.rooms[userId]
        }
    }

    get(userId: number) {
        if (userId in this.rooms) {
            return this.rooms[userId]
        }

        return this.add(userId)
    }

}
