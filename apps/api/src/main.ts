import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurer CORS pour accepter toutes les requêtes
  app.enableCors({
    origin: '*', // Permet toutes les origines
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permet toutes les méthodes HTTP
    allowedHeaders: 'Content-Type, Accept', // Permet tous les en-têtes
  });

  await app.listen(port);
  console.log('Serveur démarré : http://localhost:' + port);
}
bootstrap();