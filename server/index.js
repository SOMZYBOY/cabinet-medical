
import express, { json as expressJSON, urlencoded, static as expressStatic } from 'express'; 
let app = express(); 
// import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();
import helmet from "helmet"; 
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit'; 
import { fileURLToPath } from 'url'; 
import { dirname, join } from 'path'; 
const __dirname = dirname(fileURLToPath(import.meta.url));
import { createStream } from 'rotating-file-stream';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileupload from 'express-fileupload'; 
import mongoose from 'mongoose';
import errorHandler from './middleware/errorHandler.js'; 
import corsOptions from './config/corsOptions.js'; 
import dbConnection from './config/dbConnect.js'; 
import router from './routes/api.js'; 
const PORT = process.env.PORT || 5003; 


app.use(helmet()); 

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter); 

let accessLogStream = createStream('access.log', {
    interval: '1d', // rotate daily
    path: join(__dirname, 'log/access')
});
app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status ":res[content-length] - :response-time ms" ":referrer" ":user-agent"', { stream: accessLogStream }));

dbConnection(); 

app.disable('x-powered-by'); 
app.use(expressJSON()); 
app.use(urlencoded({ extended: true })); 
// app.use(cors()); 
// app.use(cors({
//     origin: 'http://localhost:5174', 
//     credentials: true // Allow cookies to be sent
// })); 
app.use(cors(corsOptions)); 
app.use(cookieParser()); 
// app.options('*', cors(corsOptions)); 
app.use(fileupload({useTempFiles: true})); 

app.use('/', expressStatic(join(__dirname, 'public'))); 
app.use('/api', expressStatic(join(__dirname, 'public'))); 

app.use('/api/v1', router); 

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(join(__dirname, 'views', '404.ejs'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    };
}); 

app.use(errorHandler); 

mongoose.connection.once('open', () => {
    console.log('Database connection established');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
});