import type User from '@objects/user/User'

type Collection = {
    [key: string]: Record
}

export type Record = {
    [key: string]: number | string
}

export default abstract class BaseCollection {

    user: User
    indexKey: string
    collection: Collection

    constructor(user: User, records: Record[], indexKey: string) {
        this.user = user
        this.indexKey = indexKey

        this.collection = {}

        this.collect(records)
    }

    get keys() {
        return Object.keys(this.collection)
    }

    get values() {
        return Object.values(this.collection)
    }

    get count() {
        return this.keys.length
    }

    abstract add(...args: (number | string)[]): void

    remove?(...args: (number | string)[]): void

    collect(records: Record[]) {
        records.forEach(record => this.updateCollection(record))
    }

    updateCollection(record: Record) {
        this.collection[record[this.indexKey]] = record
    }

    includes(key: string) {
        return key in this.collection
    }

    toString() {
        return this.keys.join('%')
    }

}
