import Dev from './Dev'

class Button extends Dev {
    constructor({ name, pin, type, title }) {
        super({ name, pin, type, title })
        //this.type = 'switch'
    }
}

export default Button;
