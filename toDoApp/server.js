const express = require("express");
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://mongodb:27017/myTasks')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));

const Task = mongoose.model("Task", new mongoose.Schema({ title: String, priority: String, status: Boolean }));

app.get('/', (req, res) => {
  res.send(`
    <form method="POST", action="/addTask">
      <label>Add some task: </label> <br>
      <input type="text" name="task_title" placeholder="enter the task title..."/> <br>
      <label>Priority:</label>
      <select name="task_priority">
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
      </select>
      <label>Is completed? </label>
      <input type="checkbox" name="task_status"/> <br>
      <button type="submit">Add</button>
    </form>
    <br>
    <br>
    <a href="/tasks">Show all tasks</a>
    `);
})

app.get('/tasks', async (req, res) => {
  try {
    const allTasks = await Task.find();
    const htmlOutput = `
      <form method="GET" action="/tasks/filteredTasks">
        <input name="filtered_title" placeholder="type task title"/>
        <button type="submit">Search</button>
      </form>

      ${allTasks.map(task =>
      `
          <form method="POST" action="/deleteTask/${task._id}">
            <button type="submit" style="${task.status ? 'color: green;' : 'color: red;'}">${task.title} - ${task.priority}</button>
          </form>
          <form method="POST" action="/task/${task._id}">
            <button type="submit">UPDATE</button>
          </form>
        `
    ).join('')}
    `

    allTasks.length == 0 ? res.send('No task to show. Let\'s add some.') : res.send(htmlOutput);
  }
  catch (err) {
    res.status(500).send('Error with connecting database.');
  }
})

app.get('/tasks/filteredTasks', async (req, res) => {
  const filteredTasks = await Task.find({ title: req.query.filtered_title })

  res.send(filteredTasks.map(task => `
    <form method="POST" action="/deleteTask/${task._id}">
      <button type="submit" style="${task.status ? 'color: green;' : 'color: red;'}">${task.title} - ${task.priority}</button>
      </form>
      <form method="POST" action="/task/${task._id}">
        <button type="submit">UPDATE</button>
      </form>
    `
  ).join(''))
})

app.post('/deleteTask/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    res.send('Task is deleted.')
  }
  catch (err) {
    res.status(500).send('Error with deleting task.')
  }
})

app.post('/task/:id', async (req, res) => {
  const currentTask = await Task.findById(req.params.id);

  const htmlOutput = `
    <form method="post" action="/task/${currentTask._id}/update">
      <label>Edit your task: </label> <br>
      <input type="text" name="new_title" placeholder="enter the task title..." value="${currentTask.title}"/><br>
      <label>Priority:</label>
      <select name="new_priority">
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
      </select><br>
      <label>Is completed? </label>
      <input type="checkbox" name="new_status" ${currentTask.status ? 'checked' : ''}/> <br>
      <button type="submit">Update</button>
    </form>
  `;

  res.send(htmlOutput);
})

app.post('/task/:id/update', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      title: req.body.new_title,
      priority: req.body.new_priority,
      status: req.body.new_status === 'on'
    })

    res.redirect('/tasks')
  }
  catch (err) {
    res.status(500).send("Error with updating to database.");
  }
});

app.post('/addTask', async (req, res) => {
  const newTask = new Task({ title: req.body.task_title, priority: req.body.task_priority, status: req.body.task_status === 'on' });

  await newTask.save();

  res.send(`Task added. Let's to <a href="/tasks">Show all tasks</a>`);
})

app.listen(3000, () => console.log("Server running on http://localhost:3000"));