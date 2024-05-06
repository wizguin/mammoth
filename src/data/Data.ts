import { loadData } from './LoadData'

import type { Assert } from 'ts-runtime-checks'

export interface Room {
    id: number
    name: string
    member: number
    maxUsers: number
    game: number
    spawn: number
}

export const rooms: Room[] = loadData('rooms') as Assert<Room[]>
