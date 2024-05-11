import type Handler from '../handler/Handler'
import type Room from '@objects/room/Room'
import type User from '@objects/user/User'

import type { Assert } from 'ts-runtime-checks'

export type Num = Assert<number>
export type NumArray = Assert<number[]>
export type Str = Assert<string>

type EventHandler = (user: User, ...args: any[]) => void | Promise<void>

export default class BasePlugin {

    handler: Handler
    users: User[]
    usersById: { [key: string]: User }
    rooms: Record<number, Room>
    events!: Record<string, EventHandler>

    constructor(handler: Handler) {
        this.handler = handler

        this.users = handler.users
        this.usersById = handler.usersById
        this.rooms = handler.rooms
    }

}
