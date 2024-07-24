import BaseCollection from '../BaseCollection'

import Database from '@Database'
import type User from '@objects/user/User'

interface FurnitureRecord {
    userId: number,
    furnitureId: number,
    quantity: number
}

export default class FurnitureCollection extends BaseCollection<FurnitureRecord> {

    constructor(user: User, records: FurnitureRecord[]) {
        super(user, records, 'furnitureId')
    }

    async add(itemId: number) {
        //
    }

}
