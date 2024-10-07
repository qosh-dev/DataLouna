import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PostCreateUserSchema } from './schemas/post-create.schema';
import UserService from './user.service';

export function InitUserRouter(app: FastifyInstance, userService: UserService) {
  // ----------------------------------------------------

  app.post(
    '',
    { schema: PostCreateUserSchema.schema },
    async (req: FastifyRequest, rep: FastifyReply) => {
      const result = await userService.createUser();
      return rep.send(result);
    }
  );


}
