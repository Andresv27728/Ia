
# 🤖 WhatsApp Bot with Baileys

Un potente bot de WhatsApp construido con JavaScript y Node.js usando la librería Baileys. Este bot cuenta con un sistema de comandos basado en plugins, gestión de usuarios premium, y más de 100 comandos útiles.

![WhatsApp Bot](https://i.imgur.com/whatsapp-bot.png)

## ✨ Características

- 🔌 Sistema de comandos basado en plugins
- 👑 Gestión de usuarios premium
- 🧩 100+ comandos integrados
- 👥 Administración de grupos
- 🎮 Juegos y comandos divertidos
- ⬇️ Descarga de medios
- 🔄 Fácil de extender con nuevos plugins
- 📊 Estadísticas de usuarios
- 🔐 Sistema de sub-bots (público/premium)
- 🛡️ Sistema anti-link
- 👋 Mensajes de bienvenida
- ⚠️ Sistema de advertencias y baneos

## 📋 Requisitos

- Node.js v16+
- Una cuenta de WhatsApp
- Conexión a internet estable

## 📲 Instalación

### Método 1: Replit (Recomendado)

1. Haz fork de este repositorio en GitHub
2. Importa el proyecto en [Replit](https://replit.com)
3. Configura las variables en `config/settings.js`
4. Haz clic en "Run" para iniciar el bot
5. Escanea el código QR con WhatsApp

### Método 2: Termux (Android)

```bash
# Actualizar paquetes
pkg update && pkg upgrade

# Instalar paquetes necesarios
pkg install nodejs git libwebp ffmpeg imagemagick

# Clonar el repositorio
git clone https://github.com/tuusuario/whatsapp-bot-baileys.git

# Navegar al directorio
cd whatsapp-bot-baileys

# Instalar dependencias
npm install

# Iniciar el bot
npm start
```

### Método 3: VPS/Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade

# Instalar paquetes necesarios
sudo apt install nodejs npm git libwebp-dev ffmpeg imagemagick

# Clonar el repositorio
git clone https://github.com/tuusuario/whatsapp-bot-baileys.git

# Navegar al directorio
cd whatsapp-bot-baileys

# Instalar dependencias
npm install

# Instalar PM2 para mantener el bot corriendo
sudo npm install -g pm2

# Iniciar el bot con PM2
pm2 start index.js --name "whatsapp-bot"

# Ver logs
pm2 logs whatsapp-bot
```

## ⚙️ Configuración

Edita `config/settings.js` para personalizar tu bot:

```javascript
module.exports = {
    bot: {
        name: "NombreDelBot",          // Nombre del bot
        emoji: "🤖",                   // Emoji del bot
        prefix: "!",                   // Prefijo de comandos
        version: "1.0.0",              // Versión del bot
        owners: ["1234567890"],        // Tu número de WhatsApp (sin +)
        channel: "https://whatsapp.com/channel/ejemplo" // Canal del bot
    },
    
    message: {
        always_online: true,           // Mantenerse siempre en línea
        footer: "Powered by Baileys",  // Pie de página
        show_messages: true            // Mostrar mensajes en consola
    },
    
    // Más configuraciones...
};
```

## 🚀 Primeros Pasos

1. Configura tu número como owner en `config/settings.js`
2. Inicia el bot: `npm start` o haz clic en "Run" en Replit
3. Escanea el código QR con WhatsApp
4. Espera a que el bot se conecte
5. Prueba un comando como `!help` para comenzar

## 📝 Sistema de Sub-bots

Este bot incluye un sistema de sub-bots con dos niveles:

### Sub-bots Públicos (Gratis)

- Acceso limitado a comandos básicos
- Solo 2 comandos de descarga
- Comandos mínimos de administración de grupos
- Juegos limitados
- Perfecto para probar el bot

### Sub-bots Premium

- Acceso completo a todos los comandos
- Todas las opciones de descarga disponibles
- Administración completa de grupos
- Todos los juegos y características divertidas
- Funciones premium exclusivas

## 👑 Gestión Premium

### Cómo Agregar Usuarios Premium

Como propietario del bot, usa el comando:

```
!vip 1234567890 30
```

Esto otorga acceso premium al número `1234567890` por `30` días.

### Beneficios Premium

- Acceso completo a todos los comandos
- Descargas ilimitadas
- Procesamiento prioritario
- Sin límites de uso
- Comandos exclusivos
- Soporte personalizado

## 📚 Comandos Disponibles

### 👑 Comandos de Propietario
- `!vip <número> <días>` - Otorgar acceso premium
- `!ban @usuario <razón>` - Banear un usuario
- `!unban <número>` - Desbanear un usuario
- `!broadcast <mensaje>` - Enviar mensaje a todos los usuarios
- `!update` - Actualizar bot desde repositorio
- `!restart` - Reiniciar el bot
- `!eval <código>` - Evaluar código JavaScript
- `!exec <comando>` - Ejecutar comando de sistema
- `!stats` - Estadísticas del bot
- `!setname <nombre>` - Cambiar nombre del bot

### 👮 Comandos de Administración
- `!kick @usuario` - Remover usuario del grupo
- `!add <número>` - Agregar usuario al grupo
- `!promote @usuario` - Hacer administrador
- `!demote @usuario` - Quitar administrador
- `!mute` - Silenciar grupo (solo admins pueden enviar mensajes)
- `!unmute` - Desilenciar grupo
- `!link` - Obtener enlace de invitación del grupo
- `!setname <nombre>` - Cambiar nombre del grupo
- `!setdesc <descripción>` - Cambiar descripción del grupo
- `!tagall` - Mencionar todos los miembros
- `!warning @usuario` - Dar advertencia a un usuario
- `!antilink on/off` - Activar/desactivar anti-link
- `!welcome on/off` - Activar/desactivar bienvenidas

### ⬇️ Comandos de Descarga
- `!ytmp3 <URL>` - Descargar audio de YouTube
- `!ytmp4 <URL>` - Descargar video de YouTube
- `!fb <URL>` - Descargar video de Facebook
- `!ig <URL>` - Descargar post/video de Instagram
- `!tiktok <URL>` - Descargar video de TikTok
- `!twitter <URL>` - Descargar video de Twitter
- `!spotify <URL>` - Descargar pista de Spotify
- `!image <búsqueda>` - Buscar y descargar imagen
- `!pinterest <búsqueda>` - Descargar de Pinterest
- `!gdrive <URL>` - Descargar de Google Drive
- `!mediafire <URL>` - Descargar de MediaFire

### 🎮 Comandos de Juegos
- `!tictactoe @usuario` - Jugar Tres en Raya
- `!hangman` - Jugar Ahorcado
- `!trivia` - Preguntas de trivia
- `!math` - Desafíos matemáticos
- `!quiz` - Quiz de conocimiento general
- `!riddle` - Resolver adivinanzas
- `!truth` - Pregunta de verdad
- `!dare` - Desafío de reto
- `!roll` - Lanzar dado
- `!flip` - Lanzar moneda
- `!slots` - Máquina tragamonedas
- `!roulette` - Ruleta rusa
- `!blackjack` - Jugar Blackjack
- `!poker` - Jugar Poker
- `!lottery` - Lotería diaria

### ⭐ Comandos Premium
- `!sticker` - Crear stickers desde imágenes/videos
- `!translate <texto>` - Traducir texto
- `!ocr` - Extraer texto de imagen
- `!removebg` - Remover fondo de imagen
- `!weather <ciudad>` - Información del clima
- `!wallpaper <búsqueda>` - Descargar fondos HD
- `!lyrics <canción>` - Buscar letras de canciones
- `!anime <título>` - Buscar información de anime
- `!qr <texto>` - Generar código QR
- `!barcode <texto>` - Generar código de barras
- `!meme` - Generar memes aleatorios
- `!joke` - Chistes aleatorios
- `!fact` - Datos curiosos
- `!quote` - Citas inspiradoras

### 🌐 Comandos Públicos
- `!help` - Mostrar lista de comandos
- `!menu` - Mostrar menú completo
- `!info` - Información del bot
- `!ping` - Verificar tiempo de respuesta
- `!profile` - Ver tu perfil
- `!status` - Estado del bot
- `!creator` - Información del creador
- `!donate` - Apoyar al desarrollador
- `!premium` - Información sobre premium
- `!rules` - Reglas del bot

### 🔧 Comandos de Utilidad
- `!calc <operación>` - Calculadora
- `!short <URL>` - Acortar URLs
- `!qrread` - Leer código QR de imagen
- `!base64 encode/decode <texto>` - Codificar/decodificar Base64
- `!hash <texto>` - Generar hash MD5/SHA
- `!timer <segundos>` - Temporizador
- `!reminder <tiempo> <mensaje>` - Recordatorio
- `!poll <pregunta>` - Crear encuesta

### 🎵 Comandos de Música
- `!play <canción>` - Buscar y reproducir música
- `!lyrics <canción>` - Buscar letras
- `!shazam` - Identificar canción (responde a audio)
- `!radio <estación>` - Reproducir radio online
- `!playlist` - Gestionar playlist personal

### 📱 Comandos de Información
- `!whois <número>` - Información de usuario de WhatsApp
- `!checknum <número>` - Verificar si el número existe en WhatsApp
- `!groupinfo` - Información del grupo actual
- `!botinfo` - Información técnica del bot
- `!serverinfo` - Información del servidor

## ⚠️ Solución de Problemas

### Problemas Comunes

1. **El Código QR No Aparece**
   - Asegúrate de que tu terminal soporte renderizado de QR
   - Verifica tu conexión a internet
   - Intenta reiniciar el bot

2. **Problemas de Conexión**
   - Verifica tu conexión a internet
   - Asegúrate de que tu WhatsApp esté actualizado
   - Intenta eliminar la carpeta `sessions` y reconectar

3. **Dependencias Faltantes**
   - Ejecuta `npm install` nuevamente
   - Para procesamiento de medios, asegúrate de que ffmpeg esté instalado

4. **Error de Permisos**
   - En VPS/servidor: usa `sudo` para comandos de instalación
   - En Termux: asegúrate de tener permisos de almacenamiento

### Logs y Depuración

El bot guarda logs en la carpeta `logs/`. Puedes revisar:
- `error.log` - Errores del sistema
- `messages.log` - Registro de mensajes
- `commands.log` - Registro de comandos ejecutados

### ¿Sigues Teniendo Problemas?

Abre un issue en GitHub con:
- Información de tu sistema
- Logs de error
- Pasos para reproducir el problema

## 🔧 Desarrollo

### Estructura del Proyecto

```
whatsapp-bot-baileys/
├── config/              # Configuración
│   └── settings.js      # Configuración principal
├── lib/                 # Librerías principales
│   ├── database.js      # Gestión de base de datos
│   ├── functions.js     # Funciones principales
│   ├── loader.js        # Cargador de plugins
│   └── connect.js       # Conexión WhatsApp
├── plugins/             # Sistema de plugins
│   ├── public/          # Comandos públicos
│   ├── premium/         # Comandos premium
│   ├── admin/           # Comandos de administración
│   └── owner/           # Comandos de propietario
├── utils/               # Utilidades
│   ├── logger.js        # Sistema de logs
│   └── helper.js        # Funciones auxiliares
├── sessions/            # Sesiones de WhatsApp
├── temp/                # Archivos temporales
└── logs/                # Archivos de log
```

### Crear un Plugin

Crea un archivo en la carpeta correspondiente:

```javascript
// plugins/public/ejemplo.js
module.exports = {
    name: 'ejemplo',
    aliases: ['ej', 'test'],
    category: 'public',
    desc: 'Comando de ejemplo',
    premium: false,
    limit: false,
    
    async execute(sock, msg, args, metadata) {
        const response = 'Este es un comando de ejemplo!';
        
        await sock.sendMessage(metadata.from, { 
            text: response 
        });
    }
};
```

## 🌟 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Haz fork del repositorio
2. Crea tu rama de característica (`git checkout -b feature/nueva-caracteristica`)
3. Confirma tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Empuja a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🔗 Enlaces Útiles

- [Documentación de Baileys](https://github.com/WhiskeySockets/Baileys)
- [API de WhatsApp Web](https://web.whatsapp.com/)
- [Node.js](https://nodejs.org/)
- [Replit](https://replit.com/)

## 👤 Contacto

- WhatsApp: +1234567890
- Email: tu-email@ejemplo.com
- GitHub: [tuusuario](https://github.com/tuusuario)
- Canal de WhatsApp: [Canal del Bot](https://whatsapp.com/channel/ejemplo)

## 🙏 Agradecimientos

- [Baileys](https://github.com/WhiskeySockets/Baileys) por la librería increíble
- [GataBot](https://github.com/GataNina-Li/GataBot-MD) por la inspiración
- Comunidad de desarrolladores de WhatsApp bots

---

Hecho con ❤️ por [Tu Nombre]

> ⭐ ¡No olvides dar una estrella al repositorio si te gustó!
