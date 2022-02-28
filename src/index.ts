import * as functions from "firebase-functions";
import { createUserHandler } from "./createUser";
import { getProfileHandler } from "./getProfile";
import { notifyNewCommentHandler } from "./notifyNewComment";


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const notifyNewComment = functions.https.onRequest(notifyNewCommentHandler);

export const createUser = functions.https.onRequest(createUserHandler)

export const getProfile = functions.https.onRequest(getProfileHandler)

