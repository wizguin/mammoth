import { Database } from '@vanilla/shared'
import { music } from '@vanilla/shared/data'
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

export function getFurnitureString(furniture: Furniture[]) {
    return furniture
        .map(f => [f.furnitureId, f.x, f.y, f.rotation, f.frame].join('|'))
        .join(',')
}

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
        // 097 client shifts first element
        return `,${getFurnitureString(this.furniture)}`
    }

    add(user: User) {
        const props: (number | string)[] = [this.userId, this.roomId]

        if (this.musicId && music.includes(this.musicId)) {
            props.push(this.musicId)
        }

        if (this.furniture.length) {
            props.push(this.furnitureString)
        }

        user.send('jp', ...props)

        super.add(user)
    }

    remove(user: User) {
        super.remove(user)

        if (!this.users.length) {
            this.playerRooms.remove(this.userId)
        }
    }

    async setFurniture(furniture: Furniture[]) {
        await this.clearFurniture()

        await Database.playerRoomFurniture.createMany({
            data: furniture
        })

        this.furniture = furniture
    }

    async clearFurniture() {
        await Database.playerRoomFurniture.deleteMany({
            where: { userId: this.userId }
        })

        this.furniture = []
    }

    async setRoom(roomId: number) {
        await Database.playerRoom.update({
            data: { roomId },
            where: { userId: this.userId }
        })

        this.roomId = roomId

        await this.clearFurniture()
    }

    async setMusic(musicId: number) {
        if (music.includes(musicId)) {
            await Database.playerRoom.update({
                data: { musicId },
                where: { userId: this.userId }
            })

            this.musicId = musicId
        }
    }

}
