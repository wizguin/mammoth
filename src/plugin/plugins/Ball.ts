import BasePlugin, { type Num } from '../BasePlugin'

import { inRoom } from '@Decorators'
import type User from '@objects/user/User'

export default class Ball extends BasePlugin {

    events = {
        gz: this.getGame,
        zm: this.sendMove
    }

    ballX = 397
    ballY = 240

    @inRoom('rink')
    getGame(user: User) {
        user.send('gz', this.ballX, this.ballY)
    }

    @inRoom('rink')
    sendMove(user: User, x: Num, y: Num) {
        this.ballX = x
        this.ballY = y

        user.sendRoom('zm', x, y)
    }

}
