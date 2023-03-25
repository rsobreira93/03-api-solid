import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CreateGymUseCase } from "./create-gym";


let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", ()=> {

  beforeEach(()=> {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create gym", async ()=>{
    const {gym} = await sut.execute({
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -6.1176777,
      longitude: -38.2112592
    });

    expect(gym.id).toEqual(expect.any(String));
    expect(gym).toHaveProperty("id");
  });
});