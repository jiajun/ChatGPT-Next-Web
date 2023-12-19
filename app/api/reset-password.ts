import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";

function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

const clientCode = process.env.CLIENT_CODE;

export async function ResetPassword(req: NextRequest) {
  let authToken = req.headers.get("Authorization") ?? "";
  authToken = authToken.substring(7, authToken.length);

  const serverConfig = getServerSideConfig();

  const body = await req.json();

  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  // console.log("[Auth] hashed access code:", accessCode);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());
  console.log("[clientCode]", clientCode);
  console.log("[req.body]", body);
  console.log("[authToken]", authToken);

  const results = await fetch("http://localhost:7001/uac/user/resetPassword", {
    method: "POST",
    body: JSON.stringify({
      clientCode: clientCode,
      userName: body.userName,
      password: body.password,
      newPassword: body.newPassword,
    }),
    headers: {
      "Content-Type": "application/json",
      token: authToken,
    },
  });

  const resJason = await results.json();

  console.log("results: ", resJason);

  return resJason;
}
