import uploadConfig from '@config/upload';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import UserSponsorSponsoredCount from './UserSponsorSponsoredCount';
import UserBalance from './UserBalance';

@Entity('user')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  name?: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  bio: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email?: string;

  @Column({
    nullable: true,
  })
  avatar?: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    unique: true,
    nullable: true,
  })
  phone_number?: string;

  @OneToOne(() => UserBalance, userBalance => userBalance.user)
  user_balance: UserBalance;

  @OneToOne(
    () => UserSponsorSponsoredCount,
    userSponsorSponsoredCount => userSponsorSponsoredCount.user,
  )
  user_sponsor_sponsored_count: UserSponsorSponsoredCount;

  @Column({
    nullable: true,
  })
  role: string;

  @Column({
    default: true,
  })
  active_account: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) return null;

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/static/${this.avatar}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3-${uploadConfig.config.aws.region}.amazonaws.com/${this.avatar}`;

      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default User;
