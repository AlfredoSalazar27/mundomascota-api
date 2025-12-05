const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // para fotos grandes

// CONECTAR A MONGODB ATLAS
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas conectado'))
  .catch(err => console.log('Error de conexión:', err));

// === MODELO USUARIO (CON TODOS TUS CAMPOS + usuario + contrasena) ===
const usuarioSchema = new mongoose.Schema({
  cedula: { type: String, unique: true, required: true },
  usuario: { type: String, unique: true, required: true },
  nombre: { type: String, required: true },
  primerApellido: String,
  segundoApellido: String,
  fechaNacimiento: String,
  correo: { type: String, unique: true, required: true },
  telefono: String,
  provincia: String,
  canton: String,
  distrito: String,
  direccion: String,
  fotoPerfil: { type: String, default: "" },
  contrasena: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// === RUTAS CRUD ===

// CREATE - Registrar usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json({ success: true, usuario });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// READ - Buscar por cédula
app.get('/api/usuarios/:cedula', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ cedula: req.params.cedula });
    if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, usuario });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// READ ALL - Todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json({ success: true, usuarios });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// LOGIN - Verificar usuario y contraseña
app.post('/api/login', async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    const user = await Usuario.findOne({ usuario, contrasena });
    if (!user) return res.status(401).json({ success: false, message: "Usuario o contraseña incorrecta" });
    res.json({ success: true, usuario: user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// RUTA DE PRUEBA
app.get('/', (req, res) => {
  res.json({ mensaje: "API Mundo Mascota funcionando correctamente!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Mundo Mascota corriendo en puerto ${PORT}`);
});
