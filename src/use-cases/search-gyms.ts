import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";


interface SearchGymInterfaceUseCaseRequest {
  query: string;
  page: number;
}


interface SearchGymUseCaseResponse{
  gyms: Gym[];
}

export class SearchGymUseCase {

  constructor(private gymsRepository: GymsRepository){}

  async execute({query, page}: SearchGymInterfaceUseCaseRequest): Promise<SearchGymUseCaseResponse>{
    const gyms = await this.gymsRepository.searchMany(
      query,
      page
    );

    return {
      gyms,
    };
  }
}
