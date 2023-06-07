import Logger from '@Logger'

import { readdir } from 'fs/promises'
import { join, parse } from 'path'

import type BasePlugin from './BasePlugin'
import type EventEmitter from 'events'
import type Handler from '../handler/Handler'


export default class PluginLoader {

    handler: Handler
    events: EventEmitter
    plugins: Record<string, BasePlugin>

    constructor(handler: Handler) {
        this.handler = handler

        this.events = handler.events
        this.plugins = {}

        this.loadPlugins()
    }

    async loadPlugins() {
        const files = await readdir(join(__dirname, 'plugins'))

        await Promise.all(files.map(file => this.loadPlugin(file)))

        console.log(`Loaded ${Object.keys(this.plugins).length} plugins`)
    }

    async loadPlugin(file: string) {
        const name = parse(file).name
        const plugin = (await import(`./plugins/${name}`)).default

        this.plugins[name] = new plugin(this.handler)

        this.loadEvents(this.plugins[name])
    }

    loadEvents(plugin: BasePlugin) {
        for (const event in plugin.events) {
            this.events.on(event, plugin.events[event].bind(plugin))
        }
    }

}
