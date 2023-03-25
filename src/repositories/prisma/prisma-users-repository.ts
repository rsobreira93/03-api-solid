import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository{

  async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email
      }
    });

    return userAlreadyExists;
  }

  async create(data: Prisma.UserCreateInput){
    const user = await prisma.user.create({
      data
    });

    return user;
  }
}