import { makeAutoObservable } from 'mobx'


class UnitConfigStore {

    id = ''
    store = {}

    constructor(id) {
        makeAutoObservable(this)

        this.id = id

        const store = localStorage.getItem(id)
        if (store) {
            try {
                this.store = JSON.parse(store)
            } catch (e) {
            }

        }
    }

    update(data) {
        if (data) {
            this.store = data
        }
        localStorage.setItem(this.id, JSON.stringify(this.store))
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
    get devs() {
        return this.store.devs
    }
//    set devs(value) {
//        this.store.states = devs
//    }

}

export default UnitConfigStore
/*


  "title": "Большой серый холодильник",
  "brand": "Daewoo",
  "model": "FR-530",
  "image": "/images/daewoo/fr-530.png",
  "name": "wi-frost",
  "location": "s-home",
  "states" : {
    "wait": "Недоступен",
    "sleep": "Сон",
    "freeze": "Охлаждение",
    "heat": "Разморозка",
    "danger": "Авария",
    "unknown": "Неизвестно"
  },
  "devs": [
    {
      "pin": 4,
      "type": "onewire",
      "name": "temp_sensors",
      "title": "Шина 1-wire"
    },
    {
      "pin": 5,
      "type": "switch",
      "name": "compressor",
      "title": "Компрессор"
    },
    {
      "pin": 18,
      "type": "switch",
      "name": "compressor_fan",
      "title": "Вентилятор компрессора"
    },
    {
      "pin": 19,
      "type": "switch",
      "name": "heater",
      "title": "Отопитель"
    },
    {
      "pin": 21,
      "type": "switch",
      "name": "fan",
      "title": "Вентилятор морозилки"
    }
  ],
  "onewire": [
    {
      "id": "284d341104000093",
      "type": "temp1wire",
      "name": "moroz",
      "title": "Морозильная камера"
    },
*/
