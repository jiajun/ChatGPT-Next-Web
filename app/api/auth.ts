import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";
import { ACCESS_CODE_PREFIX } from "../constant";

function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

// function parseApiKey(bearToken: string) {
//   console.log("auth.ts: bearToken: " + bearToken);
//   const token = bearToken.trim().replaceAll("Bearer ", "").trim();
//   const isOpenAiKey = !token.startsWith(ACCESS_CODE_PREFIX);

//   const authStrs = isOpenAiKey
//     ? []
//     : token.slice(ACCESS_CODE_PREFIX.length).split("||");

//   return {
//     userName: isOpenAiKey ? "" : authStrs[0],
//     accessCode: isOpenAiKey ? "" : authStrs[1],
//     apiKey: isOpenAiKey ? token : "",
//   };
// }

const clientCode = process.env.CLIENT_CODE;

// async function excuteQuery(query: string, values: Array<any>) {
//   try {
//     const db = await mysql({
//       config: {
//         host: "192.168.17.139",
//         port: 3306,
//         database: "bloghome3",
//         user: "root",
//         password: "root",
//       },
//     });

//     console.log("[db.config]", db.getConfig());
//     const results = await db.query(query, values);
//     await db.end();
//     return results;
//   } catch (error) {
//     return { error };
//   }
// }

export async function auth(req: NextRequest) {
  const authToken = req.headers.get("Authorization") ?? "";

  // check if it is openai api key or user token
  // const { userName, accessCode, apiKey: token } = parseApiKey(authToken);

  // const hashedCode = md5.hash(accessCode ?? "").trim();

  const serverConfig = getServerSideConfig();
  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  // console.log("[Auth] got access code:", accessCode);
  // console.log("[Auth] hashed access code:", accessCode);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());
  console.log("[clientCode]", clientCode);
  // console.log("[userName]", userName);

  if (authToken) {
    const results = await (
      await fetch("http://127.0.0.1:7001/uac/auth/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      })
    ).json();

    console.log("results: ", results);

    if (results.error == true) {
      return results;
    } else {
      return {
        error: false,
      };
    }
  } else {
    return {
      error: true,
    };
  }
}
