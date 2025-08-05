# YuruYuri-MD - Bot de WhatsApp

Un bot de WhatsApp multifuncional, construido desde cero con Node.js y Baileys, enfocado en el rendimiento, la modularidad y la facilidad de uso.

## ✨ Características

-   **🔌 Sistema de Plugins:** Añade nuevos comandos fácilmente creando archivos en las carpetas de `plugins`.
-   **👑 Sistema VIP:** Gestiona usuarios premium con acceso a comandos exclusivos, otorgado por un tiempo limitado.
-   **⚙️ Configuración Sencilla:** Personaliza el nombre del bot, el prefijo y los dueños desde `config.js`.
-   **🚀 Despliegue Flexible:** Diseñado para funcionar en tu PC, en Termux (Android) o en un servidor VPS.
-   **🇪🇸 Totalmente en Español:** Tanto el código como la documentación están pensados para la comunidad de habla hispana.

## 📋 Requisitos

-   **Node.js:** Versión 16 o superior.
-   **Git:** Para clonar el repositorio.
-   **Ffmpeg:** Para el procesamiento de stickers, videos y audios.
-   **Una cuenta de WhatsApp.**

## 📲 Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/your-username/YuruYuri-MD.git
    cd YuruYuri-MD
    ```

2.  **Instala las dependencias:**
    Este proyecto usa una gran cantidad de dependencias para los *scrapers* y otras funciones. La instalación puede tardar varios minutos.
    ```bash
    npm install
    ```

## ⚙️ Configuración

Antes de iniciar el bot, debes configurar tu número de dueño.

1.  Abre el archivo `config.js`.
2.  Busca la línea `const owner = ['5219999999999'];`.
3.  **Reemplaza el número de ejemplo con tu número de WhatsApp** en formato internacional (código de país + número, sin el `+`).

    ```javascript
    // Ejemplo:
    const owner = ['12345678901']; // Número de Estados Unidos
    const owner = ['5218112345678']; // Número de México
    ```

## 🚀 Iniciar el Bot

1.  Ejecuta el siguiente comando en tu terminal:
    ```bash
    npm start
    ```
2.  Abre WhatsApp en tu teléfono, ve a `Ajustes > Dispositivos Vinculados` y escanea el código QR que aparecerá en la terminal.
3.  Una vez conectado, ¡el bot está listo para usarse!

## 👑 Sistema VIP

### ¿Cómo dar VIP a un usuario?

El dueño del bot puede usar el siguiente comando en cualquier chat:
`!vip <número> <días>`

-   **Ejemplo:** `!vip 5218112345678 30`
-   Esto dará acceso VIP al número especificado durante 30 días.

El bot avisará al usuario cuando su suscripción esté a punto de expirar.

## 🧩 Añadir Nuevos Comandos

Crear un nuevo comando es muy fácil:

1.  Elige la categoría de tu comando: `free`, `premium`, `admin` u `owner`.
2.  Crea un nuevo archivo `.js` en esa carpeta (ej. `plugins/free/miComando.js`).
3.  Usa esta plantilla:

```javascript
import config from '../../config.js';

export default {
    name: 'micomando', // El nombre del comando
    desc: 'Descripción de lo que hace el comando.',
    usage: `${config.prefix}micomando [argumentos]`,

    // Banderas (opcional)
    isOwner: false,       // Solo para el dueño
    isGroup: false,       // Solo para grupos
    isGroupAdmin: false,  // Solo para admins de grupo

    async execute({ sock, from, args, msg }) {
        // Tu lógica aquí
        await sock.sendMessage(from, { text: '¡Mi nuevo comando funciona!' }, { quoted: msg });
    }
};
```

El bot cargará tu nuevo comando automáticamente al reiniciar.

## 🔄 Comando de Actualización

Si instalaste el bot usando `git clone`, el dueño puede usar el comando `!update` para actualizar el código del bot directamente desde el repositorio de GitHub. El bot instalará las nuevas dependencias si es necesario y te pedirá que lo reinicies.
