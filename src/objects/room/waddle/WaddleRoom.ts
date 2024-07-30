import type { Num } from '../../../plugin/ArgTypes'
import TemporaryEvents from '@objects/user/events/TemporaryEvents'
import type User from '@objects/user/User'

export default class WaddleRoom {

    ready: (User | null)[]
    coins: number[]
    started: boolean
    events: TemporaryEvents

    constructor(
        public id: number,
        public users: User[]
    ) {
        this.ready = []
        this.coins = [20, 10, 5, 5]
        this.started = false

        this.events = new TemporaryEvents(this, {
            on: {
                zm: this.handleSendMove
            },
            once: {
                jx: this.handleJoinInstance,
                jz: this.handleJoinGame,
                zo: this.handleGameOver,
                ac: this.handleAddCoin
            }
        })

        users.forEach(user => this.init(user))
    }

    handleJoinInstance(user: User) {
        user.send('jx', this.id)
    }

    handleJoinGame(user: User) {
        if (this.ready.includes(user)) {
            return
        }

        this.ready.push(user)
        this.checkStart()
    }

    handleSendMove(user: User, playerId: Num, x: Num, y: Num, time: Num) {
        if (!this.started) {
            return
        }

        if (playerId !== this.ready.indexOf(user)) {
            return
        }

        this.send('zm', playerId, x, y, time)
    }

    async handleGameOver(user: User) {
        const coinsEarned = this.coins.shift() || 5
        const newCoins = user.coins + coinsEarned

        await user.update({ coins: newCoins })

        user.send('zo')
    }

    handleAddCoin(user: User) {
        this.remove(user)

        user.send('ac', user.coins)
    }

    init(user: User) {
        this.events.addListeners(user)

        user.leaveRoom()
        user.waddleRoom = this
    }

    remove(user: User) {
        this.events.removeListeners(user)

        // Remove from users
        this.users = this.users.filter(u => u !== user)

        const seat = this.ready.indexOf(user)

        // Remove from ready
        if (seat !== -1) {
            this.ready[seat] = null
        }

        user.waddleRoom = null

        // Check in case a user disconnects before game starts
        this.checkStart()
    }

    checkStart() {
        // Compare with non null values in case user disconnects
        if (this.users.length === this.ready.filter(Boolean).length) {
            this.start()
        }
    }

    start() {
        if (this.started) {
            return
        }

        this.started = true

        const users = this.ready as User[]
        const userStrings = users.map(u => `${u.username}|${u.color}`)

        this.send('uz', users.length, ...userStrings)
    }

    send(...args: (number | string | object)[]) {
        for (const user of this.ready) {
            if (user) {
                user.send(...args)
            }
        }
    }

}
