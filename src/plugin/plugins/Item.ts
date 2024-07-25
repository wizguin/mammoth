import BasePlugin, { type Num, type NumArray } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Item extends BasePlugin {

    events = {
        ai: this.addItem,
        up: this.updatePlayer,
        spy: this.addSpyPhone
    }

    addItem(user: User, itemId: Num) {
        user.addItem(itemId)
    }

    updatePlayer(user: User, ...items: NumArray<9>) {
        user.updatePlayer(items)
    }

    addSpyPhone(user: User) {
        user.addItem(800)
    }

}
