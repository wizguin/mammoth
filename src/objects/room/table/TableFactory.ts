import MancalaTable from './MancalaTable'
import type Room from '../Room'

export type TableType = keyof typeof types

const types = {
    mancala: MancalaTable
}

export default function createTable(id: number, room: Room, type: TableType) {
    return new types[type](id, room)
}
