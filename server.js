const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(express.json())

const users = []

app.get('/users', (req, res)=> {
    res.json(users)
})

app.post('/users', async (req, res)=>{
    try{
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt)
        console.log(hashedPassword)
        const user = {
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user)
        res.status(201).send()
        console.log(user)
    }catch(error) {
        res.status(500).send()
        console.log(error)
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if(user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success!')
        } else{
            res.send('Not allowed')
        }
    }catch(error) {
        res.status(500).send(error)
    }
})

app.listen(3000);