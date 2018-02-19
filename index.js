let express = require('express')
let bodyParser = require('body-parser')
let http = require('http')
let request = require('request')
let cheerio = require('cheerio')
let firebase = require('firebase/app')
               require('firebase/firestore')

    let config = {
    apiKey: "AIzaSyBmkcuv__YHDjIqZtaO8Or7tVAWmkxRE58",
    authDomain: "phonebotalpha.firebaseapp.com",
    databaseURL: "https://phonebotalpha.firebaseio.com",
    projectId: "phonebotalpha",
    storageBucket: "phonebotalpha.appspot.com",
    messagingSenderId: "661337425451"
    }

const server = express()

server.use(bodyParser.urlencoded({
    extended: true
}))

server.use(bodyParser.json())

firebase.initializeApp(config);

server.get('/', function (req, res) {
    
    res.send('S\'up Dawg')
    
})

server.post('/save-phones/:phone', function(req,res) {
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
      
                //data.push(metadata)
                firebase.firestore().collection('phones').doc(metadata.phone).set(metadata)
                    .then( doc => {
                        console.log(doc.id)
                    }).then( function () {
                        res.send('Done')
                        return 'Done did it'
                    })
              });
             
             // data = JSON.stringify(data)
            //  console.log(data)
               
 
             // res.send(metadata)
              //console.log(data)
             
          }
         // console.log(data[0])
         
})


})



server.post('/find-phones/:phone', function (req, res) {
    let phone_to_find = req.params.phone;
    phone_to_find = phone_to_find.replace(/\+/g, " ")
    console.log('Find '+phone_to_find)
    firebase.firestore().collection('phones').doc(phone_to_find).get()
        .then( doc => {
            console.log(  )
            res.send(doc.data())
            return
        })
})

server.listen((process.env.PORT || 8011 ), function() {
    console.log('.....And we\'re live...')
})