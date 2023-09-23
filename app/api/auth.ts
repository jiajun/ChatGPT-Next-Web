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

function parseApiKey(bearToken: string) {
  console.log("auth.ts: bearToken: " + bearToken);
  const token = bearToken.trim().replaceAll("Bearer ", "").trim();
  const isOpenAiKey = !token.startsWith(ACCESS_CODE_PREFIX);

  const authStrs = isOpenAiKey
    ? []
    : token.slice(ACCESS_CODE_PREFIX.length).split("||");

  return {
    userName: isOpenAiKey ? "" : authStrs[0],
    accessCode: isOpenAiKey ? "" : authStrs[1],
    apiKey: isOpenAiKey ? token : "",
  };
}

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
  const { userName, accessCode, apiKey: token } = parseApiKey(authToken);

  // const hashedCode = md5.hash(accessCode ?? "").trim();

  const serverConfig = getServerSideConfig();
  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  console.log("[Auth] got access code:", accessCode);
  // console.log("[Auth] hashed access code:", accessCode);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());
  console.log("[clientCode]", clientCode);
  console.log("[userName]", userName);

  if (serverConfig.needCode && !token) {
    const results = await (
      await fetch(
        `http://127.0.0.1:7001/uac/user/findOne?clientCode=${clientCode}&userName=${userName}`,
      )
    ).json();

    console.log("results: ", results);

    // @ts-ignore
    let user = results.user.map(
      (result: { user_name: string; password: string }) => {
        if (result.user_name == userName && result.password == accessCode) {
          return result;
        }
      },
    );

    console.log("user: ", user);

    if (!user || !user[0]) {
      return {
        error: true,
        msg: !accessCode ? "密码为空" : "密码不正确",
      };
    }
  }

  // if user does not provide an api key, inject system api key
  if (!token) {
    const apiKey = serverConfig.apiKey;
    if (apiKey) {
      console.log("[Auth] use system api key");
      req.headers.set("Authorization", `Bearer ${apiKey}`);
    } else {
      console.log("[Auth] admin did not provide an api key");
    }
  } else {
    console.log("[Auth] use user api key");
  }

  return {
    error: false,
  };
}
