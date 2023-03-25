import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import {  findManyNearByParams, GymsRepository} from "@/repositories/gyms-repository";
import {   Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findManyNearBy(params: findManyNearByParams): Promise<Gym[]> {
    return this.gyms.filter(gym =>{
      const distance = getDistanceBetweenCoordinates(
        {latitude: params.latitude, longitude: params.longitude},
        {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
      );

      return distance < 10;
    });
  }

  async searchMany(query: string, page: number){
    return this.gyms.filter(gyms => gyms.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.gyms.push(gym);

    return gym;
  }
  
}