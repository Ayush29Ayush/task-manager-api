
const {calculateTip, celsiusToFahrenheit, fahrenheitToCelsius, add} = require('../src/math')

test('Should calculate total with tip' , ()=>{
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('should calculate total with default tip',()=>{
    const total = calculateTip(100)
    expect(total).toBe(125)
})

test('Should convert 32 F to 0 C',()=>{
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

test('Should convert 0 C to 32 F',()=>{
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

//! we should have got an error since 1!=2 but all the test cases passed because the jest didn't knew this was a async function and hence didn't waited for 2 sec.
// test('Async test demo without done()',()=>{
//     setTimeout(() => {
//         expect(1).toBe(2)
//     }, 2000);
// })

//! To make it know that this is a async function , function ko koi ek kisi bhi naam ka parameter dena hoga , in this case , we are using "done".
// test('Async test demo with done()',(done)=>{
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000);
// })

//! Method 01
test('Should add two numbers',(done)=>{
    add(2,3).then((sum)=>{
        expect(sum).toBe(5)
        done()
    })
})

//! Method 02
test('Should add two numbers async/await',async()=>{
    const sum = await add(10,22)
    expect(sum).toBe(32)
})