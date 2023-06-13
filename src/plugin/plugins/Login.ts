import BasePlugin from '../BasePlugin'

import { allowedVersions } from '@config'

import type { Element } from 'elementtree'
import type User from '@objects/user/User'


export default class Login extends BasePlugin {

    events = {
        verChk: this.verChk,
        login: this.login
    }

    verChk(args: Element, user: User) {
        const ver = args.find('ver')

        if (!ver) return

        const v = ver.get('v')

        if (v && allowedVersions.includes(v)) {
            user.sendXml('<msg t="sys"><body action="apiOK" r="0"></body></msg>')
        }
    }

    async login(args: Element, user: User) {
        const login = args.find('login')

        if (!login) return

        const nick = login.find('nick')?.text
        const pword = login.find('pword')?.text

        if (!nick || !pword) return

        const load = await user.load(nick.toString())

        if (load) user.send('l')
    }

}
