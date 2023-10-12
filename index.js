const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('post', req => {
	if (req.method === "POST") return JSON.stringify(req.body)
	else return ""
})
app.use(morgan(
	":method :url :status :res[content-length] - :response-time ms :post"
))

// Base data
let persons = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]

// Helper functions
const generateId = () => {
	const maxId = persons.length > 0
	? Math.max(...persons.map(p => p.id))
	: 0

	return maxId + 1
}

const nameExists = (name) => {
	const person = persons.find(person => person.name === name);
	if (person) {
		return true
	}
	return false
}

// Routes

// Get all
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// Get one
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// Delete one
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

// Add one
app.post('/api/persons', (req, res) => {
	const body = req.body
	console.log('body:', body)
	console.log('name:', body.name)

	if (body.name === undefined) {
		return res.status(400).json({
			error: 'Name is missing'
		})
	}

	if (body.number === undefined) {
		return res.status(400).json({
			error: 'Number is missing'
		})
	}

	// Not sure about this status code
	if (nameExists(body.name)) {
		return res.status(422).json({
			error: 'Name already exists in phonebook'
		})
	}

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	}

	persons = persons.concat(person)
	res.json({
		method: req.method,
		url: req.url,
		status: res.status,

	})
})

//Phonebook info
app.get('/info', (req, res) => {
	const body = `
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date().toDateString()} ${new Date().toTimeString()}</p>
	`
	res.send(body)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
