import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { createAndNoAuthenticateUser } from "@/utils/test/create-and-no-authenticate-user";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description.",
        phone: "1199999999",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    expect(response.statusCode).toEqual(201);
  });

  it("should not be able to create a gym", async () => {
    const { token } = await createAndNoAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description.",
        phone: "1199999999",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });
    // console.log(response);
    expect(response.statusCode).toEqual(401);
  });
});