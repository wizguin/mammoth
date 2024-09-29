import Logger from '../../logger/Logger'

import { RateLimiterMemory } from 'rate-limiter-flexible'

const addressConnectsPs = parseInt(process.env.ADDRESS_CONNECTS_PER_SECOND || '5')
const addressEventsPs = parseInt(process.env.ADDRESS_EVENTS_PER_SECOND || '50')
const socketEventsPs = parseInt(process.env.USER_EVENTS_PER_SECOND || '10')

export default class RateLimiter {

    addressConnects: RateLimiterMemory
    addressEvents: RateLimiterMemory
    socketEvents: RateLimiterMemory

    constructor() {
        Logger.success('Enabling rate limiting')

        this.addressConnects = this.createLimiter(addressConnectsPs)
        this.addressEvents = this.createLimiter(addressEventsPs)
        this.socketEvents = this.createLimiter(socketEventsPs)
    }

    createLimiter(points: number) {
        return new RateLimiterMemory({
            points: points,
            duration: 1
        })
    }

}
