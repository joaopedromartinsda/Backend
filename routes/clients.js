const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all clients
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single client
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients WHERE client_id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create client
router.post('/', async (req, res) => {
  const { name, email, address } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO clients (name, email, address) VALUES ($1, $2, $3) RETURNING client_id',
      [name, email, address]
    );
    res.status(201).json({
      client_id: result.rows[0].client_id,
      message: 'Cliente criado com sucesso'
    });
  } catch (error) {
    if (error.code === '23505') { // código de erro para UNIQUE VIOLATION no Postgres
      res.status(409).json({ error: 'Email já cadastrado' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// PUT update client
router.put('/:id', async (req, res) => {
  const { name, email, address } = req.body;
  try {
    const result = await pool.query(
      'UPDATE clients SET name = $1, email = $2, address = $3 WHERE client_id = $4',
      [name, email, address, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE client
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM clients WHERE client_id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
