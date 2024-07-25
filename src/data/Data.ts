import { loadData } from './LoadData'

import type { Assert } from 'ts-runtime-checks'

type Items = Record<string, Item>

interface Item {
    name: string,
    type: number,
    cost: number,
    member: boolean
}

interface Room {
    id: number
    name: string
    member: boolean
    maxUsers?: number
    game: boolean
    spawn: boolean
}

export const items: Items = loadData('items') as Assert<Items>
export const rooms: Room[] = loadData('rooms') as Assert<Room[]>
