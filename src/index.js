const http = require('http');
const express = require('express');
const morgan = require('morgan');
const path = require('path')
const handlebars = require('express-handlebars');
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.use(morgan('combined'))
app.engine('hbs', handlebars({
  extname: '.hbs'
}))
app.set("view engine", 'hbs')
app.set('views', path.join(__dirname,'resources\\views'))
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, World!\n');
// });

app.get('/', (req, res) => {
  return res.render('news')
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});