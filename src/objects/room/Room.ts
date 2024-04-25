import type { Room as IRoom } from '../../data/Data'
import type User from '@objects/user/User'

export default class Room implements IRoom {

    users: User[]

    id!: number
    name!: string
    member!: number
    maxUsers!: number
    game!: number
    spawn!: number

    constructor(data: IRoom) {
        Object.assign(this, data)

        this.users = []
    }

    get userStrings() {
        return this.users.map(u => u.string)
    }

    add(user: User) {
        this.users.push(user)

        user.send('jr', this.id, ...this.userStrings)
        this.send('ap', user.string)
    }

    remove(user: User) {
        if (!this.game) this.send('rp', user.id)

        this.users = this.users.filter(u => u !== user)

    }

    send(...args: (number | string)[]) {
        this.users.forEach(user => user.send(...args))
    }

}
