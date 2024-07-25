import { loadData } from './LoadData'

import type { Assert } from 'ts-runtime-checks'

type Furnitures = Record<string, Furniture>
type Items = Record<string, Item>
type PlayerRooms = Record<string, PlayerRoom>
type Rooms = Room[]

interface Furniture {
    name: string,
    cost: number
}

interface Item {
    name: string,
    type: number,
    cost: number,
    member: boolean
}

interface PlayerRoom {
    name: string,
    cost: number
}

interface Room {
    id: number
    name: string
    member: boolean
    maxUsers?: number
    game: boolean
    spawn: boolean
}

export const furnitures: Furnitures = loadData('furnitures') as Assert<Furnitures>
export const items: Items = loadData('items') as Assert<Items>
export const playerRooms: PlayerRooms = loadData('player_rooms') as Assert<PlayerRooms>
export const rooms: Rooms = loadData('rooms') as Assert<Rooms>
