import './config'; // must be first — loads and validates env vars before anything else
import { startServer } from './infrastructure/http/server';

startServer();
