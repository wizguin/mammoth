import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

const maxCoins = 1000000
const defaultScoreGames = [904, 905, 906, 912, 916, 917, 918]

export default class Minigame extends BasePlugin {

    events = {
        zo: this.gameOver,
        ac: this.addCoin,
        st: this.sendTeleport
    }

    async gameOver(user: User, score: Num) {
        if (!user.room?.game) {
            return
        }

        const coinsEarned = defaultScoreGames.includes(user.room.id)
            ? score
            : Math.floor(score / 10)

        const newCoins = user.coins + coinsEarned

        await user.update({
            coins: Math.min(Math.max(0, newCoins), maxCoins)
        })

        user.send('zo')
    }

    addCoin(user: User) {
        user.send('ac', user.coins)
    }

    sendTeleport(user: User, x: Num, y: Num, frame: Num) {
        if (!user.room || !(user.table || user.waddle)) {
            return
        }

        user.setPosition(x, y)
        user.frame = frame

        user.room.send('st', user.id, x, y, frame)
    }

}
