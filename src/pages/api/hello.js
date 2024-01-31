// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createToken } from "@/utils/validation/jwt";

export default function handler(req, res) {
  // test run the jwt create function
  createToken({ req: req, res: res, userId: 1, userEmail: "johndoe@email.com" });
  return;
  // res.status(200).json({ name: "John Doe", token: token });
}
