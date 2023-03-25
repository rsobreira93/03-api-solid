import { expect, describe, it, beforeEach } from "vitest";
import {  SearchGymUseCase} from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";


let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search Gyms Use Case", ()=> {

  beforeEach(async ()=> {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(
      gymsRepository
    );
  });


  it("should be able to search for gyms", async ()=>{
    await gymsRepository.create({
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -6.1176777,
      longitude: -38.2112592
    });

    await gymsRepository.create({
      title: "TypeScript Gym",
      description: "",
      phone: "",
      latitude: -6.1176777,
      longitude: -38.2112592
    });

    const {gyms} = await sut.execute({
      query: "JavaScript",
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({title: "JavaScript Gym"}),
    ]);
  });

  it("should be able to fetch paginated gym search", async ()=>{
    
    for(let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: "",
        phone: "",
        latitude: -6.1176777,
        longitude: -38.2112592
      });

    }

    const {gyms} = await sut.execute({
      query: "JavaScript",
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({title: "JavaScript Gym 21"}),
      expect.objectContaining({title: "JavaScript Gym 22"}),
    ]);
  });
});