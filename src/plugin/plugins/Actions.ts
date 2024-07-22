import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Actions extends BasePlugin {

    events = {
        sa: this.sendAction,
        sf: this.sendFrame,
        sp: this.sendPosition,
        sb: this.sendSnowball,
        at: this.addToy,
        rt: this.removeToy
    }

    sendAction(user: User, actionId: Num) {
        if (!user.room) return

        user.frame = 1
        user.sendRoom('sa', user.id, actionId)
    }

    sendFrame(user: User, frameId: Num) {
        if (!user.room) return

        user.frame = frameId
        user.sendRoom('sf', user.id, frameId)
    }

    sendPosition(user: User, x: Num, y: Num) {
        if (!user.room) return

        user.setPosition(x, y)
        user.sendRoom('sp', user.id, x, y)
    }

    sendSnowball(user: User, x: Num, y: Num) {
        user.sendRoom('sb', user.id, x, y)
    }

    addToy(user: User, toyId: Num, frame: Num) {
        user.sendRoom('at', user.id, toyId, frame)
    }

    removeToy(user: User) {
        user.sendRoom('rt', user.id)
    }

}
