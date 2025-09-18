import express from 'express';
const app = express();
app.use(express.json());

app.get('/hello', (req, res) => {
  res.send('Hola FC DESCANSDA!');
});

export default app;
