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

    add(user: User) {
        this.users.push(user)

        user.send('jr', this.id, ...this.users)
        this.send('ap', user)
    }

    remove(user: User) {
        this.users = this.users.filter(u => u !== user)

        if (!this.game) this.send('rp', user.id)
    }

    send(...args: (number | string | object)[]) {
        this.users.forEach(user => user.send(...args))
    }

}
