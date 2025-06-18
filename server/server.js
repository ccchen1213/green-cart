import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import 'dotenv/config'
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

try {
  await connectDB();
  await connectCloudinary
  console.log('After DB, before middlewares');
} catch (error) {
  console.log('Connect database failed: ' + error);
}


// Allow multiple origins
const allowedOrigins = ['http://localhost:5173']

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
// app.use(cors({origin: allowedOrigins, credentials: true}))
app.use(cors({origin: true, credentials: true}))
console.log('After middlewares, before routes');

app.get('/', (req, res) => res.send('API is WORKING ^ ^'));
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})