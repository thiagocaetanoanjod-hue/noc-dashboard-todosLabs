// src/routes/frotaRoutes.js
import express from 'express';
import frotaController from '../controllers/frotaController.js';

const router = express.Router();

router.get('/', frotaController.listar);
router.get('/:id', frotaController.buscarDetalhes);
router.post('/', frotaController.registrar);
router.put('/:id', frotaController.atualizarTelemetria);
router.delete('/:id', frotaController.remover);

export default router;
