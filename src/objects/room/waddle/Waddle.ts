import type Room from '../Room'
import type User from '@objects/user/User'
import WaddleRoom from './WaddleRoom'

export default class Waddle {

    users: (User | null)[]

    constructor(
        public id: number,
        seats: number,
        public room: Room,
        public game: Room
    ) {
        this.users = new Array(seats).fill(null)
    }

    get isFull() {
        return !this.users.includes(null)
    }

    add(user: User) {
        const seat = this.users.indexOf(null)

        this.users[seat] = user
        user.waddle = this

        user.send('jw', seat)
        this.room.send('uw', this.id, seat, user.username)

        if (this.isFull) {
            this.start()
        }
    }

    remove(user: User) {
        const seat = this.users.indexOf(user)

        this.users[seat] = null
        user.waddle = null

        this.room.send('uw', this.id, seat)
    }

    start() {
        // Copy users array
        const users = [...this.users] as User[]

        new WaddleRoom(this.game.id, users)

        for (const user of users) {
            this.remove(user)

            user.send('sw', this.game.id, this.room.id, users.length)
        }
    }

    toString() {
        const seatList = this.users.map(user => user?.username || '').join(',')

        return `${this.id}|${seatList}`
    }

}
