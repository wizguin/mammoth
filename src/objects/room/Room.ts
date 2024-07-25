import type User from '@objects/user/User'

export default class Room {

    users: User[]

    constructor(
        public id: number,
        public name: string = '',
        public member: boolean = false,
        public maxUsers: number = 80,
        public game: boolean = false,
        public spawn: boolean = false
    ) {
        this.users = []
    }

    get isFull() {
        return this.users.length >= this.maxUsers
    }

    add(user: User) {
        this.users.push(user)

        if (this.game) {
            user.send('jg', this.id)

        } else {
            user.send('jr', this.id, ...this.users)
            this.send('ap', user)
        }
    }

    remove(user: User) {
        this.users = this.users.filter(u => u !== user)

        if (!this.game) this.send('rp', user.id)
    }

    send(...args: (number | string | object)[]) {
        this.users.forEach(user => user.send(...args))
    }

}
