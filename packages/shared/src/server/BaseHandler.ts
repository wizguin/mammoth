import { delimiter, parseXml, parseXt } from './packet/Packet'
import Logger from '../logger/Logger'

import type { Element } from 'elementtree'
import EventEmitter from 'events'

export const policy = '<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>'

export default abstract class BaseHandler<Client> {

    events: EventEmitter

    constructor() {
        this.events = new EventEmitter({ captureRejections: true })
        this.events.on('error', error => Logger.error(error))
    }

    handle(data: string, client: Client) {
        try {
            const packets = data.split(delimiter).filter(Boolean)

            for (const packet of packets) {
                Logger.info(`Received: ${packet}`)

                if (packet.startsWith('<')) {
                    this.handleXml(packet, client)
                }

                if (packet.startsWith('%')) {
                    this.handleXt(packet, client)
                }
            }

        } catch (error) {
            Logger.error(error)
        }
    }

    handleXml(data: string, client: Client) {
        const parsed = parseXml(data)

        if (!parsed) {
            Logger.warn(`Invalid XML data: ${data}`)
            return
        }

        switch (parsed.tag) {
            case 'policy-file-request':
                this.sendPolicyResponse(client)
                break

            case 'msg':
                this.handleXmlMsg(parsed, client)
                break
        }
    }

    handleXmlMsg(parsed: Element, client: Client) {
        const body = parsed.find('body')

        if (!body) {
            return
        }

        const action = body.get('action')

        if (action) {
            this.events.emit(action, client, body)
        }
    }

    handleXt(data: string, client: Client) {
        const parsed = parseXt(data)

        if (!parsed) {
            Logger.warn(`Invalid XT data: ${data}`)
            return
        }

        Logger.debug('Parsed args', { parsed })

        this.emitXtEvent(parsed.action, client, parsed.args)
    }

    emitXtEvent(action: string, client: Client, args: (string | number)[]) {
        this.events.emit(action, client, ...args)
    }

    abstract sendPolicyResponse(client: Client): void

}
