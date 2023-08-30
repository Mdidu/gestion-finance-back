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
import { AssetDTO, AssetForm } from "src/domain/model/asset-dto/asset.dto";
import { AssetTypeDTO } from "src/domain/model/asset-type/asset-type.dto";
import {
  AssetListResponse,
  AssetService,
} from "../../services/asset-service/asset.service";

@Controller("/asset")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get("/types")
  public getAllAssetTypes(): Promise<AssetTypeDTO[]> {
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

  @Get("/:portfolioId/:assetName")
  public getAllOperationForOneAsset(
    @Param("portfolioId", ParseIntPipe) portfolioId: number,
    @Param("assetName") assetName: string
  ): Promise<AssetListResponse> {
    return this.assetService
      .getAllOperationForOneAsset(portfolioId, assetName)
      .then((res: AssetDTO[]) => {
        return { assetList: res };
      });
  }

  @Post("/:portfolioId")
  public createAsset(
    @Body() asset: AssetForm,
    @Param("portfolioId", ParseIntPipe) portfolioId: number
  ): Promise<AssetListResponse> {
    return this.assetService
      .createAsset(asset, portfolioId)
      .then((res: AssetDTO[]) => {
        return { assetList: res };
      });
  }

  @Put("/:portfolioId/:assetId")
  public updateAsset(
    @Param("portfolioId", ParseIntPipe) portfolioId: number,
    @Param("assetId", ParseIntPipe) assetId: number,
    @Body() asset: AssetForm
  ): Promise<AssetListResponse> {
    return this.assetService
      .updateAsset(portfolioId, asset)
      .then((res: AssetDTO[]) => {
        return { assetList: res };
      });
  }

  @Delete("/:portfolioId/:assetId/:assetName")
  public deleteAsset(
    @Param("portfolioId", ParseIntPipe) portfolioId: number,
    @Param("assetId", ParseIntPipe) assetId: number,
    @Param("assetName") assetName: string
  ): Promise<AssetListResponse> {
    return this.assetService
      .deleteAsset(assetId, assetName, portfolioId)
      .then((res: AssetDTO[]) => {
        return { assetList: res };
      });
  }
}
