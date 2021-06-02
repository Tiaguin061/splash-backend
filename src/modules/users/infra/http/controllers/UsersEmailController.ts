import { classToClass } from 'class-transformer';
import CreateUsersService from '@modules/users/services/CreateUsersByEmailService';
import { Request, Response } from 'express';
import PostgresUsersRepository from '../../typeorm/repositories/PostgresUsersRepository';

class UsersEmailController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, username, email, password } = await request.body;

    const usersRepository = new PostgresUsersRepository();

    const userService = new CreateUsersService(usersRepository);

    const { user, token } = await userService.execute({
      name,
      username,
      email,
      password,
    });

    return response.json({
      user: classToClass(user),
      token,
    });
  }
}

export default UsersEmailController;
