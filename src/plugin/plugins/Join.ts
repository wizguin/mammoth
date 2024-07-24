import BasePlugin, { type Num } from '../BasePlugin'

import { handleOnce } from '@Decorators'
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
        user.joinRoom(this.rooms[100])
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

}
