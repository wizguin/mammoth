import type Room from '../Room'
import TemporaryEvents from '@objects/user/events/TemporaryEvents'
import type User from '@objects/user/User'

export default abstract class BaseTable {

    users: User[]
    started: boolean
    currentTurn: number
    events: TemporaryEvents

    constructor(
        public id: number,
        public room: Room
    ) {
        this.users = []
        this.started = false
        this.currentTurn = 0

        this.events = new TemporaryEvents(this, {
            once: {
                gz: this.handleGetGame,
                jz: this.handleJoinGame,
                lz: this.handleLeaveGame,
                lt: this.handleLeaveTable
            }
        })
    }

    get playingUsers() {
        return this.users.slice(0, 2)
    }

    isPlayingUser(user: User) {
        return this.playingUsers.includes(user)
    }

    abstract gameString: string

    handleGetGame(user: User) {
        user.send('gz', this.gameString)
    }

    handleJoinGame(user: User) {
        if (this.started) {
            return
        }

        const seat = this.users.indexOf(user)

        user.send('jz', seat)
        this.send('uz', seat, user.username)

        if (this.users.length === 2) {
            this.started = true

            this.send('sz', this.currentTurn)
        }
    }

    handleLeaveGame(user: User) {
        user.send('lz')
    }

    handleLeaveTable(user: User) {
        if (this.started && this.isPlayingUser(user)) {
            this.reset(user)

        } else {
            this.remove(user)
        }
    }

    add(user: User) {
        this.events.addListeners(user)

        this.users.push(user)
        user.table = this

        const seat = this.users.length

        user.send('jt', this.id, seat)
        this.room.send('ut', this.id, seat)
    }

    remove(user: User) {
        this.events.removeListeners(user)

        this.users = this.users.filter(u => u !== user)

        user.table = null
    }

    reset(quittingUser: User) {
        this.send('cz', quittingUser.username)

        for (const user of this.users) {
            this.remove(user)
        }

        this.started = false
        this.currentTurn = 0

        this.room.send('ut', this.id, this.users.length)
    }

    toString() {
        return `${this.id}|${this.playingUsers.length}`
    }

    send(...args: (number | string | object)[]) {
        this.users.forEach(user => user.send(...args))
    }

}
