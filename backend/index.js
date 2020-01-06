const http = require('http');
const requests = require('./do.js');
const PORT = 8119;

const server = http.createServer(function (request,response) {
	let answer;
	switch (request.method) {
		case 'GET':
			answer = requests.doGet(request,response);
			break;
		case 'POST':
			answer = requests.doPost(request,response);
			break;
		default:
			response.status = 400;
			break;
	}
	//response.end();
}).listen(PORT);