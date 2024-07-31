import { loadData } from './LoadData'
import type { TableType } from '@objects/room/table/TableFactory'

import type { Assert } from 'ts-runtime-checks'

type Furniture = Record<string, FurnitureItem>
type Items = Record<string, Item>
type Pets = Record<string, Pet>
type PlayerRooms = Record<string, PlayerRoom>
type Rooms = Room[]
type Tables = Table[]
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

interface Pet {
    name: string,
    maxHealth: number,
    maxHunger: number,
    maxRest: number
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

interface Table {
    id: number,
    roomId: number,
    type: TableType
}

interface Waddle {
    id: number,
    seats: number,
    roomId: number,
    gameId: number
}

interface Whitelist {
    items: number[]
    furniture: number[],
    pets: number[]
    playerRooms: number[]
}

export const furniture: Furniture = loadData('furniture') as Assert<Furniture>
export const items: Items = loadData('items') as Assert<Items>
export const pets: Pets = loadData('pets') as Assert<Pets>
export const playerRooms: PlayerRooms = loadData('player_rooms') as Assert<PlayerRooms>
export const rooms: Rooms = loadData('rooms') as Assert<Rooms>
export const tables: Tables = loadData('tables') as Assert<Tables>
export const waddles: Waddles = loadData('waddles') as Assert<Waddles>
export const whitelist: Whitelist = loadData('whitelist') as Assert<Whitelist>
