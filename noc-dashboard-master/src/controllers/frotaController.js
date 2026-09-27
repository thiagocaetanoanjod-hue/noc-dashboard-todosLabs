// src/controllers/frotaController.js
import frotaRepository from '../repositories/frotaRepository.js';

class FrotaController {
  async listar(req, res) {
    try {
      // O controlador solicita apenas 500 veículos aleatórios dos 100.000 disponíveis
      const veiculos = await frotaRepository.listarTodos(500);
      return res.status(200).json(veiculos);
    } catch {
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  }

  async buscarDetalhes(req, res) {
    try {
      const veiculo = await frotaRepository.buscarPorId(req.params.id);

      if (!veiculo) {
        return res.status(404).json({ mensagem: 'Veículo não encontrado.' });
      }
      return res.status(200).json(veiculo);
    } catch {
      return res.status(500).json({ erro: 'Falha na busca.' });
    }
  }

  async registrar(req, res) {
    try {
      if (!req.body.id || !req.body.tipo) {
        return res.status(400).json({ erro: 'ID e Tipo são obrigatórios.' });
      }
      const novoVeiculo = await frotaRepository.criar(req.body);
      return res.status(201).json(novoVeiculo);
    } catch {
      return res.status(500).json({ erro: 'Erro ao inserir. ID duplicado?' });
    }
  }

  async atualizarTelemetria(req, res) {
    try {
      const linhasAfetadas = await frotaRepository.atualizar(req.params.id, req.body);
      if (linhasAfetadas === 0) {
        return res.status(404).json({ mensagem: 'Veículo inexistente.' });
      }
      return res.status(200).json({ mensagem: 'Telemetria atualizada.' });
    } catch {
      return res.status(500).json({ erro: 'Erro no Update SQL.' });
    }
  }

  async remover(req, res) {
    try {
      const linhasAfetadas = await frotaRepository.deletar(req.params.id);
      if (linhasAfetadas === 0) {
        return res.status(404).json({ mensagem: 'Veículo inexistente.' });
      }
      return res.status(204).send();
    } catch {
      return res.status(500).json({ erro: 'Falha ao deletar.' });
    }
  }
}

export default new FrotaController();
