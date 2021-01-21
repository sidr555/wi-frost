//import { makeAutoObservable } from "mobx"
import { useObservable } from 'mobx-react-lite'

export default useObservable({
    state: 'wait',
    ports: [],
    set(name, value) {
        if (name === 'state') {
            store.state = value
        } else {
            let port = store.ports.find( (port) => port.name === name )
            if (port) {
                port.value = value
            }
        }
    }
})
