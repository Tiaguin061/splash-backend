export default interface ICreateSponsorDTO {
  user_recipient_id: string;
  sponsor_id: string;
  your_sponsor_balance: number;
  withdrawal_balance_available: boolean;
}
