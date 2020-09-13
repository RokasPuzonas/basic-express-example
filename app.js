const Joi = require("joi")
const express = require("express")

var courses = [
	{ id: 1, name: "course foo"},
	{ id: 2, name: "course bar"},
	{ id: 3, name: "course foobar"}
]
const course_schema = Joi.object({
	name: Joi.string().min(3).required()
})

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
	res.send("Hello World!");
})

app.get("/api/courses", (req, res) => {
	res.send(courses)
})

app.get("/api/courses/:id", (req, res) => {
	let course = courses.find(c => c.id == req.params.id)
	if (!course) return res.status(404).send(`Course ${req.params.id} not found`)

	res.send(course)
})

app.post("/api/courses", (req, res) => {
	let { error } = course_schema.validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	const course = {
		id: courses.length+1,
		name: req.body.name
	}
	courses.push(course)
	res.send(course)
})

app.put("/api/courses/:id", (req, res) => {
	let course = courses.find(c => c.id == req.params.id)
	if (!course) return res.status(404).send(`Course ${req.params.id} not found`)

	let { error } = course_schema.validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	course.name = req.body.name
	res.send(course)
})

app.delete("/api/courses/:id", (req, res) => {
	let course = courses.find(c => c.id == req.params.id)
	if (!course) return res.status(404).send(`Course ${req.params.id} not found`)
	
	courses.splice(courses.indexOf(course), 1)
	res.send(course)
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`)
})