import express from 'express';
import url from 'url';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import './db/dbConnect.js';

const app = express();
const PORTA = process.env.PORTA || 3000;

const caminhoAtual = url.fileURLToPath(import.meta.url);
const diretorioPublico = path.join(caminhoAtual, '../..', 'public');
app.use(express.static(diretorioPublico));

const servidorHttp = http.createServer(app);

servidorHttp.listen(3000, () =>
  console.log(`Servidor escutando na porta ${PORTA}`)
);

const io = new Server(servidorHttp);

export default io;
