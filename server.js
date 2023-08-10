const fs = require("fs");
const http = require("http");
const url = require('url');

const port = 8000;

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%IMAGE%}/g, product.image);

  return output;
};

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
  const pathName = req.url;

  // ? --- oveview page --- ? //
  if(pathName === '/' || pathName === '/overview'){
    res.writeHead(200, { 'Content-type': 'text/html' })

    const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el));
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
    
    res.end(output);


    // ? --- product page --- ? //
  }else if (pathName === '/product'){
    res.end('this is the PRODUCT');


    // ? --- api page --- ? //
  }else if (pathName === '/api'){
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data)


    // ? --- not found --- ? //
  }else{
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'tanga maling url'
    });
    res.end('<h1>Page not found</h1>');
  };

});

server.listen(port,'localhost', () => {
  console.log(`listening on port ${port}`)
})