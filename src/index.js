const http = require('http');
const express = require('express');
const morgan = require('morgan');
const path = require('path')
const handlebars = require('express-handlebars');
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.use(morgan('combined'))
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json())

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
  return res.render('home')
});
app.get('/news', (req, res) => {
  console.log("new", req.query)
  return res.render('news')
});

app.get('/search', (req, res) => {
  console.log(req.query)
  return res.render('search')
});

app.post('/search', (req, res) => {
  console.log(req.body)
  return res.render('search')
});
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});