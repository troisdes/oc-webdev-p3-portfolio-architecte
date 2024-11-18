// Import des modules nécessaires
const http = require('http');
const app = require('./app');

// Fonction pour normaliser le port
// Convertit la valeur en nombre et vérifie sa validité
const normalizePort = val => {
	const port = parseInt(val, 10);

	if (isNaN(port))
	{
		return val;
	}
	if (port >= 0)
	{
		return port;
	}
	return false;
};
// Définition du port en utilisant soit la variable d'environnement PORT, soit 5678
const port = normalizePort(process.env.PORT || '5678');
app.set('port', port);

// Gestionnaire d'erreurs pour le serveur
const errorHandler = error => {
	if (error.syscall !== 'listen')
	{
		throw error;
	}
	const address = server.address();
	// Formatage du message d'erreur selon le type d'adresse
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	switch (error.code)
	{
		case 'EACCES':
			// Erreur : privilèges insuffisants
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			// Erreur : port déjà utilisé
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// Création du serveur HTTP
const server = http.createServer(app);

// Gestion des événements du serveur
server.on('error', errorHandler);
server.on('listening', () => {
	const address = server.address();
	// Formatage du message de démarrage
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

// Démarrage du serveur sur le port configuré
server.listen(port);

