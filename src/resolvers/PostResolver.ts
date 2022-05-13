import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { User, Post } from "../entity";
import { Context } from "../types";
import { isAuth } from "../middlewares";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts() {
    return Post.find();
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async addPost(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Ctx() { payload }: Context
  ): Promise<String> {
    try {
      const user = await User.findOne({
        where: { id: payload?.userId },
      });
      if (user) {
        await Post.insert({
          title,
          content,
          // user_Id: user.id,
          user_name: user.name,
        });
      } else {
        throw new Error(" User not found against this id");
      }
    } catch (error) {
      throw new Error(error.message);
    }
    return "Your post has been posted to our server";
  }
}
