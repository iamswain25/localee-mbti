import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const db = admin.firestore();
type Profile = {
  gender: string;
  counter: number;
  link: string;
  name: string;
  createdAt: admin.firestore.Timestamp;
  [any: string]: any;
};
export const selectionList = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    return db
      .collection("profile")
      .orderBy("counter")
      .limit(10)
      .get()
      .then(res => res.docs)
      .then(res => res.map(d => <Profile>d.data()))
      .then(res =>
        res.map(({ counter, gender, link, name, createdAt }) => ({
          counter,
          gender,
          link,
          name,
          createdAt: createdAt.toDate().toString()
        }))
      );
  });
