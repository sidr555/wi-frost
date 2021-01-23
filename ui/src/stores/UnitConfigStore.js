import { makeAutoObservable } from 'mobx'

import DefaultConfig from '../config/freezer.default.json'

class UnitConfigStore {

    id = ''
    store = {}

    constructor(id) {
        makeAutoObservable(this)

        this.id = id

        const store = ''//localStorage.getItem(id)
        if (store && store.name) {
            try {
                this.store = JSON.parse(store)
            } catch (e) {
            }
        } else {
            this.fetch()
        }
    }

    fetch() {
        if (!this.store.name) {
            this.store = DefaultConfig
        }
    }

    update(data) {
        if (data) {
            this.store = data
        }
//        localStorage.setItem(this.id, JSON.stringify(this.store))
    }

    get title() {
        return this.store.title
    }
    set title(value) {
        this.store.title = value
    }

    get name() {
        return this.store.name
    }
    set name(value) {
        this.store.name = value
    }

    get brand() {
        return this.store.brand
    }
    set brand(value) {
        this.store.brand = value
    }

    get model() {
        return this.store.model
    }
    set model(value) {
        this.store.model = value
    }

    get location() {
        return this.store.location
    }
    set location(value) {
        this.store.location = value
    }

    get states() {
        return this.store.states
    }
    set states(value) {
        this.store.states = value
    }

    get image() {
        return this.store.image
    }
    set image(value) {
        this.store.image = value
    }

    get onewire() {
        return this.store.onewire
    }
    get jobs() {
        return this.store.jobs
    }
    get devs() {
        return this.store.devs
    }


}

export default UnitConfigStore
