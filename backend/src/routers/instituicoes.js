// Rotas para o CRUD de Instituições
const express = require('express')
const router = new express.Router()
const Instituicoes = require('../models/Instituicoes')

// Lista todas as Instituições, ordenadas por UF
router.get('/', async (req, res) => {
    try {
        const list = await Instituicoes.find({}).sort({ uf: 1 });
        res.status(200).send(list);
    } catch (error) {
        res.status(500).send({ error: "Erro ao buscar instituições" });
    }
});

// Cria uma nova Instituição
router.post("/", async (req, res) => {
    try {
        const instituicao = await Instituicoes(req.body).save();
        res.status(201).send(instituicao);
    } catch (error) {
        res.status(400).send({ error: "Erro ao salvar instituição" });
    }
});

// Atualiza uma Instituição existente
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const instituicao = await Instituicoes.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!instituicao) {
            return res.status(404).send({ error: "Instituição não encontrada" });
        }
        res.status(200).send(instituicao);
    } catch (error) {
        res.status(400).send({ error: "Erro ao atualizar instituição" });
    }
});

// Exclui uma Instituição
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const instituicao = await Instituicoes.findByIdAndDelete(id);
        if (!instituicao) {
            return res.status(404).send({ error: "Instituição não encontrada" });
        }
        res.status(200).send({ message: "Instituição excluída com sucesso" });
    } catch (error) {
        res.status(400).send({ error: "Erro ao excluir instituição" });
    }
});

// Rota para obter quantidade total de alunos por UF, ordenada pelo total de alunos
router.get('/uf-alunos', async (req, res) => {
    try {
        const data = await Instituicoes.aggregate([
            { $group: { _id: "$uf", totalAlunos: { $sum: "$qtdAlunos" } } },
            { $sort: { totalAlunos: 1 } },
        ]);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ error: "Erro ao buscar dados agregados" });
    }
});

// Verificar se a instituição já existe pelo nome e UF
router.get('/exists', async (req, res) => {
    const { nome, uf } = req.query;
    if (!nome || !uf) {
        return res.status(400).send({ error: "Parâmetros inválidos." });
    }
    try {
        const instituicao = await Instituicoes.findOne({ nome, uf });
        if (instituicao) {
            return res.status(200).send({ exists: true });
        } else {
            return res.status(200).send({ exists: false });
        }
    } catch (error) {
        console.error("Erro ao verificar instituição:", error);
        res.status(500).send({ error: "Erro ao verificar instituição." });
    }
});

module.exports = router