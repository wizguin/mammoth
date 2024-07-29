import type User from '@objects/user/User'
import Waddle from './waddle/Waddle'

export default class Room {

    users: User[]
    waddles: Record<string, Waddle>

    constructor(
        public id: number,
        public name: string = '',
        public member: boolean = false,
        public maxUsers: number = 80,
        public game: boolean = false,
        public spawn: boolean = false
    ) {
        this.users = []
        this.waddles = {}
    }

    get isFull() {
        return this.users.length >= this.maxUsers
    }

    add(user: User) {
        user.room = this

        this.users.push(user)

        if (this.game) {
            user.send('jg', this.id)

        } else {
            user.send('jr', this.id, ...this.users)
            this.send('ap', user)
        }
    }

    remove(user: User) {
        user.room = null

        this.users = this.users.filter(u => u !== user)

        if (!this.game) this.send('rp', user.id)
    }

    send(...args: (number | string | object)[]) {
        this.users.forEach(user => user.send(...args))
    }

    addWaddle(id: number, seats: number, game: Room) {
        this.waddles[id] = new Waddle(id, seats, this, game)
    }

}
