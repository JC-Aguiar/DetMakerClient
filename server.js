const express = require('express');
const path = require('path');
const port = 3000; //ou usar {process.env.PORT}
const app = express();

//Configura o diretório de build da aplicação Ionic React
const buildPath = path.join(__dirname, '.');

//Disponibiliza os arquivos estáticos da aplicação
//app.use(express.static(buildPath));
//app.use('/public', express.static(path.join(__dirname, '/public')));
//app.use(express.static(path.join(__dirname, "public")));

// Rota de fallback para direcionar todas as outras rotas para o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.', '/public/index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});