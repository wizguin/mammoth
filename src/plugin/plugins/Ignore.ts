import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Ignore extends BasePlugin {

    events = {
        an: this.addIgnore,
        rn: this.removeIgnore
    }

    addIgnore(user: User, ignoreId: Num) {
        if (user.ignores.includes(ignoreId)) return

        user.addIgnore(ignoreId)
    }

    removeIgnore(user: User, ignoreId: Num) {
        if (!user.ignores.includes(ignoreId)) return

        user.removeIgnore(ignoreId)
    }

}
