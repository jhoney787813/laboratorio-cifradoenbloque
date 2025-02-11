require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Configurar base de datos
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) console.error(err.message);
    console.log('📦 Conectado a SQLite.');
});

// Crear tabla de usuarios
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`);

// Función de cifrado AES-256-CBC
function encryptAES(text) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
}

function decryptAES(encryptedText) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
    const encrypted = encryptedText.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Registro de usuario
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedPassword = encryptAES(hashedPassword);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, encryptedPassword], (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ message: "✅ Usuario registrado correctamente." });
    });
});

// Inicio de sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT password FROM users WHERE username = ?`, [username], async (err, row) => {
        if (!row) return res.status(404).json({ error: "⚠️ Usuario no encontrado." });

        const decryptedPassword = decryptAES(row.password);
        const match = await bcrypt.compare(password, decryptedPassword);

        if (match) res.status(200).json({ message: "🔓 Inicio de sesión exitoso." });
        else res.status(401).json({ error: "❌ Credenciales incorrectas." });
    });
});



// Iniciar servidor
app.listen(3000, () => console.log('🌍 Servidor en http://localhost:3000'));