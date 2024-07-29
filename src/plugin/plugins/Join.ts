import BasePlugin, { type Num } from '../BasePlugin'

import { handleOnce } from '@Decorators'
import { preferredSpawn } from '@Config'
import type Room from '@objects/room/Room'
import type User from '@objects/user/User'

export default class Join extends BasePlugin {

    events = {
        js: this.joinServer,
        il: this.getItemList,
        jr: this.joinRoom,
        jp: this.joinPlayerRoom
    }

    @handleOnce
    joinServer(user: User) {
        user.send('js')

        const spawn = this.getSpawn()

        user.joinRoom(spawn)
    }

    @handleOnce
    getItemList(user: User) {
        if (user.inventory.count) {
            user.send('gi', user.inventory)
        } else {
            user.send('gi')
        }
    }

    joinRoom(user: User, roomId: Num, x: Num, y: Num) {
        user.joinRoom(this.rooms[roomId], x, y)
    }

    async joinPlayerRoom(user: User, userId: Num) {
        user.joinRoom(await this.playerRooms.get(userId))
    }

    getSpawn() {
        if (preferredSpawn && preferredSpawn in this.rooms) {
            const room = this.rooms[preferredSpawn]

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
