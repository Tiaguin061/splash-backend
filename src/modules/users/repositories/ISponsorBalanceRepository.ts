import IFindSponsorBalanceDTO from '../dtos/IFindSponsorBalanceDTO';
import ICreateSponsorBalanceDTO from '../dtos/ICreateSponsorBalanceDTO';
import SponsorBalance from '../infra/typeorm/entities/SponsorBalance';

export default interface ISponsorBalanceRepository {
  create(sponsorBalanceData: ICreateSponsorBalanceDTO): Promise<SponsorBalance>;
  save(sponsorBalance: SponsorBalance): Promise<SponsorBalance>;
  findSponsorBalance(
    findData: IFindSponsorBalanceDTO,
  ): Promise<SponsorBalance | undefined>;
  findAllSponsorBalanceBySponsoredUserId(
    sponsored_user_id: string,
  ): Promise<SponsorBalance[]>;
}
