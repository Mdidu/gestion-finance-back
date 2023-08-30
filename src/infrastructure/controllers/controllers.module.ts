import { Module } from "@nestjs/common";
import { ServicesModule } from "../services/services.module";
import { AssetController } from "./asset-controller/asset.controler";

@Module({
  imports: [ServicesModule],
  controllers: [AssetController],
  exports: [AssetController],
  providers: [AssetController],
})
export class ControllersModule {}
