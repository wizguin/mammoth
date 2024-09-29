import BaseHandler, { policy } from '../BaseHandler'

import { delimiter } from '../packet/Packet'
import Logger from '../../logger/Logger'

import type { Socket } from 'net'

export default class SimpleHandler extends BaseHandler<Socket> {

    sendPolicyResponse(socket: Socket) {
        this.write(socket, policy)
    }

    write(socket: Socket, data: string) {
        Logger.debug(`Sending: ${data}`)

        socket.write(`${data}${delimiter}`)
    }

}
