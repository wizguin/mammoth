import BasePlugin, { type Num } from '../BasePlugin'

import { handleOnce } from '@Decorators'
import type User from '@objects/user/User'

export default class Join extends BasePlugin {

    events = {
        js: this.joinServer,
        bl: this.getBuddyList,
        nl: this.getIgnoreList,
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
    getBuddyList(user: User) {
        if (user.buddies.count) {
            user.send('gb', user.buddies)
        } else {
            user.send('gb')
        }
    }

    @handleOnce
    getIgnoreList(user: User) {
        if (user.ignores.count) {
            user.send('gn', user.ignores)
        } else {
            user.send('gn')
        }
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

    joinPlayerRoom(user: User, userId: Num) {
        user.joinRoom(this.playerRooms.get(userId))
    }

}
