const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'data.json');

if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ users: [] }));
}

// Get all users
app.get('/users', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile));
    res.json(data.users);
});

// Add new user
app.post('/users', (req, res) => {
    const { name, age, contact, email } = req.body;
    const data = JSON.parse(fs.readFileSync(dataFile));
    const newUser = {
        id: Date.now(),
        name,
        age,
        contact,
        email
    };
    data.users.push(newUser);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json(newUser);
});

// Update user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, contact, email } = req.body;
    const data = JSON.parse(fs.readFileSync(dataFile));
    const userIndex = data.users.findIndex(user => user.id === parseInt(id));
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    data.users[userIndex] = {
        ...data.users[userIndex],
        name,
        age,
        contact,
        email
    };

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json(data.users[userIndex]);
});

// Delete user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(dataFile));
    const userIndex = data.users.findIndex(user => user.id === parseInt(id));
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    data.users.splice(userIndex, 1);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ message: 'User deleted successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Use 10.0.2.2:3000 to access from Android emulator');
});
