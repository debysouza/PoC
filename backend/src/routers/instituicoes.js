// Rotas para o CRUD de Instituições
const express = require('express')
const router = new express.Router()
const Instituicoes = require('../models/Instituicoes')

// Lista todas as Instituições
router.get('/', async (req, res) => {

    const list = await Instituicoes.find({})
    res.status(200).send(list)

})

module.exports = router