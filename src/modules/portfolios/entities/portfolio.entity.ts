import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PortfolioDetail } from './portfolio-detail.entity';

@Entity('portfolios')
@Unique(['userId'])
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 120 })
  slug: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.portfolio, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ length: 50 })
  dob: string;

  @Column({ type: 'json', nullable: true })
  skills: string[];

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PortfolioDetail, (d) => d.portfolio, { cascade: true })
  details: PortfolioDetail[];
}
