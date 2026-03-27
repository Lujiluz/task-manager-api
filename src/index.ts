import './config';
import { startServer } from './infrastructure/http/server';

startServer().catch(err => {
    console.error('Fatal startup error: ', err)
    process.exit(1)
});
