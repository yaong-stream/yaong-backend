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

@Injectable()
export class MemberService {

  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) { }

  public createMember(email: string, hash: string, nickname: string) {
    return this.datasource.transaction(async (entityManager) => {
      let member = entityManager.create(Member);
      member.email = email;
      member.nickname = nickname;
      member = await entityManager.save(member);
      let credential = entityManager.create(MemberCredential);
      credential.password = hash;
      credential.member = member;
      credential = await entityManager.save(credential);
      return member;
    });
  }

  public verifyEmail(email: string) {
    return this.memberRepository.update(
      {
        email,
      },
      {
        isEmailVerified: true,
      },
    );
  }

  public getMemberCredentialByEmail(email: string) {
    return this.memberRepository
      .createQueryBuilder('member')
      .where('member.email = :email', { email })
      .leftJoinAndMapOne('member.credential', MemberCredential, 'credential', 'credential.member_id = member.id')
      .addSelect('credential.password')
      .getOne();
  }

  public getMemberCredentialById(id: number) {
    return this.memberRepository
      .createQueryBuilder('member')
      .where('member.id = :id', { id })
      .leftJoinAndMapOne('member.credential', MemberCredential, 'credential', 'credential.member_id = member.id')
      .addSelect('credential.password')
      .getOne();
  }

  public getMemberById(id: number) {
    return this.memberRepository.findOneBy({ id });
  }

  public withdraw(memberId: number) {
    return this.memberRepository.delete({ id: memberId });
  }
}
