// src/server.js
import express from 'express';
import cors from 'cors';
import frotaRoutes from './routes/frotaRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/frota', frotaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor operando em http://localhost:${PORT}`);
});
