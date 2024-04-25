import { loadData } from './LoadData'

interface Room {
    id: number
    name: string
    member: number
    maxUsers: number
    game: number
    spawn: number
}

export const rooms: Room[] = loadData('rooms')
