require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');

const app = express();
const porta = process.env.PORT || 3000;

// Configuração CORS
app.use(cors());

// Configuração Multer
const upload = multer({ dest: 'uploads/' });

// Rota para ler PDF
app.post('/ler', upload.single('arquivo'), async (req, res) => {
  try {
    const arquivo = req.file;
    if (!arquivo) {
      return res.status(400).json({ erro: 'Arquivo PDF necessário!' });
    }

    const dataBuffer = fs.readFileSync(arquivo.path);
    const data = await pdfParse(dataBuffer);

    fs.unlinkSync(arquivo.path); // remove o arquivo temporário

    res.json({ texto: data.text.trim() });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao ler o PDF.', detalhes: error.message });
  }
});

app.listen(porta, () => {
  console.log(`API rodando em http://localhost:${porta}`);
});
