import type { PlayerRoomFurniture } from '@prisma/client'
import type PlayerRooms from './PlayerRooms'
import Room from './Room'
import type User from '@objects/user/User'

const playerRoomIdOffset = 1000

export default class PlayerRoom extends Room {

    constructor(
        public userId: number,
        public playerRoomId: number = 1,
        public musicId: number = 0,
        public floorId: number = 0,
        public furniture: PlayerRoomFurniture[] = [],
        private playerRooms: PlayerRooms
    ) {
        super(userId + playerRoomIdOffset)
    }

    get furnitureString() {
        return this.furniture.map(({ furnitureId, x, y, rotation, frame }) =>
            [furnitureId, x, y, rotation, frame].join('|')
        ).join(',')
    }

    add(user: User) {
        if (this.furniture.length) {
            user.send('jp', this.userId, this.playerRoomId, this.furnitureString)
        } else {
            user.send('jp', this.userId, this.playerRoomId)
        }

        super.add(user)
    }

    remove(user: User) {
        super.remove(user)

        if (!this.users.length) {
            this.playerRooms.remove(this.userId)
        }
    }

}
