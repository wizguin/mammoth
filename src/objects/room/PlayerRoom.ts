import Database from '@Database'
import type PlayerRooms from './PlayerRooms'
import Room from './Room'
import type User from '@objects/user/User'

interface Furniture {
    userId: number,
    furnitureId: number,
    x: number,
    y: number,
    rotation: number,
    frame: number
}

const playerRoomIdOffset = 1000

export default class PlayerRoom extends Room {

    constructor(
        public userId: number,
        public roomId: number = 1,
        public musicId: number = 0,
        public floorId: number = 0,
        public furniture: Furniture[] = [],
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
            // Add , because 2006 client shifts first element
            user.send('jp', this.userId, this.roomId, `,${this.furnitureString}`)

        } else {
            user.send('jp', this.userId, this.roomId)
        }

        super.add(user)
    }

    remove(user: User) {
        super.remove(user)

        if (!this.users.length) {
            this.playerRooms.remove(this.userId)
        }
    }

    addFurniture(furniture: Furniture) {
        this.furniture.push(furniture)
    }

    async clearFurniture() {
        await Database.playerRoomFurniture.deleteMany({
            where: { userId: this.userId }
        })

        this.furniture = []
    }

}
