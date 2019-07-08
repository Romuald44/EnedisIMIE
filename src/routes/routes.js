// Import des différents modules
var express = require('express');
let querystring = require('querystring');
var bodyParser = require('body-parser');

// Instanciation d'express via la variable 'app'
var app = express();

// moteur de rendu / extension de rendu => ejs
app.set('views','./views');
app.set('view engine', 'ejs');

// Utilisation du dossier 'public' ou se trouvera les fichiers communs (images,css,js)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

// l'appel de la page racine (127.0.0.1:8080) affichera la page login(.ejs)
app.get('/', function(req, res) {
    res.render('dashboard');
})

app.listen(8080);