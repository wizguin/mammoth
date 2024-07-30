import type User from '../User'

type EventMap = Record<string, (user: User, ...args: any) => void | Promise<void>>

interface Config {
    on?: EventMap,
    once?: EventMap
}

type EventAction = 'on' | 'once' | 'off'

export default class TemporaryEvents {

    private context: any
    private on: EventMap = {}
    private once: EventMap = {}

    constructor(context: any, config: Config) {
        this.context = context

        if (config.on) {
            this.on = this.bindHandlers(config.on)
        }

        if (config.once) {
            this.once = this.bindHandlers(config.once)
        }
    }

    bindHandlers(eventMap: EventMap) {
        const boundMap: EventMap = {}

        for (const event in eventMap) {
            boundMap[event] = eventMap[event].bind(this.context)
        }

        return boundMap
    }

    addListeners(user: User) {
        this.updateListeners(user, 'on', this.on)
        this.updateListeners(user, 'once', this.once)
    }

    removeListeners(user: User) {
        this.updateListeners(user, 'off', this.on)
        this.updateListeners(user, 'off', this.once)
    }

    updateListeners(user: User, action: EventAction, eventMap: EventMap) {
        for (const event in eventMap) {
            user.events[action](event, eventMap[event])
        }
    }

}
