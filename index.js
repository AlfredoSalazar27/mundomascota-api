const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Error MongoDB:", err));

// RUTA PRINCIPAL
app.get('/', (req, res) => {
  res.json({ mensaje: "API Mundo Mascota funcionando!" });
});

// === USUARIOS ===
app.get('/usuarios', async (req, res) => {
  const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    nombre: String,
    correo: String,
    telefono: String,
    fotoUrl: String
  }));
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

app.post('/usuarios', async (req, res) => {
  const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    nombre: String,
    correo: String,
    telefono: String,
    fotoUrl: String
  }));
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.json({ mensaje: "Usuario registrado", usuario });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === COMPRAS ===
app.get('/compras', async (req, res) => {
  const Compra = mongoose.model('Compra', new mongoose.Schema({
    usuarioId: String,
    productos: String,
    total: Number,
    fecha: { type: Date, default: Date.now }
  }));
  const compras = await Compra.find().sort({ fecha: -1 });
  res.json(compras);
});

app.post('/compras', async (req, res) => {
  const Compra = mongoose.model('Compra', new mongoose.Schema({
    usuarioId: String,
    productos: String,
    total: Number,
    fecha: { type: Date, default: Date.now }
  }));
  try {
    const compra = new Compra(req.body);
    await compra.save();
    res.json({ mensaje: "Compra guardada", compra });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`);
});
