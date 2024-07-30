import BaseTable from './BaseTable'
import type { Num } from '../../../plugin/ArgTypes'
import type Room from '../Room'
import TemporaryEvents from '@objects/user/events/TemporaryEvents'
import type User from '@objects/user/User'

enum TurnCommand {
    FreeTurn = 'f',
    Capture = 'c'
}

export default class MancalaTable extends BaseTable {

    map: number[]

    constructor(id: number, room: Room) {
        super(id, room)

        this.map = [
            4, 4, 4, 4, 4, 4, 0,
            4, 4, 4, 4, 4, 4, 0
        ]

        this.events = new TemporaryEvents(this, {
            on: {
                zm: this.handleSendMove
            },
            once: {
                gz: this.handleGetGame,
                jz: this.handleJoinGame,
                lz: this.handleLeaveGame,
                lt: this.handleLeaveTable
            }
        })
    }

    handleSendMove(user: User, hole: Num) {
        if (!this.started) {
            return
        }

        if (!this.isValidMove(user, hole)) {
            return
        }

        const move = this.makeMove(hole)

        this.send('zm', this.currentTurn, hole, move)

        if (move !== TurnCommand.FreeTurn) {
            this.currentTurn = this.currentTurn === 0 ? 1 : 0
        }
    }

    isValidMove(user: User, hole: number) {
        if (this.map[hole] <= 0) {
            return false
        }

        const turn = this.users.indexOf(user)
        if (turn !== this.currentTurn) {
            return false
        }

        if (this.currentTurn === 0 && this.isTurn0Side(hole)) {
            return true
        }

        if (this.currentTurn === 1 && this.isTurn1Side(hole)) {
            return true
        }

        return false
    }

    makeMove(hole: number) {
        let stones = this.map[hole]

        this.map[hole] = 0

        while (stones > 0) {
            hole = this.getNextHole(hole)

            this.map[hole]++
            stones--
        }

        return this.checkLastHole(hole)
    }

    getNextHole(hole: number) {
        hole++
        const opponentMancala = this.currentTurn === 0 ? 13 : 6

        if (hole === opponentMancala) {
            hole++
        }

        if (hole > this.map.length - 1) {
            hole = 0
        }

        return hole
    }

    checkLastHole(hole: number) {
        // Capture
        const oppositeHole = 12 - hole
        const myMancala = this.currentTurn === 0 ? 6 : 13

        if (this.map[hole] === 1 && this.map[oppositeHole] > 0) {
            // Only if on your side
            if (this.currentTurn === 0 && this.isTurn0Side(hole) || this.currentTurn === 1 && this.isTurn1Side(hole)) {
                this.map[myMancala] += this.map[oppositeHole] + 1
                this.map[hole] = 0
                this.map[oppositeHole] = 0

                return TurnCommand.Capture
            }
        }

        // Free turn
        if (this.currentTurn === 0 && hole === myMancala || this.currentTurn === 1 && hole === myMancala) {
            return TurnCommand.FreeTurn
        }

        return ''
    }

    isTurn0Side(hole: number) {
        return hole >= 0 && hole <= 5
    }

    isTurn1Side(hole: number) {
        return hole >= 7 && hole <= 12
    }

    get gameString() {
        const usernames = new Array(2).fill('')

        for (let i = 0; i < this.playingUsers.length; i++) {
            usernames[i] = this.playingUsers[i].username
        }

        const map = this.map.join(',')
        const strings = [...usernames, map]

        if (this.started) {
            strings.push(this.currentTurn)
        }

        return strings.join('%')
    }

}
