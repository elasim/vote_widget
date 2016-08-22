import http from 'http';
import configure from './configure';

const app = configure();

const httpPort = process.env.PORT || 8000;
const httpServer = http.createServer(app);

httpServer.listen(httpPort);
