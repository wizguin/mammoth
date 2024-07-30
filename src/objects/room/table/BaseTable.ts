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
        this.currentTurn = 1

        this.events = new TemporaryEvents(this, {
            once: {
                'gz': this.handleGetGame
            }
        })
    }

    get playingUsers() {
        return this.users.slice(0, 2)
    }

    abstract gameString: string

    handleGetGame(user: User) {
        user.send('gz', this.gameString)
    }

    add(user: User) {
        this.events.addListeners(user)

        this.users.push(user)
        user.table = this

        const seat = this.users.length

        user.send('jt', this.id, seat)
        this.room.send('ut', this.id, seat)
    }

    toString() {
        return `${this.id}|${this.playingUsers.length}`
    }

}
