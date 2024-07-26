import { loadData } from './LoadData'

import type { Assert } from 'ts-runtime-checks'

type Furniture = Record<string, FurnitureItem>
type Items = Record<string, Item>
type PlayerRooms = Record<string, PlayerRoom>
type Rooms = Room[]
type Waddles = Waddle[]

interface FurnitureItem {
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
    member?: boolean
    maxUsers?: number
    game?: boolean
    spawn?: boolean
}

interface Waddle {
    id: number,
    roomId: number,
    seats: number,
    game: string
}

export const furniture: Furniture = loadData('furniture') as Assert<Furniture>
export const items: Items = loadData('items') as Assert<Items>
export const playerRooms: PlayerRooms = loadData('player_rooms') as Assert<PlayerRooms>
export const rooms: Rooms = loadData('rooms') as Assert<Rooms>
export const waddles: Waddles = loadData('waddles') as Assert<Waddles>
