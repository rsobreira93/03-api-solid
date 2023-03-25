import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/users-already-exists-error";
import { User } from "@prisma/client";


interface RegisterInterfaceUseCaseRequest {
  name: string;
  email: string;
  password: string;
}


interface RegisterUseCaseResponse{
  user: User;
}

export class RegisterUseCase {

  constructor(private usersRepository: UsersRepository){}

  async execute({email, name, password}: RegisterInterfaceUseCaseRequest): Promise<RegisterUseCaseResponse>{

    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if(userAlreadyExists){
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 10);


    const user = await this.usersRepository.create({email, name,password_hash});


    return {
      user,
    };
  }
}
