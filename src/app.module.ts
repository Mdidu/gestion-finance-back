import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/config/database/database.module";
import { EnvironmentConfigModule } from "./infrastructure/config/environment-config/environment-config.module";
import { ControllersModule } from "./infrastructure/controllers/controllers.module";
import { RepositoriesModule } from "./infrastructure/repositories/repositories.module";
import { ServicesModule } from "./infrastructure/services/services.module";

@Module({
  imports: [
    EnvironmentConfigModule,
    ServicesModule,
    RepositoriesModule,
    ControllersModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
