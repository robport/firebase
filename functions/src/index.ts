import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
import {Mongo} from "./mongo";
import {Post} from "./post.model";

admin.initializeApp();
const m = new Mongo();

export const getPosts = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Get Posts!");

  try {
    await m.connect();
    const posts = await m.getPosts();

    let ret = '<ul>';
    posts.forEach((post: Post) => {
      ret += `<li>${post.title}</li>`
    })
    ret += '</ul>';
    response.status(200).send(ret);
  } catch (err) {
    console.log('Err' + err.message);
    response.status(500);
  }
});

export const getTodos = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Get Todos from Firestore!");

  try {

    const db = admin.firestore();
    const todosRef = db.collection('Todos');

    const todos = await todosRef.get();
    if (todos.empty) {
      response.send('No matching documents.');
      return;
    }

    let ret = '<ul>';
    todos.forEach(doc => {
      ret += `<li>${doc.data().title}</li>`
    })
    ret += '</ul>';
    response.status(200).send(ret);
  } catch (err) {
    console.log('Err' + err.message);
    response.status(500);
  }

});
