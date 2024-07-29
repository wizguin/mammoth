import BasePlugin from '../BasePlugin'

import { allowedVersions } from '@Config'
import { handleOnce } from '@Decorators'
import type User from '@objects/user/User'

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

        if (!ver) {
            return
        }

        const v = ver.get('v')

        if (v && allowedVersions.includes(v)) {
            user.sendXml('<msg t="sys"><body action="apiOK" r="0"></body></msg>')
        }
    }

    @handleOnce
    async login(user: User, body: Element) {
        const isAuthenticated = await this.authenticateUser(user, body)

        user.update({ loginKey: null })

        if (!isAuthenticated) {
            user.disconnect()
            return
        }

        this.updateUsersById(user)
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

        if (!isLoaded || !user.loginKey) {
            return false
        }

        // Swap bcrypt prefix
        return compare(pword.toString(), user.loginKey.replace('$2y$', '$2a$'))
    }

    updateUsersById(user: User) {
        if (user.id in this.usersById) {
            this.usersById[user.id].disconnect()
        }

        this.usersById[user.id] = user
    }

}
