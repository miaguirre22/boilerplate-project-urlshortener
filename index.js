require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

let urls = []

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:id', function(req, res) {
  const {id: idStr} = req.params
  const id = parseInt(idStr, 10)
  const url = urls.find(url => url["short_url"] === id)
  
  if (!url) {
    return res.send({"error":"No short URL found for the given input"})
  }
  
  res.redirect(url["original_url"])    
})

app.post('/api/shorturl', function(req, res) {
  const {url: urlBody} = req.body
  const url = urls.find(url => url["original_url"] === urlBody)
  
  if (url) {
    return res.send(url)
  }

  const newShortur = {"original_url": urlBody,"short_url": urls.length + 1}
  urls.push(newShortur)
  res.send(newShortur)
})
        
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
