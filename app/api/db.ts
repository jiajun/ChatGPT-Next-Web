// import mysql from "serverless-mysql";
// const db = mysql({
//   config: {
//     host: "jiajun-ubuntu",
//     port: 3306,
//     database: "bloghome3",
//     user: "root",
//     password: "root",
//   },
// });

// export default async function excuteQuery({ query, values }) {
//   try {
//     const results = await db.query(query, values);
//     await db.end();
//     return results;
//   } catch (error) {
//     return { error };
//   }
// }
import mysql from "mysql";

const pool = mysql.createPool({
  host: "192.168.17.139",
  port: 3306,
  database: "bloghome3",
  user: "root",
  password: "root",
});

export async function excuteQuery(sql: string) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject(err);
      } else {
        conn.query(sql, function (err, rows, fields) {
          //释放连接
          conn.release();
          //传递Promise回调对象
          resolve({ err: err, rows: rows, fields: fields });
        });
      }
    });
  });
}
