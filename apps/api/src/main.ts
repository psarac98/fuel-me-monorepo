import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  });

  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Fuel Me API")
    .setDescription("Fuel Me fleet management API")
    .setVersion("0.1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(4000);
  console.log("API running on http://localhost:4000");
  console.log("Swagger docs on http://localhost:4000/docs");
}

bootstrap();
