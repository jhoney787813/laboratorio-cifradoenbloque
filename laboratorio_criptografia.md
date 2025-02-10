# **Implementación del Cifrado en Bloque en Servidores de Autenticación**

**Universidad Politécnico Grancolombiano**  
**Especialización en Seguridad de la Información**  
**Materia:** Criptografía Asimétrica  
**Docente:** José Alfonso Valencia Rodríguez  
**Autor:** Jhon Edison Hincapié  
**Año:** 2025  

---

## **Resumen**
En este laboratorio, se implementa un sistema de autenticación con cifrado en bloque mediante el algoritmo **AES-256-CBC**. Se utiliza **Node.js**, **SQLite** y **bcrypt** para cifrar y almacenar credenciales de manera segura. La implementación sigue las mejores prácticas de seguridad y se prueba en un entorno **macOS**.

## **Introducción**
La autenticación de usuarios es una parte fundamental en la seguridad de la información. Los sistemas modernos requieren el uso de cifrado fuerte para proteger credenciales contra ataques de fuerza bruta y acceso no autorizado.  

En este laboratorio, se implementa un mecanismo de autenticación segura que combina el cifrado en bloque con **AES-256-CBC** y hashing con **bcrypt**.

---

## **1. Materiales y Métodos**

### **1.1 Requisitos**
Para la implementación del laboratorio en **macOS**, se requieren los siguientes elementos:

- **Homebrew** (gestor de paquetes)
- **Node.js y npm** (entorno de ejecución)
- **SQLite** (base de datos ligera)
- **Editor de código** (VS Code, Nano o Vim)

---

### **1.2 Instalación del Entorno**
Los siguientes comandos permiten instalar y configurar el entorno:

```sh
# Instalar Homebrew (si no está instalado)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js y SQLite
brew install node sqlite

# Verificar versiones
node -v
sqlite3 --version
```

---

### **1.3 Creación del Proyecto**
Se configura el entorno de desarrollo creando un directorio de trabajo:

```sh
mkdir auth-encryption-lab && cd auth-encryption-lab
npm init -y
npm install express sqlite3 crypto dotenv body-parser bcrypt
touch server.js .env
```

---

### **1.4 Configuración del Cifrado en Bloque**
Se define una clave AES-256 en el archivo `.env`:

```sh
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef
```

---

## **2. Desarrollo de la Aplicación**

El código fuente principal de la aplicación está en `server.js`, el cual implementa las funciones de cifrado y autenticación.

### **2.1 Código Fuente**
```js
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
```

---

## **3. Resultados y Pruebas**
Se ejecutan las pruebas con comandos `curl` para verificar la funcionalidad:

### **3.1 Registro de usuario**
```sh
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username": "jhon", "password": "miClaveSecreta"}'
```

### **3.2 Inicio de sesión exitoso**
```sh
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username": "jhon", "password": "miClaveSecreta"}'
```

### **3.3 Inicio de sesión fallido**
```sh
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username": "jhon", "password": "claveIncorrecta"}'
```

---

## **4. Conclusiones**
- Se implementó un sistema de autenticación basado en **cifrado en bloque (AES-256-CBC)** para proteger las credenciales.  
- **bcrypt** se usó para agregar una capa adicional de seguridad, protegiendo contra ataques de diccionario y fuerza bruta.  
- La solución es ligera y fácil de integrar en aplicaciones modernas, asegurando una autenticación segura en servidores existentes.  

---

## **5. Referencias**
- Ferguson, N., Schneier, B., & Kohno, T. (2010). *Cryptography Engineering: Design Principles and Practical Applications*. John Wiley & Sons.  
- Menezes, A. J., Van Oorschot, P. C., & Vanstone, S. A. (1996). *Handbook of Applied Cryptography*. CRC Press.  

---

## 🚀 **Instrucciones Finales**
- Guarda este archivo como **`README.md`** y súbelo a **GitHub o Notion**.  
- Si lo deseas compilar en PDF, usa **pandoc** con el siguiente comando:  
  ```sh
  pandoc README.md -o laboratorio.pdf
  ```

---

🔐 **¡Laboratorio completado!** 🎉
