const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server);
const path = require('path');

app.use(express.static(path.join(__dirname,'./public')));

mongoose.connect("mongodb+srv://admin-agp:17JE003089@cluster0.8vdgl.mongodb.net/friendChatDB", { useUnifiedTopology: true }, { useNewUrlParser: true });

const chatSchema = {
	Mess: String
};

const Chat = mongoose.model("Chat", chatSchema);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

var name;

io.on('connection', (socket) => {
	console.log('new user connected');

	socket.on('joining msg', (username) => {
		name = username;
		io.emit('chat message', `${name} has joined the chat`);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
		io.emit('chat message', `${name} has left the chat`);
	});

	socket.on('chat message', (msg) => {
		socket.broadcast.emit('chat message', msg);
		//console.log(msg);
		const chat = new Chat({
			Mess: msg
		});
		chat.save();
	});
});

server.listen(process.env.PORT || 8080, () => {
	console.log('server is running at port 8080');
});