import { Injectable } from "@nestjs/common";
import { z } from "zod";

const AssetScheme = z.object({
  id: z.number().optional(),
  name: z.string(),
  distribution: z.number(),
  value: z.number(),
});
export type Asset = z.infer<typeof AssetScheme>;

@Injectable()
export class AssetRepository {
  private assetType: Asset[] = [
    { id: 0, name: "BTC", distribution: 0.5, value: 10000 },
  ];

  public getAllAssetsByPortfolio() {
    return this.assetType;
  }

  public getOneAsset(assetId: number): Asset | null {
    if (assetId < 0) return null;
    return this.assetType[assetId];
  }

  public createAsset(asset: Asset): Asset {
    this.assetType.push(asset);
    return asset;
  }

  public updateAsset(assetId: number, asset: Asset): Asset | null {
    if (assetId < 0) return null;
    this.assetType[assetId] = asset;
    return asset;
  }

  public deleteAsset(assetId: number): Asset | null {
    if (assetId < 0) return null;
    const assetToBeDeleted = this.assetType[assetId];
    this.assetType.splice(assetId, 1);
    return assetToBeDeleted;
  }
}
