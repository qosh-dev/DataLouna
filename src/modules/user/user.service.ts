import { IPostCreateUser } from './schemas/post-create.schema';
import UserRepository from './user.repository';

class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async createUser(): Promise<IPostCreateUser> {
    return this.userRepository.createUser();
  }

}

export default UserService;
