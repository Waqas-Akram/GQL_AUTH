import { MiddlewareFn, UnauthorizedError, } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Context } from "../types";

// bearer 102930ajslkdaoq01

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new UnauthorizedError;
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    if (!payload) {
      throw new Error("Not authorized");
    }
    context.payload = payload as any;
  } catch (err) {
    throw new UnauthorizedError;
  }

  return next();
};
