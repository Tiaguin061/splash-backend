import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import SponsorSponsored from '../infra/typeorm/entities/SponsorSponsored';
import ISponsorSponsoredRepository from '../repositories/ISponsorSponsoredRepository';
import IUserRepository from '../repositories/IUserRepository';

@injectable()
class ListUsersWhoSponsorTheUser {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('SponsorSponsoredRepository')
    private sponsorSponsoredRepository: ISponsorSponsoredRepository,
  ) {}

  async execute(user_id: string): Promise<SponsorSponsored[]> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not logged', 401);
    }
    const usersSponsoring =
      await this.sponsorSponsoredRepository.findAllBySponsoredUserId(user_id);

    return usersSponsoring;
  }
}

export default ListUsersWhoSponsorTheUser;
