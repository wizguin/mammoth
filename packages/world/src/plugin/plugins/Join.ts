import BasePlugin, { type Num } from '../BasePlugin'

import { consts } from '@mammoth/shared/data'
import { handleOnce } from '@Decorators'
import type Room from '@objects/room/Room'
import type User from '@objects/user/User'

export default class Join extends BasePlugin {

    events = {
        js: this.joinServer,
        jr: this.joinRoom,
        jp: this.joinPlayerRoom
    }

    @handleOnce
    joinServer(user: User) {
        user.send('js')

        const spawn = this.getSpawn()

        user.joinRoom(spawn)
    }

    joinRoom(user: User, roomId: Num, x: Num, y: Num) {
        user.joinRoom(this.rooms[roomId], x, y)
    }

    async joinPlayerRoom(user: User, userId: Num) {
        user.joinRoom(await this.playerRooms.get(userId))
    }

    getSpawn() {
        if (consts.preferredSpawn && consts.preferredSpawn in this.rooms) {
            const room = this.rooms[consts.preferredSpawn]

            if (!room.isFull) {
                return room
            }
        }

        let spawns = this.getSpawns(room => room.spawn && !room.isFull)

        if (!spawns.length) {
            spawns = this.getSpawns(room => !room.game && !room.isFull)
        }

        return spawns[Math.floor(Math.random() * spawns.length)]
    }

    getSpawns(filter: (room: Room) => boolean) {
        return Object.values(this.rooms).filter(filter)
    }

}
