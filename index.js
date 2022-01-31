const fs = require('fs')
const express = require('express');
const persons = require('./persons.json')
const morgan = require('morgan')
const app = express();
const PORT = 3001;

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;
    return maxId+1;
}

morgan.token('postBody', (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :postBody"))

app.get('/', (req,res) => {  
    res.send('asd')  
})

app.get('/info', (req,res) => {
    res.send(`Phonebook has info for ${persons.length} people<br> ${new Date()}`)
})

app.get('/api/persons', (req,res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    res.json(person)
})

app.post('/api/persons', (req,res) => {
    const body = req.body;

    if(persons.filter(person => person.name === body.name).length > 0){
        return res.status(400).json({
            error: "Name already exists"
        })
    }
    else if(!body.number){
        return res.status(400).json({
            error: "You must enter phonenumber"
        })
    }
    else if(!body.name){
        return res.status(400).json({
            error: "You must enter name"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    fs.writeFileSync('./persons.json', JSON.stringify(persons.concat(person)), err => {
        if(err)
            console.log(err)
        return
    })
    
    // console.log(persons)
    res.json(person)
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

