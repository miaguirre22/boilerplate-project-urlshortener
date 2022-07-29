require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

const options = {
  all:true,
};
  
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
  const urlBody =  req.body.url
  const httpRegex = /^(http|https)(:\/\/)/

  if (!httpRegex.test(urlBody)) {
    return res.json({ error: 'invalid url' })
  }
  
  // Calling dns.lookup() for hostname
  //  geeksforgeeks.org and displaying
  // them in console as a callback
  const urlObject = new URL(urlBody)

  dns.lookup(urlObject.hostname, (error, address, family) => {
    if (error) reject({ error: 'invalid url' })
    console.log("dns lookup address: ", address)
  })
  
  const url = urls.find(url => url["original_url"] === urlBody)
  const regex = /^(http|https)(:\/\/)/
  
  console.log("urlBody:", urlBody,"regex: ", regex.test(urlBody))
  
  //if (!regex.test(urlBody)) 
    //return res.send({error: 'Invalid URL'})
  
  if (url) 
    return res.send(url)
  
  const newShortur = {"original_url": urlBody,"short_url": urls.length + 1}
  urls.push(newShortur)
  res.send(newShortur)
})
        
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
