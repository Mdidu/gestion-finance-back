import { Injectable, NotFoundException } from "@nestjs/common";
import { Asset, AssetRepository } from "./asset.repository";

export type AssetResponse = { asset: Asset };
export type AssetListResponse = { assetList: Asset[] };

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: AssetRepository) {}

  public getAllAssetsByPortfolio(): AssetListResponse {
    const assetList = this.assetRepository.getAllAssetsByPortfolio();

    return { assetList };
  }

  public getOneAsset(assetId: number) {
    const asset = this.assetRepository.getOneAsset(assetId);

    if (!asset) throw new NotFoundException("Asset not found");
    return { asset };
  }

  public createAsset(assetDTO: Asset): AssetResponse {
    const asset = this.assetRepository.createAsset(assetDTO);

    return { asset };
  }

  public updateAsset(assetId: number, assetDTO: any): AssetResponse {
    const asset = this.assetRepository.updateAsset(assetId, assetDTO);
    if (!asset) throw new NotFoundException("Asset not found");
    return { asset };
  }

  public deleteAsset(assetId: number) {
    const asset = this.assetRepository.deleteAsset(assetId);
    if (!asset) throw new NotFoundException("Asset not found");
    return { asset };
  }
}
