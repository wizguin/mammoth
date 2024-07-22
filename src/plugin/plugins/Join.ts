import BasePlugin, { type Num } from '../BasePlugin'

import { handleOnce } from '@Decorators'
import PlayerRoom from '@objects/room/PlayerRoom'
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

    joinPlayerRoom(user: User, userId: Num) {
        const playerRoom = this.getPlayerRoom(userId)

        user.joinRoom(playerRoom)
    }

    getPlayerRoom(userId: number) {
        if (userId in this.playerRooms) {
            return this.playerRooms[userId]
        }

        const playerRoom = new PlayerRoom(userId)

        this.playerRooms[userId] = playerRoom

        return playerRoom
    }

}
