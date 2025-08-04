# JulesBot-MD - Bot de WhatsApp Multifuncional

![Banner](https://i.imgur.com/U2gK8pG.png)

Un potente bot de WhatsApp construido con Node.js y Baileys. Diseñado para ser modular, extensible y fácil de usar. Inspirado en la funcionalidad de bots populares, este proyecto ofrece una base sólida para crear tu propio asistente de WhatsApp.

## ✨ Características Principales

-   **🔌 Sistema de Plugins:** Añade nuevos comandos fácilmente creando archivos en las carpetas de plugins. ¡Sin necesidad de tocar el código principal!
-   **👑 Sistema VIP:** Gestiona usuarios premium con acceso a comandos exclusivos. El acceso es por tiempo limitado y fácil de otorgar.
-   **📂 Comandos por Categorías:**
    -   `/free`: Comandos básicos para todos los usuarios.
    -   `/premium`: Comandos exclusivos para usuarios VIP (descargas, juegos, etc.).
    -   `/admin`: Comandos de administración de grupos.
    -   `/owner`: Comandos restringidos para el dueño del bot.
-   **⚙️ Configuración Sencilla:** Personaliza el nombre del bot, el prefijo, los dueños y más desde un único archivo `config/settings.js`.
-   **💬 Interactivo:** Respuestas automáticas, mensajes de bienvenida, anti-enlaces y más, todo configurable.
-   **🚀 Despliegue Flexible:** Instrucciones claras para instalar en tu PC, en Termux (Android) o en un servidor VPS/Boxmine.

## 📋 Requisitos Previos

-   **Node.js:** Versión 16 o superior.
-   **Git:** Para clonar el repositorio.
-   **Ffmpeg:** Necesario para procesar stickers, videos y audios.
-   **Una cuenta de WhatsApp:** El número que usará el bot.

## 📲 Instalación

Sigue los pasos según tu plataforma.

### 1. Instalación Local (Windows/MacOS/Linux)

```bash
# Clona este repositorio
git clone https://github.com/your-username/julesbot-md.git

# Entra en el directorio del bot
cd julesbot-md

# Instala las dependencias (puede tardar unos minutos)
npm install

# ¡Listo! Ahora ve a la sección de Configuración.
```

### 2. Instalación en Termux (Android)

```bash
# Actualiza los paquetes de Termux
pkg update && pkg upgrade

# Instala las herramientas necesarias
pkg install nodejs git ffmpeg libwebp imagemagick

# Clona este repositorio
git clone https://github.com/your-username/julesbot-md.git

# Entra en el directorio del bot
cd julesbot-md

# Instala las dependencias
npm install

# ¡Listo! Ahora ve a la sección de Configuración.
```

### 3. Instalación en un Servidor (VPS/Boxmine)

```bash
# Conéctate a tu servidor por SSH

# Actualiza los paquetes del sistema
sudo apt update && sudo apt upgrade -y

# Instala las herramientas necesarias
sudo apt install nodejs git ffmpeg -y

# Clona este repositorio
git clone https://github.com/your-username/julesbot-md.git

# Entra en el directorio del bot
cd julesbot-md

# Instala las dependencias
npm install

# (Recomendado) Usa PM2 para mantener el bot activo 24/7
npm install -g pm2
# Inicia el bot con PM2
pm2 start index.js --name "julesbot"
# Para ver los logs: pm2 logs julesbot
# Para detener el bot: pm2 stop julesbot
```

## ⚙️ Configuración

Antes de iniciar el bot, es **muy importante** que configures tus datos.

1.  Abre el archivo `config/settings.js`.
2.  Edita la sección `bot`:

```javascript
// config/settings.js

module.exports = {
    bot: {
        name: "JulesBot", // El nombre de tu bot
        emoji: "🤖",
        version: "1.0.0",
        prefix: "!", // El prefijo para los comandos (ej. !menu)
        owners: ["521XXXXXXXXXX", "1234567890"], // ¡TU NÚMERO DE WHATSAPP AQUÍ!
        channel: "https://www.youtube.com/c/yourchannel", // Tu canal (opcional)
    },
    // ... más configuraciones
}
```

**¡Atención!** Reemplaza `"521XXXXXXXXXX"` con tu número de WhatsApp en formato internacional (código de país + número), sin espacios ni el signo `+`.

## 🚀 Cómo Iniciar el Bot

Una vez instalado y configurado:

1.  Ejecuta el comando de inicio en tu terminal:
    ```bash
    npm start
    ```
2.  **Escanea el QR:** Abre WhatsApp en tu teléfono, ve a `Dispositivos Vinculados` y escanea el código QR que aparecerá en la terminal.
3.  Espera a que la conexión se establezca. Verás un mensaje de "Conectado!" en la consola.
4.  ¡Listo! Envía `!ping` desde cualquier chat para probar si el bot responde.

## 👑 Sistema VIP

Los usuarios VIP tienen acceso a comandos premium.

### ¿Cómo dar VIP a un usuario?

Solo el dueño del bot puede hacerlo. Usa el siguiente comando en cualquier chat con el bot:

```
!vip <número> <días>
```

-   **Ejemplo:** `!vip 521987654321 30`
-   Esto le dará al número `521987654321` acceso VIP durante `30` días.

El bot enviará una confirmación al dueño y una notificación al nuevo usuario VIP. También avisará al usuario un día antes de que su suscripción expire.

## 🧩 Añadir Nuevos Comandos (Para Desarrolladores)

El sistema de plugins hace que sea muy fácil añadir comandos.

1.  Decide la categoría de tu comando: `free`, `premium`, `admin` u `owner`.
2.  Si es un comando de `premium`, puedes crear una subcarpeta (ej. `premium/tools`).
3.  Crea un nuevo archivo `.js` en la carpeta elegida (ej. `plugins/free/saludo.js`).
4.  Usa la siguiente plantilla para tu comando:

```javascript
/**
 * Descripción corta del comando.
 * Categoría: free
 */

const settings = require('../../config/settings'); // Importa la config si necesitas el prefijo, etc.

module.exports = {
    name: 'saludo', // El nombre del comando (lo que va después del prefijo)
    desc: 'Envía un saludo amigable.', // Descripción para el menú de ayuda
    usage: `${settings.bot.prefix}saludo`, // Cómo se usa el comando

    // --- Banderas Opcionales ---
    isOwner: false,       // ¿Solo para el dueño?
    isPremium: false,     // ¿Solo para VIP? (se infiere de la carpeta 'premium')
    isGroup: false,       // ¿Solo para grupos?
    isGroupAdmin: false,  // ¿Solo para admins de grupo?

    // --- La Lógica del Comando ---
    execute: async (ctx) => {
        const { sock, from, sender, msg } = ctx;

        const message = `¡Hola, @${sender.split('@')[0]}! Soy JulesBot.`;

        await sock.sendMessage(from, {
            text: message,
            mentions: [sender] // Importante para etiquetar al usuario
        }, { quoted: msg });
    }
};
```

¡Eso es todo! El bot cargará automáticamente tu nuevo comando al reiniciar.

## 🔄 Comando de Actualización

Si instalaste el bot usando `git clone`, el dueño puede usar el comando `!update` para actualizar el código del bot directamente desde el repositorio de GitHub sin necesidad de acceder a la terminal.

---
Hecho con ❤️ por Jules.
