import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Answer, NumberType } from "./Answer";
const db = admin.firestore();
function sanitizeGender(rest: Answer, gender: "M" | "F") {
  const scores: NumberType = {};
  for (const key in rest) {
    switch (key) {
      case "T(M)":
      case "T(F)":
        if (key.indexOf(gender, 1) >= 0) {
          scores.T = rest[key]!;
        }
        break;
      case "F(M)":
      case "F(F)":
        if (key.indexOf(gender, 1) >= 0) {
          scores.F = rest[key]!;
        }
        break;
      default:
        scores[key] = rest[key];
    }
  }
  const { E = 0, I = 0, S = 0, N = 0, J = 0, P = 0, T = 0, F = 0 } = scores;
  // console.log(scores, { E, I, S, N, J, P, T, F });
  return { E, I, S, N, J, P, T, F };
}
function whatMBTI(ans: NumberType) {
  const { E = 0, I = 0, S = 0, N = 0, J = 0, P = 0, T = 0, F = 0 } = ans;
  const result = [];
  result.push(E >= I ? "E" : "I");
  result.push(S > N ? "S" : "N");
  result.push(T > F ? "T" : "F");
  result.push(J >= P ? "J" : "P");
  const mbti = result.join("");
  return mbti;
}
function normalizeToPercentage(bigdata: NumberType) {
  // console.log(bigdata);
  const { E = 0, I = 0, S = 0, N = 0, J = 0, P = 0, T = 0, F = 0 } = bigdata;
  // console.log({ E, I, S, N, J, P, T, F });
  const EI = E + I;
  const SN = S + N;
  const JP = J + P;
  const TF = T + F;
  const percentage = {
    E: (E / EI) * 100 || 0,
    I: (I / EI) * 100 || 0,
    S: (S / SN) * 100 || 0,
    N: (N / SN) * 100 || 0,
    J: (J / JP) * 100 || 0,
    P: (P / JP) * 100 || 0,
    T: (T / TF) * 100 || 0,
    F: (F / TF) * 100 || 0
  };
  // console.log(percentage);
  return percentage;
}

const PROFILE_COL = db.collection("profile");
const ANSWERS_COL = db.collection("answers");

export const answersCall = functions
  .region("asia-northeast1")
  .https.onCall(async data => {
    const { id, docId, ...rawScores } = data;
    const profileSnapshot = await PROFILE_COL.doc(id).get();
    const { counter, gender, ...restBigdata } = <any>profileSnapshot.data();
    const sanitized: NumberType = sanitizeGender(rawScores, gender);
    const firescore: { [key: string]: admin.firestore.FieldValue } = {};
    for (const key in sanitized) {
      firescore[key] = admin.firestore.FieldValue.increment(sanitized[key]);
    }
    firescore.counter = admin.firestore.FieldValue.increment(1);
    firescore.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    const myResult = whatMBTI(sanitized);
    const mbti = whatMBTI(restBigdata);
    const totalDetail = normalizeToPercentage(restBigdata);
    const mineDetail = normalizeToPercentage(sanitized);
    const total = { counter, mbti, detail: totalDetail };
    const mine = { mbti: myResult, detail: mineDetail };
    return Promise.all([
      PROFILE_COL.doc(id).update(firescore),
      ANSWERS_COL.doc(docId).update({ complete: true, updatedAt: new Date() })
    ]).then(() => ({ total, mine, date: new Date().toString() }));
  });
