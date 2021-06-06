import ICreateSponsorshipDTO from '../dtos/ICreateSponsorshipDTO';
import IFindSponsorshipDTO from '../dtos/IFindSponsorshipDTO';
import IFindSponsorshipUnavailableDTO from '../dtos/IFindSponsorshipUnavailableDTO';
import IUpdateSponsorshipDTO from '../dtos/IUpdateSponsorshipDTO';
import Sponsorship from '../infra/typeorm/entities/Sponsorship';

export default interface ISponsorshipsRepository {
  create(sponsorData: ICreateSponsorshipDTO): Promise<Sponsorship>;
  findSponsorship(
    findData: IFindSponsorshipDTO,
  ): Promise<Sponsorship | undefined>;
  findSponsorshipUnavailable(
    findData: IFindSponsorshipUnavailableDTO,
  ): Promise<Sponsorship | undefined>;
  findAllSponsoredFromUser(sponsor_user_id: string): Promise<Sponsorship[]>;
  findAllSponsorshipsFromUser(
    sponsored_user_id: string,
  ): Promise<Sponsorship[]>;
  save(sponsorship: Sponsorship): Promise<Sponsorship>;
  findBySponsorshipCode(
    sponsorship_code: string,
  ): Promise<Sponsorship | undefined>;
  updateSponsorship(
    sponsor_user_id: string,
    data: IUpdateSponsorshipDTO,
  ): Promise<Sponsorship | undefined>;
}
