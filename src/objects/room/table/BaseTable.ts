import type Room from '../Room'
import type User from '@objects/user/User'

export default class BaseTable {

    users: User[]
    started: boolean
    currentTurn: number

    constructor(
        public id: number,
        public room: Room
    ) {
        this.users = []
        this.started = false
        this.currentTurn = 1
    }

    get playingUsers() {
        return this.users.slice(0, 2)
    }

    add(user: User) {
        this.users.push(user)

        const seat = this.users.length

        user.send('jt', this.id, seat)
        this.room.send('ut', this.id, seat)
    }

    toString() {
        return `${this.id}|${this.playingUsers.length}`
    }

}
