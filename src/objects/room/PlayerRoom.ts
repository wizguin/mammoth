import Room from './Room'
import type User from '@objects/user/User'

const playerRoomIdOffset = 1000

export default class PlayerRoom extends Room {

    userId: number

    constructor(userId: number) {
        const playerRoomId = userId + playerRoomIdOffset

        super(playerRoomId)

        this.userId = userId
    }

    add(user: User) {
        user.send('jp', this.userId, 1)

        super.add(user)
    }

}
