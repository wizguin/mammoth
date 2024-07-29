import BaseTable from './BaseTable'
import type Room from '../Room'

export default class MancalaTable extends BaseTable {

    constructor(id: number, room: Room) {
        super(id, room)
    }

}
