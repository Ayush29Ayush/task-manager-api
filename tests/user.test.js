const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId
//! Default User
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async()=>{
    // console.log('beforeEach')
    await User.deleteMany()
    await new User(userOne).save()

})

// afterEach(()=>{
//     console.log('afterEach')
// })

test('Should signup a new user',async()=>{
    await request(app).post('/users').send({
        name: 'Ayush',
        email: 'ayushsenapati123@gmail.com',
        password: 'Trialsecret!'
    }).expect(201)
})

test('Should login existing user',async()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login non-existent user',async()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password:'wrongpass'
    }).expect(400)
})

test('Should get profile for user',async()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)

})

//! Goal: Test delete account
//1. Create "Should delete account for user"
//   - Setup auth header and expect correct status code
//2. Create "Should not delete account for unauthenticated user"
//   - Expect correct status code
//3. test your work

test('Should delete account for user', async()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete account for unauthenticated user',async()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})