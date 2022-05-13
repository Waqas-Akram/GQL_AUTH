import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entity";
import { LoginResponse, Context } from "../types";
import { createAccessToken, createRefreshToken } from "../services";
import { isAuth } from "../middlewares";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: Context) {
    return User.findOne({
      where: {
        id: payload?.userId,
      },
    });
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 10);
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        await User.insert({
          name,
          email,
          password: hashedPassword,
        });
      } else {
        throw new Error("Someone has been already registered with this email");
      }
    } catch (error) {
      throw new Error(error.message);
    }
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User does not exist with this email");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Incorrect Password");
    }

    res.cookie("unique_id", createRefreshToken(user), { httpOnly: true });

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }
}
