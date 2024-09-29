import '@shared/env/Env'

import Database from '@Database'
import Logger from '@Logger'
import { makeXt } from '@shared/server/packet/Packet'
import SimpleServer from '@shared/server/simple/SimpleServer'
import { username } from '@shared/schema/JoinSchema'

const host = '0.0.0.0'
const port = parseInt(process.env.JOIN_PORT || '6113')

const server = new SimpleServer(host, port)

server.addEvent('verChk', socket => {
    server.write(socket, '<msg t="sys"><body action="apiOK" r="0"></body></msg>')
})

server.addEvent('login', socket => {
    server.write(socket, '<msg t="sys"><body action="logOK" r="0"></body></msg>')
})

server.addEvent('checkName', async (socket, name: string) => {
    try {
        const { error, value } = username.validate(name)

        if (error || await checkUserExists(value)) {
            server.write(socket, makeXt(['checkName', 1]))
            return
        }

        server.write(socket, makeXt(['checkName', 0, value]))

    } catch (error) {
        Logger.error(error)
    }
})

async function checkUserExists(username: string) {
    const user = await Database.user.findUnique({
        where: { username }
    })

    return user !== null
}
