import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import {  CheckInUseCase} from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";


let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", ()=> {

  beforeEach(async ()=> {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(
      checkInsRepository,
      gymsRepository
    );

    await gymsRepository.create({
      id: "gym-01",
      title: "Js Gym",
      description: "",
      phone: "",
      latitude: -6.1243392,
      longitude: -38.207488
    });

    vi.useFakeTimers();
  });

  afterEach(()=>{
    vi.useRealTimers();
  });
  it("should be able to check in", async ()=>{
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const {checkIn} = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -6.1243392,
      userLongitude: -38.207488,
    });

    expect(checkIn.id).toEqual(expect.any(String));
    expect(checkIn).toHaveProperty("id");
  });

  it("should not be able to check in twice in the same day", async ()=>{
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -6.1243392,
      userLongitude: -38.207488,
    });
    
    await expect(()=>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -6.1243392,
        userLongitude: -38.207488,
      })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async ()=>{
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -6.1243392,
      userLongitude: -38.207488,
    });
    
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const {checkIn} = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -6.1243392,
      userLongitude: -38.207488,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async ()=>{
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    gymsRepository.gyms.push({
      id: "gym-02",
      title: "Js Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-6.1176777),
      longitude: new Decimal(-38.2112592)
    });


    await expect(()=>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -6.1243392,
        userLongitude: -38.207488,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });

  it("should not be able to check in if not exists gym", async ()=>{
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await expect(()=>
      sut.execute({
        gymId: "non-exists-gym-id",
        userId: "user-01",
        userLatitude: -6.1243392,
        userLongitude: -38.207488,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

});