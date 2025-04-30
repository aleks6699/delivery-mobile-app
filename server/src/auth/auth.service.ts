import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { faker } from '@faker-js/faker';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto);
    const tokens = await this.issueToken(user.id);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }
  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');
    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const tokens = await this.issueToken(user.id);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async register(authDto: AuthDto) {
    const { email, password } = authDto;
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (oldUser) throw new BadRequestException('User already exists');
    const user = await this.prisma.user.create({
      data: {
        email: email,
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number(),
        password: await hash(password),
      },
    });
    const tokens = await this.issueToken(user.id);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }
  private async issueToken(userId: string) {
    const data = { id: userId };
    const accessToken = await this.jwt.signAsync(data, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwt.signAsync(data, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const isPasswordValid = await verify(dto.password, dto.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
    return user;
  }
}
