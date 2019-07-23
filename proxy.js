const request = require('request');
const express = require('express');
const path = require('path');

const app = express();

const proxyTable = {
  '/wcf': {
    target: 'http://localhost/wcf' 
  }
};



app.use('/', function(req, res) {
  const url = req.url;
  const proxy = Object.keys(proxyTable);
  let not_found = true; 
  for (let index = 0; index < proxy.length; index++) {
    const k = proxy[index];
    const i = url.indexOf(k);
    if (i >= 0) {     
      not_found = false;
      const element = proxyTable[k];
      const newUrl = element.target + url.slice(i+k.length);
      req.pipe(request({url: newUrl, timeout: 60000},(err)=>{
        if(err){
          console.log('error_url: ', err.code,url);
          res.status(500).send('');
        }     
      })).pipe(res);
      break;
    } 
  }
  if(not_found) {
    console.log('not_found_url: ', url);
    res.status(404).send('Not found');
  } else {
    console.log('proxy_url: ', url);
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log('HTTP Server is running on: http://localhost:%s', PORT);
});