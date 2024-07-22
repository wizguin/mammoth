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

    }

    getRoomList(user: User) {

    }

    openPlayerRoom(user: User) {

    }

    closePlayerRoom(user: User) {

    }

}
