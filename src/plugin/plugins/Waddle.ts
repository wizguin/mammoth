import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Waddle extends BasePlugin {

    events = {
        gw: this.getWaddleList,
        jw: this.joinWaddle,
        lw: this.leaveWaddle,
        st: this.sendTeleport
    }

    getWaddleList(user: User) {
        if (!user.room) return

        const waddles = Object.values(user.room.waddles)

        if (waddles.length) {
            user.send('gw', ...waddles)
        }
    }

    joinWaddle(user: User, waddleId: Num) {
        if (!user.room || user.waddle) return

        if (!(waddleId in user.room.waddles)) return

        const waddle = user.room.waddles[waddleId]

        if (!waddle.isFull) {
            waddle.add(user)
        }
    }

    leaveWaddle(user: User) {
        if (user.waddle) {
            user.waddle.remove(user)
        }
    }

    sendTeleport(user: User, x: Num, y: Num, frame: Num) {
        if (!user.room || !user.waddle) return

        user.setPosition(x, y)
        user.frame = frame

        user.room.send('st', user.id, x, y, frame)
    }

}
