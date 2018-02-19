let express = require('express')
let bodyParser = require('body-parser')
let http = require('http')
let request = require('request')
let cheerio = require('cheerio')

const server = express()

server.use(bodyParser.urlencoded({
    extended: true
}))

server.use(bodyParser.json())

server.get('/', function (req, res) {
    res.send('Hola')
})

server.post('/search-phones/:phone', function(req,res) {
    let info = ''
    let phone_to_search = req.params.phone;
    console.log(req.body.result)
    let reqUrl = encodeURI('https://www.gsmarena.com/res.php3?sSearch='+phone_to_search)
    console.log(reqUrl)
    let data = []
    request(reqUrl, function (error, response, html) {
    
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            
            $('.makers ul li a').each(function (i, element) {
                var name = $(this).text();
                var a = $(this).attr('href');
                var image = $(this).children().attr('src')
                
                
                var metadata = {
                    phone: name,
                    link: 'https://www.gsmarena.com/'+a,
                    image: image
                    
                };
      
                data.push(metadata)
                  
              });
             
              data = JSON.stringify(data)
              console.log(data)
              res.send(data)
              //console.log(data)
             
          }
})

})

server.listen((process.env.PORT || 8011 ), function() {
    console.log('.....And we\'re live...')
})