import { app } from "./app";
import { env } from "./env";

app.listen({
  host: "0.0.0.0",
  port: env.PORT,
}).then(() => {
  console.log("🚀Http server is Running on port http://0.0.0.0:3333");
});
