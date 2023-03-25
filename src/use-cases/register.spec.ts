import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { UserAlreadyExistsError } from "./errors/users-already-exists-error";
import { RegisterUseCase } from "./register";


let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", ()=> {

  beforeEach(()=> {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  it("should be able to register", async ()=>{


    const {user} = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123465" 
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user).toHaveProperty("id");
  });
  it("should hash user password upon registration", async ()=>{
  
    const {user} = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123465" 
    });

    const isPasswordCorrectlyHashed = await compare(
      "123465",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
  it("should not be to register with same email twice", async ()=>{
    
    const email =  "johndoe@example.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456" 
    });

    await expect(()=>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456" 
      })).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});