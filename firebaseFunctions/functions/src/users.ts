import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// user
export const newUserSignup = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("users").doc(user.uid).set({
    id: user.uid,
    username: user.displayName,
    email: user.email,
    blogIdList: [],
    createdAt: user.metadata.creationTime,
  });
});

export const userDelete = functions.auth.user().onDelete((user) => {
  admin.firestore().collection("users").doc(user.uid).delete();
});
