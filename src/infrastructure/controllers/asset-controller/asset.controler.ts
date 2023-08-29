import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { AssetDTO } from "src/domain/model/asset-dto/asset.dto";
import {
  AssetListResponse,
  AssetResponse,
  AssetService,
} from "../../services/asset-service/asset.service";

@Controller("/asset")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get("/types")
  public getAllAssetTypes(): Promise<any[]> {
    return this.assetService.getAllAssetTypes();
  }

  @Get("/:portfolioId")
  public getAllAssetsByPortfolio(
    @Param("portfolioId", ParseIntPipe) portfolioId: number
  ): Promise<AssetListResponse> {
    return this.assetService
      .getAllAssetsByPortfolio(portfolioId)
      .then((res) => {
        return { assetList: res };
      });
  }

  @Get("/:portfolioId/lastMonth")
  public getAllAssetFromLastMonth(
    @Param("portfolioId", ParseIntPipe) portfolioId: number
  ): Promise<AssetListResponse> {
    return this.assetService
      .getAllAssetFromLastMonth(portfolioId)
      .then((res) => {
        return { assetList: res };
      });
  }

  @Get("/:portfolioId/:assetId")
  public getAllOperationForOneAsset(
    @Param("portfolioId", ParseIntPipe) portfolioId: number,
    @Param("assetId", ParseIntPipe) assetId: number
  ): Promise<AssetListResponse> {
    return this.assetService
      .getAllOperationForOneAsset(portfolioId, assetId)
      .then((res: AssetDTO[]) => {
        return { assetList: res };
      });
  }

  @Post("/:portfolioId")
  public createAsset(
    @Body() assetDTO: any,
    @Param("portfolioId", ParseIntPipe) portfolioId: number
  ): Promise<AssetListResponse> {
    return this.assetService
      .createAsset(assetDTO, portfolioId)
      .then((res: AssetDTO[]) => {
        return { assetList: res };
      });
  }

  @Put("/:portfolioId/:assetId")
  public updateAsset(
    @Param("portfolioId", ParseIntPipe) portfolioId: number,
    @Param("assetId", ParseIntPipe) assetId: number,
    @Body() assetDTO: any
  ): Promise<AssetResponse> {
    return this.assetService
      .updateAsset(portfolioId, assetDTO)
      .then((res: AssetDTO) => {
        return { asset: res };
      });
  }

  @Delete("/:portfolioId/:assetId")
  public deleteAsset(
    @Param("portfolioId", ParseIntPipe) portfolioId: number,
    @Param("assetId", ParseIntPipe) assetId: number
  ): Promise<AssetResponse> {
    return this.assetService.deleteAsset(assetId).then((res: AssetDTO) => {
      return { asset: res };
    });
  }
}
