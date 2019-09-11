import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { get8Questions } from "./questionsIndex";
const db = admin.firestore();
export const questionsCall = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    // corsHandler(request, response, () => {
    const eightQ = get8Questions();
    const resArr = await Promise.all([
      db
        .collection("profile")
        .doc(data.name)
        .update({ enterCounter: admin.firestore.FieldValue.increment(1) }),
      db.collection("answers").add({
        createdAt: new Date(),
        updatedAt: new Date(),
        profileId: data.name,
        photoLink: data.link,
        questions: eightQ,
        req: context.rawRequest.headers || null
      })
    ]);
    return Promise.all(
      eightQ.map(n =>
        db
          .collection("questions")
          // .where("index", "==", n)
          .doc(String(n))
          .get()
      )
    )
      .then(arr => arr.map(o => o.data()))
      .then(arr => {
        arr.map(o => o!.answers.sort(() => Math.random() - 0.5));
        return { questions: arr, answersDocId: resArr[1].id };
      });
  });
