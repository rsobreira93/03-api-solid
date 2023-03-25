import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";


interface FetchNearByGymsInterfaceUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}


interface FetchNearByGymsUseCaseResponse{
  gyms: Gym[];
}

export class FetchNearByGymsUseCase {

  constructor(private gymsRepository: GymsRepository){}

  async execute({userLatitude, userLongitude}: FetchNearByGymsInterfaceUseCaseRequest): Promise<FetchNearByGymsUseCaseResponse>{
    const gyms = await this.gymsRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude
    });

    return {
      gyms,
    };
  }
}
