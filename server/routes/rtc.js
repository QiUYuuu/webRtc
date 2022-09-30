const express = require('express');
const router = express.Router(null);

router.post('/test', async (req, res) => {
    res.json('1111111111111111111111111');
});

router.get('/test', async (req, res) => {
    res.json('1111111111111111111111111');
});

module.exports = router;
