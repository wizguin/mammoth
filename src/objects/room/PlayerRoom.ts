import type PlayerRooms from './PlayerRooms'
import Room from './Room'
import type User from '@objects/user/User'

const playerRoomIdOffset = 1000

export default class PlayerRoom extends Room {

    userId: number
    playerRooms: PlayerRooms

    constructor(userId: number, playerRooms: PlayerRooms) {
        super(userId + playerRoomIdOffset)

        this.userId = userId
        this.playerRooms = playerRooms
    }

    add(user: User) {
        user.send('jp', this.userId, 1)

        super.add(user)
    }

    remove(user: User) {
        super.remove(user)

        if (!this.users.length) {
            this.playerRooms.remove(this.userId)
        }
    }

}
