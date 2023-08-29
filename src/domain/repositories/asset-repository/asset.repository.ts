import { AssetDTO } from "src/domain/model/asset-dto/asset.dto";
import { AssetDAO } from "src/infrastructure/entities/asset-dao/asset.dao";
import { AssetTypeDAO } from "src/infrastructure/entities/asset-type-dao/asset-type.dao";

export interface AssetRepository {
  getAllAssetTypes(): Promise<AssetTypeDAO[]>;
  getAllAssetsByPortfolio(portfolioId: number): Promise<AssetDAO[]>;
  getAllAssetFromLastMonth(
    portfolioId: number,
    currentMonth: number
  ): Promise<AssetDAO[]>;
  getAllAssetsByMonth(month: number): Promise<AssetDAO[]>;
  getAllOperationForOneAsset(
    portfolioId: number,
    assetId: number
  ): Promise<AssetDAO[]>;
  createAsset(asset: AssetDTO, portfolioId: number): Promise<AssetDAO[]>;
  updateAsset(portfolioId: number, asset: AssetDTO): Promise<AssetDAO>;
  deleteAsset(assetId: number): Promise<AssetDAO>;
}
