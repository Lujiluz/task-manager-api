import './config/index.js';
import { startServer } from './infrastructure/http/server.js';

startServer().catch(err => {
    console.error('Fatal startup error: ', err)
    process.exit(1)
});
