import {ObjectID} from 'mongodb';

export interface Post {
  id: ObjectID;
  title: string;
  description: string;
  author: string;
  body: string;
  date_posted: Date;
}
