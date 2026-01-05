require('dotenv').config()
const app = require('./app');

const PORT = process.env.PORT || 3000 // Puerto del servidor

app.listen(PORT, () => {}) // Iniciar el servidor