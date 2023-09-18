import mysql from "serverless-mysql";
const db = mysql({
  config: {
    host: "jiajun-ubuntu",
    port: 3306,
    database: "bloghome3",
    user: "root",
    password: "root",
  },
});

export default async function excuteQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}
