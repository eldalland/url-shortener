require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
app.use(express.urlencoded({extended:true}))
//objet to store new url
let urlData = {};
//reveive posted url
app.post("/api/shorturl",(req,res)=>{
  const url = req.body.url;
  //separate hostname
  let hostname = new URL(url).hostname;
  //validate hostname
  dns.lookup(hostname, (err)=>{
    if(err){
      return res.json({error:"invalid url"})
    }
    //create shortened url
    let newURL = Math.random().toString(36).substring(2,8)
    //store new url with old url address
    urlData[newURL] = url;
    //return json with url info
    res.json({ original_url : url, short_url : newURL})

  })

})
//when new url is entered, redirect to original url
app.get(`/api/shorturl/:newURL`, (req, res)=>{
  if(urlData[req.params.newURL])
    console.log(urlData[req.params])
    return res.redirect(urlData[req.params.newURL]);
})