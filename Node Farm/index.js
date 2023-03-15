const fs = require('fs');
const http = require('http');
const url = require('url');
/////////////////////////////////////////////////////// SERVER ///////////////////////////////////////////////////////////////////////////////

const replaceTemplate=function(temp,product){
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}


const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req,res) => {
    const {query,pathname} = url.parse(req.url,true); // true because of query that is present in the string to parse it.(parse the query into the object)

    // Overview Page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{ 'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard,el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    }else if(pathname === '/product')
    {
        res.writeHead(200, {'content-type':'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct,product);
        res.end(output);
    }else if(pathname === '/api'){
        res.writeHead(200,{ 'Content-type': 'application/json'});
        res.end(data);
    }else{
        res.writeHead(404,
            {
                'Content-type':'textt/html',
                'my-own-header':'hello-world'
            });
        res.end('<h1>Page not Found!<h1>');
    }
});

server.listen(8000,'127.0.0.1',() => {
    console.log('Listening to port 8000');
});