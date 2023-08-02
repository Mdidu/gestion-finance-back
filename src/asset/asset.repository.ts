import { Injectable } from "@nestjs/common";
import { AssetDTO } from "./asset.dto";

@Injectable()
export class AssetRepository {
  private assetType: AssetDTO[] = [
    {
      id: 0,
      name: "Crypto",
      distribution: 0.5,
      valuePerPeriod: [
        { date: new Date(), value: 1000 },
        { date: new Date(), value: 1300 },
        { date: new Date(), value: 5000 },
        { date: new Date(), value: 5500 },
      ],
      totalAmount: 5500,
    },
    {
      id: 1,
      name: "Actions",
      distribution: 0.5,
      valuePerPeriod: [
        { date: new Date(), value: 1000 },
        { date: new Date(), value: 1800 },
        { date: new Date(), value: 3500 },
        { date: new Date(), value: 4500 },
      ],
      totalAmount: 4500,
    },
    {
      id: 2,
      name: "BTC",
      distribution: 0.5,
      valuePerPeriod: [
        { date: new Date(), value: 5000 },
        { date: new Date(), value: 9500 },
      ],
      totalAmount: 9500,
    },
  ];

  public getAllAssetsByPortfolio() {
    return this.assetType;
  }

  public getOneAsset(assetId: number): AssetDTO | null {
    if (assetId < 0) return null;
    return this.assetType[assetId];
  }

  public createAsset(asset: AssetDTO): AssetDTO {
    this.assetType.push(asset);
    return asset;
  }

  public updateAsset(assetId: number, asset: AssetDTO): AssetDTO | null {
    if (assetId < 0) return null;
    this.assetType[assetId] = asset;
    return asset;
  }

  public deleteAsset(assetId: number): AssetDTO | null {
    if (assetId < 0) return null;
    const assetToBeDeleted = this.assetType[assetId];
    this.assetType.splice(assetId, 1);
    return assetToBeDeleted;
  }
}
