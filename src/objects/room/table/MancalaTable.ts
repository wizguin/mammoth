import BaseTable from './BaseTable'
import type Room from '../Room'

export default class MancalaTable extends BaseTable {

    map: number[]

    constructor(id: number, room: Room) {
        super(id, room)

        this.map = [
            4, 4, 4, 4, 4, 4, 0,
            4, 4, 4, 4, 4, 4, 0
        ]
    }

    get gameString() {
        const usernames = new Array(2).fill('')

        for (let i = 0; i < this.playingUsers.length; i++) {
            usernames[i] = this.playingUsers[i].username
        }

        const map = this.map.join(',')

        return [...usernames, map].join('%')
    }

}
