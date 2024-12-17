import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import authentificationRoute from './routes/authentificationRoute';
import expenseTrackingRoute from './routes/expenseTrackingRoute';
const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/authentification', authentificationRoute);
app.use('/api/expenseTracking', expenseTrackingRoute);

mongoose.connect('mongodb://localhost:27017/ExpenseHive');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

app.listen(3001, () => console.log(`Listening on port 3001`));