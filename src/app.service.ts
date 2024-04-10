import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AppService {
  constructor(private readonly _prisma: PrismaService) {}

  async createUser() {
    const user = await this._prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    });

    return user;
  }

  async findUser(id: number) {
    return this._prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
