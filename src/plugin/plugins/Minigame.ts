import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

const maxCoins = 1000000

export default class Minigame extends BasePlugin {

    events = {
        zo: this.gameOver,
        ac: this.addCoin
    }

    async gameOver(user: User, score: Num) {
        if (!user.room?.game) return

        const coinsEarned = Math.floor(score / 10)
        const newCoins = user.coins + coinsEarned

        await user.update({
            coins: Math.min(Math.max(0, newCoins), maxCoins)
        })

        user.send('zo')
    }

    addCoin(user: User) {
        if (!user.room?.game) return

        user.send('ac', user.coins)
    }

}
