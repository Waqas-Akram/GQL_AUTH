import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Audiance } from "../entity/Audiance";

@Resolver()
export class AudianceResolver {
  @Query(() => [Audiance])
  audiance() {
    return Audiance.find();
  }

  @Query(() => Audiance)
  async getSingleUser(@Arg("name") name: string) {
    const user = await Audiance.findOne({ where: { name } });
    if (!user) {
      throw new Error("User not found with this name");
    }
    return user;
  }

  @Mutation(() => String)
  async addAudiance(
    @Arg("name") name: string,
    @Arg("country") country: string
  ): Promise<String> {
    try {
      const user = await Audiance.create({
        name,
        country,
      });
      user.save();
    } catch (error) {
      throw new Error(error.message);
    }
    return "Your data has been saved";
  }
}
