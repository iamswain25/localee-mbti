import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();
export const share = functions
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    const { id = "trump" } = req.query;
    const data = await db
      .collection("profile")
      .doc(id)
      .get();
    const counter: number = data.get("counter");
    const name: string = data.get("name");
    const title = `${name}의 성격을 맞춰보세요`;
    const desc = `${String(counter)}명이 참여하였습니다.`;
    res.status(200).send(`<!doctype html>
    <head>
      <title>${title}</title>
      <meta property="og:image" content="http://example.com/rock.jpg" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${desc}" />
      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content="${title}" />
      <meta property="twitter:description" content="${desc}" />
      <meta property="twitter:creator" content="iamswain" />
      <meta property="keywords" content="politics,survery,mbti,personality" />
    </head>
    <script>
      window.location.replace("https://iamswain.tech/${id}");
    </script>
  </html>`);
  });
