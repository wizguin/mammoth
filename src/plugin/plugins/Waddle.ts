import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Waddle extends BasePlugin {

    events = {
        gw: this.getWaddleList
    }

    getWaddleList(user: User) {
        if (!user.room) return

        const waddles = Object.values(user.room.waddles)

        if (!waddles.length) return

        user.send('gw', ...waddles)
    }

}
