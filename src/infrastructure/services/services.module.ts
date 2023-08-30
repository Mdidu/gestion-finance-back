import { Module } from "@nestjs/common";
import { RepositoriesModule } from "../repositories/repositories.module";
import { AssetService } from "./asset-service/asset.service";

@Module({
  imports: [RepositoriesModule],
  controllers: [],
  exports: [AssetService],
  providers: [AssetService],
})
export class ServicesModule {}
