const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://mongodb:27017/myusers')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Connection error:", err));

const User = mongoose.model('User', new mongoose.Schema({ name: String, age: Number }));

app.get('/', (req, res) => {
    res.send(`
        <h1>Add User</h1>
        <form action="/add" method="POST">
            <input type="text" name="username" placeholder="Enter Name" required>
            <input type="text" name="age" placeholder="Enter Age" required>
            <button type="submit">Add User</button>
        </form>
        <br>

        <label>View Users</label>
        <a href="/users">View Users</a>
        <br>

        <h2>Delete User</h2>
        <form action="/delete" method="POST">
            <input type="text" name="username_delete" placeholder="Enter Name to delete" required>
            <button type="submit">Delete User</button>
        </form>

        <br>
        <h2>Delete All Users</h2>
        <form action="/deleteAll" method="POST">
            <button type="submit">Delete All Users</button>
        </form>
        <br>

        <h2>Show one user</h2>
        <form action="/showOne" method="POST">
            <input type="text" name="username_show" placeholder="Enter Name to show" required>
            <button type="submit">Show User</button>
        </form>
        <br>

        <h2>Update User</h2>
        <form action="/update" method="POST">
            <input type="text" name="username_update" placeholder="Enter Name to update" required>
            <input type="text" name="age_update" placeholder="Enter New Age" required>
            <button type="submit">Update User</button>
        </form>
    `);
});

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send('<ul>' + users.map(user => `<li>${user.name}</li>`).join('') + '</ul>');
});

app.post('/showOne', async (req, res) => {
    const user = await User.find({ name: req.body.username_show })
    return res.send(`User ${user.name} - ${user.age}`)
})

app.post('/deleteAll', async (req, res) => {
    await User.deleteMany({});
    res.send('All users deleted');
});

app.post('/delete', async (req, res) => {
    try {
        const nameToDelete = req.body.username_delete;
        const result = await User.deleteOne({ name: nameToDelete });

        if (result.deletedCount === 0) {
            return res.send(`User ${nameToDelete} not found.`);
        } else {
            res.send(`User ${nameToDelete} deleted.`);
        }
    } catch (err) {
        res.status(500).send("Error deleting user");
    }
});

app.post('/add', async (req, res) => {
    try {
        const newUser = new User({ name: req.body.username, age: req.body.age });
        await newUser.save();
        console.log("User saved:", req.body.username);
        res.send(`
            User ${req.body.username} added!
            <a href="/">Add another user</a>
        `);
    } catch (err) {
        console.error("Save error:", err);
        res.status(500).send("Error saving to database");
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));