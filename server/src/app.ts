import express = require('express');
import bodyParser = require('body-parser');
import _ = require('lodash');
import path = require('path');
import querystring = require('querystring');
import WebSocket = require('ws');

interface Session {
    id: string;
    messages: Message[];
    clientName: string;
    connection: WebSocket;
}

interface Message {
    date: Date;
    text: string;
    sender: string;
}

interface SendMessageRequest extends express.Request {
    body: {
        sessionId: string;
        sender: string;
        message: string;
    }
}


const sessionRepo: Session[] = [];

const expressApp = express();

expressApp.use(bodyParser.json());

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function createSession(clientName: string, connection: WebSocket) {
    const sessionId = generateUniqueId();
    const session: Session = {
        id: sessionId,
        messages: [],
        clientName,
        connection
    };
    sessionRepo.push(session);
    return session;
}

function getSession(id: string) {
    return _.find(sessionRepo, x => x.id === id);
}

function listSessions() {
    return _.map(sessionRepo, x => {
        return {
            id: x.id,
            clientName: x.clientName,
            messages: x.messages
        };
    });
}

function deleteSession(sessionId: string) {
    const sessionIndex = _.findIndex(sessionRepo, x => x.id === sessionId);
    sessionRepo.splice(sessionIndex);
}

// Retrieve all new sessions
expressApp.get('/session', (req, res) => {
    try {
        res.send(listSessions());
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

expressApp.post('/session/message', (req: SendMessageRequest, res) => {
    try {
        const session = getSession(req.body.sessionId);
        const message = {
            date: new Date(),
            sender: req.body.sender,
            text: req.body.message
        };
        session.messages.push(message);
        session.connection.send(JSON.stringify(message));
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

expressApp.use(express.static(path.join(__dirname, '../../client')));

// Serve agent view
expressApp.get('/agent', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/src/agent/agent.view.html'));
});

// Serve user view
expressApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/src/user/user.view.html'));
});


const expressPort = 7000;
expressApp.listen(expressPort, () => {
    console.log('Chat.Express' ,'Listening on port: ' + expressPort);
});

const wssPort = 7001;
const webSocketServer = new WebSocket.Server({ port: wssPort });

webSocketServer.on('listening', () => {
    console.log('Chat.WSS', 'Listening on port: ' + wssPort)
});

webSocketServer.on('connection', (ws, req) => {
    try {
        const strippedPath = req.url.replace('/?', '');
        const name = querystring.parse(strippedPath)['name'] as string;
        console.log('Chat.WSS', 'New connection from ' + name);

        const sessionId = querystring.parse(strippedPath)['sessionId'] as string;
        const session = sessionId ? getSession(sessionId) : createSession(name, ws);
        if (!session) {
            throw new Error('Session could not be retrieved');
        }
    } catch (e) {
        console.log(e);
    }
});