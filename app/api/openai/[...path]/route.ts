import { OpenaiPath } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth";
import { ResetPassword } from "../../reset-password";
import { Login } from "../../login";
import { requestOpenai } from "../../common";

const ALLOWD_PATH = new Set(Object.values(OpenaiPath));

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[OpenAI Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const subpath = params.path.join("/");

  if (!ALLOWD_PATH.has(subpath)) {
    console.log("[OpenAI Route] forbidden path ", subpath);
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + subpath,
      },
      {
        status: 403,
      },
    );
  }

  console.log("subpath: " + subpath);

  if (subpath == OpenaiPath.Login) {
    const login = await Login(req);
    // @ts-ignore
    return NextResponse.json(login, {
      status: 200,
    });
  }

  if (subpath == OpenaiPath.ResetPassword) {
    const resetPassword = await ResetPassword(req);
    // @ts-ignore
    return NextResponse.json(resetPassword, {
      status: 200,
    });
  }

  const authResult = await auth(req);
  // @ts-ignore
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    return await requestOpenai(req);
  } catch (e) {
    console.error("[OpenAI] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
