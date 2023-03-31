let express = require ('express');

function start() {
	let app = express();

	app.use(express.static(__dirname ));

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html')
	});



	//I use this to manually change the port when it is being deployed sometimes
	let port = 8081;


	let server = app.listen(port);

	console.log("Server has started");
}
start();
