import BasePlugin from '../BasePlugin'

import type User from '@objects/user/User'

export default class PlayerRoom extends BasePlugin {

    events = {
        gm: this.getPlayerRoom,
        g: this.getPets,
        gf: this.getFurnitureList,
        gr: this.getRoomList,
        or: this.openPlayerRoom,
        cr: this.closePlayerRoom
    }

    getPlayerRoom(user: User) {

    }

    getPets(user: User) {

    }

    getFurnitureList(user: User) {
        if (user.furniture.count) {
            user.send('gf', user.furniture)
        } else {
            user.send('gf')
        }
    }

    getRoomList(user: User) {
        user.send('gr', this.playerRooms.openRooms)
    }

    openPlayerRoom(user: User) {
        this.playerRooms.openRoom(user)
    }

    closePlayerRoom(user: User) {
        this.playerRooms.closeRoom(user)
    }

}
