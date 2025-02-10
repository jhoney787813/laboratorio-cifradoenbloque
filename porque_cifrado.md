# **Explicación Técnica del Cifrado en Bloque y su Implementación en Servidores de Autenticación**

## **1. Introducción al Cifrado en Bloque**
El cifrado en bloque es un tipo de cifrado simétrico en el que los datos se dividen en bloques de tamaño fijo y cada bloque se cifra por separado utilizando una clave secreta. En este laboratorio, implementamos el cifrado **AES-256-CBC** para proteger credenciales en un servidor de autenticación.

El cifrado en bloque es ampliamente utilizado en protocolos de seguridad como **TLS**, **IPSec** y **SSH**, ya que garantiza la confidencialidad de los datos y los protege contra ataques de fuerza bruta y manipulación.

---

## **2. ¿Por qué AES-256-CBC?**
El **Advanced Encryption Standard (AES)** es uno de los algoritmos de cifrado más seguros y eficientes, estandarizado por el **NIST (National Institute of Standards and Technology)**. Dentro de sus modos de operación, **AES-256-CBC** es ampliamente utilizado en sistemas de autenticación debido a:

- **Clave de 256 bits**: Proporciona un nivel de seguridad extremadamente alto.
- **Modo CBC (Cipher Block Chaining)**: Introduce un **vector de inicialización (IV)** que evita la repetición de patrones en el cifrado.
- **Eficiencia en hardware y software**: Se puede optimizar para alto rendimiento.

---

## **3. Funcionamiento del Cifrado en Bloque en la Implementación**
### **3.1 Esquema de Cifrado**
La implementación en el servidor de autenticación sigue estos pasos:

1. **Recepción de la contraseña del usuario**.
2. **Generación de un hash** con **bcrypt** (para evitar ataques de diccionario).
3. **Cifrado del hash con AES-256-CBC**, utilizando:
   - Clave de cifrado de 256 bits.
   - **IV (vector de inicialización)** aleatorio de 16 bytes.
4. **Almacenamiento de la contraseña cifrada** en la base de datos.
5. **Desencriptado y comparación** en el proceso de autenticación.

---

### **3.2 Código de Cifrado AES-256-CBC**
```js
function encryptAES(text) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
}
```
#### **Explicación del código**:
- **Se obtiene la clave de cifrado** desde las variables de entorno.
- **Se genera un IV aleatorio** de 16 bytes para evitar repeticiones en el cifrado.
- **Se inicializa el cifrador AES-256-CBC**.
- **Se cifra el texto y se concatena con el IV** para poder descifrarlo posteriormente.

---

## **4. Comparación con Otros Métodos de Cifrado**
| Algoritmo | Clave | Seguridad | Aplicaciones |
|-----------|-------|-----------|--------------|
| **AES-256-CBC** | 256 bits | Alta | Autenticación, bases de datos |
| **DES** | 56 bits | Baja (obsoleto) | Protocolos antiguos |
| **RSA** | 2048+ bits | Alta (asimétrico) | Firma digital, cifrado de claves |

AES-256-CBC es la mejor opción para **cifrado de contraseñas en servidores de autenticación**, ya que **RSA** es más costoso computacionalmente y **DES** es inseguro.

---

## **5. Importancia del Cifrado en Bloque en la Seguridad de Autenticación**
El cifrado en bloque protege las credenciales de usuario en entornos de autenticación mediante:

✅ **Evitar el robo de contraseñas en bases de datos**.  
✅ **Proteger contra ataques de diccionario y fuerza bruta**.  
✅ **Asegurar la confidencialidad de los datos sensibles**.  
✅ **Cumplir con estándares de seguridad como GDPR, ISO 27001 y NIST**.  

---

## **6. Conclusión**
El laboratorio demostró cómo integrar **cifrado en bloque (AES-256-CBC)** en servidores de autenticación para mejorar la seguridad. La combinación de **bcrypt + AES** ofrece una solución robusta contra ataques a contraseñas, asegurando que incluso si la base de datos es comprometida, los datos permanezcan protegidos.

---

## **Referencias**
- Ferguson, N., Schneier, B., & Kohno, T. (2010). *Cryptography Engineering: Design Principles and Practical Applications*. John Wiley & Sons.  
- Menezes, A. J., Van Oorschot, P. C., & Vanstone, S. A. (1996). *Handbook of Applied Cryptography*. CRC Press.  
- National Institute of Standards and Technology. (2001). *Announcing the Advanced Encryption Standard (AES)*.  

---

🔐 **¡Implementar cifrado en bloque es clave para la seguridad digital!** 🚀
