import * as http from 'http';
import * as net from 'net';

function pingGoogle(): Promise<boolean> {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        const host = 'google.com';
        const port = 80;
        const timeout = 5000; // 5 seconds timeout

        socket.setTimeout(timeout);
        
        socket.on('connect', () => {
            console.log('Successfully connected to Google');
            resolve(true);
            socket.destroy();
        });

        socket.on('timeout', () => {
            console.log('Connection timed out');
            resolve(false);
            socket.destroy();
        });

        socket.on('error', (err) => {
            console.log('Connection error:', err.message);
            resolve(false);
            socket.destroy();
        });

        socket.connect(port, host);
    });
}

pingGoogle().then((result) => {
    console.log('Ping result:', result ? 'Success' : 'Failed');
});

const server = http.createServer((req, res) => {
    if (req.url === '/hello' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello, world!' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
