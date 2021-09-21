// const calculateTip = (total , tipPercent)=>{
//     const tip = total*tipPercent
//     // const tip = total*tipPercent + total
//     return (total + tip)
// }

const calculateTip = (total , tipPercent = .25)=> total + (total*tipPercent)
//! Here , we set a default tipPercent of 25%


const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}


const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject('Numbers must be non-negative')
            }

            resolve(a + b)
        }, 2000)
    })
}

module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}