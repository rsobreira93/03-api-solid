import { expect, describe, it, beforeEach } from "vitest";
import {  FetchNearByGymsUseCase} from "./fetch-nearby-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";


let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe("Fetch Near By Gyms Use Case", ()=> {

  beforeEach(async ()=> {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearByGymsUseCase(
      gymsRepository
    );
  });


  it("should be able to fetch nearby gyms", async ()=>{
    await gymsRepository.create({
      title: "Near Gym",
      description: "",
      phone: "",
      latitude: -6.1176777,
      longitude: -38.2112592
    });

    await gymsRepository.create({
      title: "far Gym",
      description: "",
      phone: "",
      latitude: -6.5334198,
      longitude: -38.0588126
    });

    const {gyms} = await sut.execute({
      userLatitude: -6.1243392,
      userLongitude: -38.207488,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({title: "Near Gym"}),
    ]);
  });
});