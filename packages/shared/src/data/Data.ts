import { loadData } from './LoadData'

import type { Assert } from 'ts-runtime-checks'

type Furniture = Record<string, FurnitureItem>
type Items = Record<string, Item>
type Pets = Record<string, Pet>
type PlayerRooms = Record<string, PlayerRoom>
type Rooms = Room[]
type Tables = Table[]
type Waddles = Waddle[]

interface Consts {
    maxUsers: number,
    preferredSpawn: number | false,
    version: '097' | '130',
    whitelistEnabled: boolean
}

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
    maxRest: number,
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

interface Table {
    id: number,
    roomId: number,
    type: 'mancala'
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

export const consts: Consts = loadData('consts') as Assert<Consts>
export const isVersion130 = consts.version === '130'

export const furniture = loadData('furniture') as Assert<Furniture>
export const items = loadData('items') as Assert<Items>
export const music = loadData('music') as Assert<number[]>
export const pets = loadData('pets') as Assert<Pets>

export const playerRooms = loadData('player_rooms') as Assert<PlayerRooms>
export const rooms = loadData('rooms') as Assert<Rooms>

export const tables = loadData('tables') as Assert<Tables>
export const waddles = loadData('waddles') as Assert<Waddles>

export const whitelist: Whitelist = loadData('whitelist') as Assert<Whitelist>
