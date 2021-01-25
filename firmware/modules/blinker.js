// const err_blinks = {
//     badconf: 5,
//     wifidis: 4
// };


// Blue led blinking routine
const blinker = (num, delay) => {
    if (num > 0) {
        digitalWrite(D2, 1);
        setTimeout(() => {
            digitalWrite(D2, 0);
            setTimeout(() => { blinker(num-1, delay); }, delay);
        }, delay || 500);
    }
};

module.exports = blinker;
