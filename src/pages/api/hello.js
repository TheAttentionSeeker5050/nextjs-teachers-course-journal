// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createToken, revokeToken } from "@/utils/validation/jwt";
import { getCookie } from "cookies-next";
import { getCookieHandler } from "@/utils/validation/cookies";

export default async function handler(req, res) {

  console.log("the cookie", getCookie("token", { req, res }))

  res.status(200).json({ name: "John Doe" });
}
