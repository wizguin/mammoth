import type Handler from '../handler/Handler'
import type User from '../objects/user/User'


export default class BasePlugin {

    handler: Handler
    users: User[]
    events!: Record<string, (args: any[], user: User) => void>

    constructor(handler: Handler) {
        this.handler = handler

        this.users = handler.users
    }

}
