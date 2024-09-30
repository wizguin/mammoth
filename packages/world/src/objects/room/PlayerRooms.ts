import { Database, Logger } from '@vanilla/shared'
import PlayerRoom from '@objects/room/PlayerRoom'
import type User from '@objects/user/User'

export default class PlayerRooms {

    private rooms: Record<number, PlayerRoom>
    private _openRooms: User[]

    constructor() {
        this.rooms = {}
        this._openRooms = []
    }

    get openRooms() {
        return this._openRooms.map(user =>
            `${user.id}|${user.username}`
        ).join('%')
    }

    async add(userId: number) {
        Logger.debug(`Create player room: ${userId}`)

        const room = await this.findRoom(userId)
        const furniture = await this.findFurniture(userId)

        return this.rooms[userId] = new PlayerRoom(
            userId,
            room?.roomId,
            room?.musicId,
            room?.floorId,
            furniture,
            this
        )
    }

    remove(userId: number) {
        if (userId in this.rooms) {
            Logger.debug(`Remove player room: ${userId}`)

            delete this.rooms[userId]
        }
    }

    async get(userId: number) {
        if (userId in this.rooms) {
            return this.rooms[userId]
        }

        return this.add(userId)
    }

    includes(userId: number) {
        return userId in this.rooms
    }

    async findRoom(userId: number) {
        return Database.playerRoom.findFirst({
            where: { userId }
        })
    }

    async findFurniture(userId: number) {
        return Database.playerRoomFurniture.findMany({
            where: { userId }
        })
    }

    openRoom(user: User) {
        if (!this._openRooms.includes(user)) {
            this._openRooms.push(user)
        }
    }

    closeRoom(user: User) {
        this._openRooms = this._openRooms.filter(u => u !== user)
    }

}
