import {
  Injectable,
} from '@nestjs/common';
import {
  InjectDataSource,
  InjectRepository,
} from '@nestjs/typeorm';
import {
  Member,
  MemberCredential,
} from 'src/entities';
import {
  DataSource,
  Repository,
} from 'typeorm';
import {
  ArgonService,
} from 'src/argon/argon.service';

@Injectable()
export class MemberService {

  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly argonService: ArgonService,
  ) { }

  createMember(email: string, password: string, nickname: string) {
    return this.datasource.transaction(async (entityManager) => {
      let member = entityManager.create(Member);
      member.email = email;
      member.nickname = nickname;
      member = await entityManager.save(member);
      let credential = entityManager.create(MemberCredential);
      credential.password = await this.argonService.hashPassword(password);
      credential.member = member;
      credential = await entityManager.save(credential);
      return member;
    });
  }

  verifyEmail(email: string) {
    return this.memberRepository.update(
      { email },
      { isEmailVerified: true });
  }

  getMemberCredentialByEmail(email: string) {
    return this.memberRepository
      .createQueryBuilder("member")
      .where('member.email = :email', { email })
      .leftJoinAndMapOne('member.credential', MemberCredential, 'credential', 'credential.member_id = member.id')
      .addSelect('credential.password')
      .getOne();
  }
}
