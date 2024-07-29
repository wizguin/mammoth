import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Ball extends BasePlugin {

    events = {
        gz: this.getGame,
        zm: this.sendMove
    }

    ballX = 397
    ballY = 240

    getGame(user: User) {
        if (user.room?.name !== 'Rink') {
            return
        }

        user.send('gz', this.ballX, this.ballY)
    }

    sendMove(user: User, x: Num, y: Num) {
        if (user.room?.name !== 'Rink') {
            return
        }

        this.ballX = x
        this.ballY = y

        user.sendRoom('zm', x, y)
    }

}
