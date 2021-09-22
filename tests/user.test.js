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
    const response = await request(app).post('/users').send({
        name: 'Ayush',
        email: 'ayushsenapati123@gmail.com',
        password: 'Trialsecret!'
    }).expect(201)

    //! Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //! Assertions about the response
    // expect(response.body.user.name).toBe('Ayush')
    // The better way is written below
    expect(response.body).toMatchObject({
        user:{
            name: 'Ayush',
            email: 'ayushsenapati123@gmail.com'    
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Trialsecret')
})

test('Should login existing user',async()=>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
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

test('Should delete account for user', async()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user',async()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    // expect({}).toBe({})  if toBe doesn't work as expected use toEqual
    expect({}).toEqual({})
    
    expect(user.avatar).toEqual(expect.any(Buffer))

})

//! Goal: Test user updates

//1. Create "Should update valid user fields"
//   - Update the name of the test user
//   - Check the data t confirm it's changed
//2. Create "Should not update invalid user fields"
//   - Update a "location" filed and expect error status code
//3. Test your code

test('Should update valid user fields', async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})

test('Should not update invalid user fields', async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Delhi'
        })
        .expect(400)
})