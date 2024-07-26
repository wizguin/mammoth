import type Room from '../Room'
import type User from '@objects/user/User'

export default class Waddle {

    users: (User | null)[]

    constructor(
        public id: number,
        public seats: number,
        public game: string,
        public room: Room
    ) {
        this.users = new Array(seats).fill(null)
    }

    toString() {
        const seatList = this.users.map(user => user?.username || '').join(',')

        return `${this.id}|${seatList}`
    }

}
