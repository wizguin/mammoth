import BasePlugin, { type Num, type NumArray } from '../BasePlugin'

import { handleOnce } from '@Decorators'
import { isVersion130 } from '@Data'
import type User from '@objects/user/User'

const il = isVersion130 ? 'gi' : 'il'

export default class Item extends BasePlugin {

    events = {
        [il]: this.getItemList,
        ai: this.addItem,
        up: this.updatePlayer,
        spy: this.addSpyPhone
    }

    @handleOnce
    getItemList(user: User) {
        if (user.inventory.count) {
            user.send('gi', user.inventory)
        } else {
            user.send('gi')
        }
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
