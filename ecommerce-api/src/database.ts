import mongoose from 'mongoose';
import { DATABASE_URL } from './config';

mongoose.connect(`${DATABASE_URL!}`)
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error('Error connecting to the database: ', err));
