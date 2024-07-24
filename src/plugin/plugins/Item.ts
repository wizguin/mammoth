import BasePlugin, { type Num, type NumArray } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Item extends BasePlugin {

    events = {
        ai: this.addItem,
        up: this.updatePlayer
    }

    addItem(user: User, itemId: Num) {
        user.addItem(itemId)
    }

    updatePlayer(user: User, ...items: NumArray) {
        user.updatePlayer(items)
    }

}
