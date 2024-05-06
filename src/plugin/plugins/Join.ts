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
        user.send('gb')
    }

    @handleOnce
    getIgnoreList(user: User) {
        user.send('gn')
    }

    @handleOnce
    getItemList(user: User) {
        user.send('gi', user.inventory)
    }

    joinRoom(user: User, roomId: Num, x: Num, y: Num) {
        user.joinRoom(this.rooms[roomId], x, y)
    }

    joinPlayerRoom(user: User) {
        user.send('jp', 1, 8)
        user.send('jr', 10001)
    }

}
