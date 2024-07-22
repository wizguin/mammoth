import Logger from '@Logger'
import type { PlayerRooms } from '../../handler/Handler'
import Room from './Room'
import type User from '@objects/user/User'

const playerRoomIdOffset = 1000

export default class PlayerRoom extends Room {

    userId: number
    playerRooms: PlayerRooms

    constructor(userId: number, playerRooms: PlayerRooms) {
        super(userId + playerRoomIdOffset)

        Logger.debug(`Create player room: ${this.id}`)

        this.userId = userId
        this.playerRooms = playerRooms

        playerRooms[userId] = this
    }

    add(user: User) {
        user.send('jp', this.userId, 1)

        super.add(user)
    }

    remove(user: User) {
        super.remove(user)

        if (!this.users.length) {
            Logger.debug(`Destroy player room: ${this.id}`)

            delete this.playerRooms[this.userId]
        }
    }

}
