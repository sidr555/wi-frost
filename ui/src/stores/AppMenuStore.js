import { makeAutoObservable } from 'mobx'


class AppMenuStore {
    items = []

    constructor() {
        makeAutoObservable(this)
    }

    clean() {
        this.items = []
    }

    addItem(item) {
//        console.log('MENU add item', item, this.items);
        this.items.push(item)
        return this
    }

}

export default AppMenuStore
