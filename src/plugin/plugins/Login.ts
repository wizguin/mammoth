import BasePlugin from '../BasePlugin'

import Errors from '@objects/user/Errors'
import { handleOnce } from '@Decorators'
import { maxUsers } from '@Config'
import Redis from '../../redis/Redis'
import { updateWorldPopulation } from '../../World'
import type User from '@objects/user/User'
import { version } from '@Data'

import { compare } from 'bcrypt'
import type { Element } from 'elementtree'

export default class Login extends BasePlugin {

    events = {
        verChk: this.verChk,
        login: this.login
    }

    @handleOnce
    verChk(user: User, body: Element) {
        const ver = body.find('ver')

        const response = ver && ver.get('v') === version
            ? 'apiOK'
            : 'apiKO'

        user.sendXml(`<msg t="sys"><body action="${response}" r="0"></body></msg>`)
    }

    @handleOnce
    async login(user: User, body: Element) {
        if (this.usersLength >= maxUsers) {
            user.sendError(Errors.ServerFull)
            user.disconnect()

            return
        }

        const isAuthenticated = await this.authenticateUser(user, body)

        if (!isAuthenticated) {
            user.disconnect()
            return
        }

        this.updateUsers(user)

        await Redis.del(`${user.id}:loginkey`)

        user.send('l')
    }

    async authenticateUser(user: User, body: Element) {
        const login = body.find('login')

        if (!login) {
            return false
        }

        const nick = login.find('nick')?.text
        const pword = login.find('pword')?.text

        if (!nick || !pword) {
            return false
        }

        const isLoaded = await user.load(nick.toString())

        if (!isLoaded || user.isBanned) {
            return false
        }

        const loginKey = await Redis.get(`${user.id}:loginkey`)

        if (!loginKey) {
            return false
        }

        return compare(pword.toString(), loginKey)
    }

    updateUsers(user: User) {
        if (user.id in this.users) {
            this.users[user.id].disconnect()
        }

        this.users[user.id] = user

        updateWorldPopulation(this.usersLength)
    }

}
