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

export async function Login(req: NextRequest) {
  const authToken = req.headers.get("Authorization") ?? "";

  const serverConfig = getServerSideConfig();

  const body = await req.json();

  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  // console.log("[Auth] hashed access code:", accessCode);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());
  console.log("[clientCode]", clientCode);
  console.log("[req.body]", body);

  const results = await fetch("http://localhost:7001/uac/auth/login", {
    method: "POST",
    body: JSON.stringify({
      clientCode: clientCode,
      userName: body.userName,
      password: body.password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resJason = await results.json();

  console.log("results: ", resJason);

  return resJason;
}
