import type Handler from '../handler/Handler'
import type PlayerRoom from '@objects/room/PlayerRoom'
import type Room from '@objects/room/Room'
import type User from '@objects/user/User'

import type { Assert, Max, MaxLen, Min, MinLen } from 'ts-runtime-checks'

export type Num = Assert<number>
export type NumArray = Assert<number[]>
export type NumBetween<
    min extends number,
    max extends number
> = Assert<number & Min<min> & Max<max>>

export type Str = Assert<string>
export type StrArray = Assert<string[]>
export type StrBetween<
    min extends number,
    max extends number
> = Assert<string & MinLen<min> & MaxLen<max>>

type EventHandler = (user: User, ...args: any[]) => void | Promise<void>

export default class BasePlugin {

    handler: Handler
    users: User[]
    usersById: { [key: string]: User }
    rooms: Record<number, Room>
    playerRooms: Record<number, PlayerRoom>
    events!: Record<string, EventHandler>

    constructor(handler: Handler) {
        this.handler = handler

        this.users = handler.users
        this.usersById = handler.usersById
        this.rooms = handler.rooms
        this.playerRooms = handler.playerRooms
    }

}
