import type { Num } from '../../../plugin/ArgTypes'
import type User from '@objects/user/User'

export default class WaddleRoom {

    users: (User | null)[]
    coins: number[]
    started: boolean

    constructor(
        public id: number,
        public pendingUsers: User[]
    ) {
        this.users = []
        this.coins = [20, 10, 5, 5]
        this.started = false

        this.handleJoinInstance = this.handleJoinInstance.bind(this)
        this.handleJoinGame = this.handleJoinGame.bind(this)
        this.handleSendMove = this.handleSendMove.bind(this)

        pendingUsers.forEach(user => this.init(user))
    }

    addListeners(user: User) {
        user.events.once('jx', this.handleJoinInstance)
        user.events.once('jz', this.handleJoinGame)
        user.events.on('zm', this.handleSendMove)
    }

    removeListeners(user: User) {
        user.events.off('jx', this.handleJoinInstance)
        user.events.off('jz', this.handleJoinGame)
        user.events.off('zm', this.handleSendMove)
    }

    handleJoinInstance(user: User) {
        user.send('jx', this.id)
    }

    handleJoinGame(user: User) {
        if (this.users.includes(user)) return

        this.users.push(user)
        this.checkStart()
    }

    handleSendMove(user: User, playerId: Num, x: Num, y: Num, time: Num) {
        if (!this.started) return

        if (playerId !== this.users.indexOf(user)) return

        this.send('zm', playerId, x, y, time)
    }

    init(user: User) {
        this.addListeners(user)

        user.leaveRoom()
        user.waddleRoom = this
    }

    remove(user: User) {
        this.removeListeners(user)

        // Remove from pending users
        this.pendingUsers = this.pendingUsers.filter(u => u !== user)

        const seat = this.users.indexOf(user)

        // Remove from users
        if (seat !== -1) this.users[seat] = null

        user.waddleRoom = null

        // Check in case a user disconnects before game starts
        this.checkStart()
    }

    checkStart() {
        // Compare with non null values in case user disconnects
        if (this.pendingUsers.length === this.users.filter(Boolean).length) {
            this.start()
        }
    }

    start() {
        if (this.started) return

        this.started = true

        const users = this.users as User[]
        const userStrings = users.map(u => `${u.username}|${u.color}`)

        this.send('uz', users.length, ...userStrings)
    }

    send(...args: (number | string | object)[]) {
        for (const user of this.users) {
            if (user) user.send(...args)
        }
    }

}
