import { loadData } from './LoadData'

import type { Assert } from 'ts-runtime-checks'

export interface Room {
    id: number
    name: string
    member: boolean
    maxUsers?: number
    game: boolean
    spawn: boolean
}

export const rooms: Room[] = loadData('rooms') as Assert<Room[]>
