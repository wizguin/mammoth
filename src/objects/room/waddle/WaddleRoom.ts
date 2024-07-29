import type { Num } from '../../../plugin/ArgTypes'
import type User from '@objects/user/User'

export default class WaddleRoom {

    ready: (User | null)[]
    coins: number[]
    started: boolean

    constructor(
        public id: number,
        public users: User[]
    ) {
        this.ready = []
        this.coins = [20, 10, 5, 5]
        this.started = false

        this.handleJoinInstance = this.handleJoinInstance.bind(this)
        this.handleJoinGame = this.handleJoinGame.bind(this)
        this.handleSendMove = this.handleSendMove.bind(this)
        this.handleGameOver = this.handleGameOver.bind(this)
        this.handleAddCoin = this.handleAddCoin.bind(this)

        users.forEach(user => this.init(user))
    }

    addListeners(user: User) {
        user.events.once('jx', this.handleJoinInstance)
        user.events.once('jz', this.handleJoinGame)
        user.events.on('zm', this.handleSendMove)
        user.events.once('zo', this.handleGameOver)
        user.events.once('ac', this.handleAddCoin)
    }

    removeListeners(user: User) {
        user.events.off('jx', this.handleJoinInstance)
        user.events.off('jz', this.handleJoinGame)
        user.events.off('zm', this.handleSendMove)
        user.events.off('zo', this.handleGameOver)
        user.events.off('ac', this.handleAddCoin)
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
        this.addListeners(user)

        user.leaveRoom()
        user.waddleRoom = this
    }

    remove(user: User) {
        this.removeListeners(user)

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
