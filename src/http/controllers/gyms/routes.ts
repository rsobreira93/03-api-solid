import { FastifyInstance } from "fastify";

import { verifyJwt } from "@/http/middleware/verify-jwt";
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";
import { verifyUserRole } from "@/http/middleware/verify-user-role";

export async function gymsRouters(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);


  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);

  app.post("/gyms", {onRequest:[ verifyUserRole("ADMIN")]} ,create);
}