import { Request, Response } from 'express';
import mailConfig from '@config/mail';
import UpdateProfileUserService from '@modules/users/services/UpdateProfileUserService';
import ShowProfileUserService from '@modules/users/services/ShowProfileUserService';
import DeleteProfileUserService from '@modules/users/services/DeleteProfileUserService';
import UpdateUserPhoneNumberService from '@modules/users/services/UpdateUserPhoneNumberService';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';

class ProfileUserController {
  async show(request: Request, response: Response): Promise<Response> {
    const { username } = request.params;

    const showProfileUser = container.resolve(ShowProfileUserService);

    const user = await showProfileUser.execute(username);

    return response.json(classToClass(user));
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { username, password, old_password, bio, email, token, name } =
      request.body;
    const user_id = request.user.id;

    const updateProfile = container.resolve(UpdateProfileUserService);

    const userUpdated = await updateProfile.execute({
      user_id,
      username,
      password,
      old_password,
      token,
      email,
      bio,
      name,
    });

    return response.json(classToClass(userUpdated));
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const deleteProfile = container.resolve(DeleteProfileUserService);

    await deleteProfile.execute(user_id);

    return response.status(204).send();
  }

  async sendVerificationCode(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const { phone_number } = await request.body;

      const sendVerificationCode = container.resolve(
        UpdateUserPhoneNumberService,
      );

      await sendVerificationCode.sendCode(phone_number);

      return response
        .status(200)
        .json({ message: 'Codigo enviado com sucesso!' });
    } catch (error) {
      console.log(error);
      throw new AppError('Ocorreu um erro ao enviar o codigo de verificação');
    }
  }

  async validationAndUpdateUserPhoneNumber(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const user_id = request.user.id;

    const { verification_code, phone_number } = await request.body;

    const sendVerificationCode = container.resolve(
      UpdateUserPhoneNumberService,
    );

    const user = await sendVerificationCode.validationAndUpdateUserPhoneNumber({
      user_id,
      phone_number,
      verification_code,
    });

    return response.status(200).json(user);
  }
}

export default ProfileUserController;
