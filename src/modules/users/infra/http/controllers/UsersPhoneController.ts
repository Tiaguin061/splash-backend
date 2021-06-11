import CreateUsersByPhoneNumberService from '@modules/users/services/CreateUsersByPhoneNumberServices';
import { Request, Response } from 'express';

import client from 'twilio';
import twilioConfig from '@config/twilio';
import AppError from '@shared/errors/AppError';
import PostgresSponsorshipsRepository from '@modules/sponsorships/infra/typeorm/repositories/PostgresSponsorshipsRepository';
import AddEmailAndPasswordUserService from '@modules/users/services/AddEmailAndPasswordUserService';
import PostgresUsersRepository from '../../typeorm/repositories/PostgresUsersRepository';
import PostgresUserBalanceRepository from '../../typeorm/repositories/PostgresUserBalanceRepository';
import PostgresSponsoringRepository from '../../typeorm/repositories/PostgresSponsoringRepository';
import PostgresSponsoringSponsoredCountRepository from '../../typeorm/repositories/PostgresSponsoringSponsoredCountRepository';
import PostgresSponsorBalanceRepository from '../../typeorm/repositories/PostgresSponsorBalanceRepository';

const { accountSid, authToken, servicesSid } = twilioConfig.twilio;

const clientSendMessage = client(accountSid, authToken);

class UsersPhoneController {
  async sendCode(request: Request, response: Response): Promise<Response> {
    try {
      const { phone_number } = request.body;

      const sendCode = await clientSendMessage.verify
        .services(servicesSid)
        .verifications.create({
          // rateLimits: {
          //   end_user_ip_address: '127.0.0.1',
          // },
          to: `${String(phone_number)}`,
          channel: 'sms',
        });

      if (!sendCode) {
        throw new AppError('Sms rate limit');
      }

      request.user = {
        id: '',
        phone_number,
      };

      return response.json({ message: 'Code sent successfully!' });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { code, roles, balance_amount, terms, sponsorship_code } =
      request.body;

    const { phone_number } = request.user;

    console.log(code);

    const postgresUsersRepository = new PostgresUsersRepository();
    const postgresUserBalanceRepository = new PostgresUserBalanceRepository();
    const postgresSponsorBalanceRepository =
      new PostgresSponsorBalanceRepository();
    const postgresSponsorshipsRepository = new PostgresSponsorshipsRepository();
    const postgresSponsoringRepository = new PostgresSponsoringRepository();
    const postgresSponsoringSponsoredCountRepository =
      new PostgresSponsoringSponsoredCountRepository();

    const createUser = new CreateUsersByPhoneNumberService(
      postgresUsersRepository,
      postgresUserBalanceRepository,
      postgresSponsorBalanceRepository,
      postgresSponsorshipsRepository,
      postgresSponsoringRepository,
      postgresSponsoringSponsoredCountRepository,
    );

    await clientSendMessage.verify
      .services(servicesSid)
      .verificationChecks.create({
        to: phone_number,
        code: String(code),
      })
      .catch(error => {
        throw new AppError(error);
      });

    const { user, token } = await createUser.execute({
      phone_number,
      roles,
      terms,
      balance_amount,
      sponsorship_code,
    });

    request.user = {
      id: user.id,
      phone_number: user.phone_number,
    };

    return response.status(201).json({ user, token });
  }
}

export default UsersPhoneController;
