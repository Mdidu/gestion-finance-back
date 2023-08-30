import { Injectable } from "@nestjs/common";
import { AssetTypeDTO } from "src/domain/model/asset-type/asset-type.dto";
import { AssetTypeDAO } from "src/infrastructure/entities/asset-type-dao/asset-type.dao";
import { AssetDTO, AssetForm } from "../../../domain/model/asset-dto/asset.dto";
import { AssetDAO } from "../../entities/asset-dao/asset.dao";
import { DatabaseAssetRepository } from "../../repositories/asset-repository/asset.repository";
import { Constante } from "./../../../lib/shared/constante";

export type AssetResponse = { asset: AssetDTO };
export type AssetListResponse = { assetList: AssetDTO[] };

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: DatabaseAssetRepository) {}

  public getAllAssetTypes(): Promise<AssetTypeDTO[]> {
    const assetTypeList = this.assetRepository.getAllAssetTypes();
    return assetTypeList;
  }

  public getAllAssetsByPortfolio(portfolioId: number): Promise<AssetDTO[]> {
    const assetList = this.assetRepository
      .getAllAssetsByPortfolio(portfolioId)
      .then((res) =>
        res
          .map((asset) => this.mappeAssetDAOToAssetDTO(asset, res))
          .filter(
            (asset, index, self) =>
              index === self.findIndex((t) => t.name === asset.name)
          )
      );

    return assetList;
  }

  public getAllAssetFromLastMonth(portfolioId: number): Promise<AssetDTO[]> {
    const assetList = this.assetRepository
      .getAllAssetFromLastMonth(portfolioId)
      .then((res) =>
        res
          .map((asset) => this.mappeAssetDAOToAssetDTO(asset, res))
          .filter(
            (asset, index, self) =>
              index === self.findIndex((t) => t.name === asset.name)
          )
      );
    return assetList;
  }

  public getAllOperationForOneAsset(
    portfolioId: number,
    assetName: string
  ): Promise<AssetDTO[]> {
    const asset = this.assetRepository
      .getAllOperationForOneAsset(portfolioId, assetName)
      .then((res) =>
        res
          .map((asset) => this.mappeAssetDAOToAssetDTO(asset, res))
          .filter(
            (asset, index, self) =>
              index === self.findIndex((t) => t.name === asset.name)
          )
      );

    return asset;
  }

  public createAsset(
    assetForm: AssetForm,
    portfolioId: number
  ): Promise<AssetDTO[]> {
    const assetList = this.assetRepository
      .createAsset(assetForm, portfolioId)
      .then((res: AssetDAO[]) =>
        res
          .map((asset: AssetDAO) => this.mappeAssetDAOToAssetDTO(asset, res))
          .filter(
            (asset, index, self) =>
              index === self.findIndex((t) => t.name === asset.name)
          )
      );
    return assetList;
  }

  public updateAsset(
    portfolioId: number,
    assetForm: AssetForm
  ): Promise<AssetDTO[]> {
    const assetList = this.assetRepository
      .updateAsset(portfolioId, assetForm)
      .then((res: AssetDAO[]) =>
        res
          .map((asset: AssetDAO) => this.mappeAssetDAOToAssetDTO(asset, res))
          .filter(
            (asset, index, self) =>
              index === self.findIndex((t) => t.name === asset.name)
          )
      );
    return assetList;
  }

  public deleteAsset(
    assetId: number,
    assetName: string,
    portfolioId: number
  ): Promise<AssetDTO[]> {
    const assetList = this.assetRepository
      .deleteAsset(assetId, assetName, portfolioId)
      .then((res: AssetDAO[]) =>
        res
          .map((asset: AssetDAO) => this.mappeAssetDAOToAssetDTO(asset, res))
          .filter(
            (asset, index, self) =>
              index === self.findIndex((t) => t.name === asset.name)
          )
      );
    return assetList;
  }

  public mappeAssetDAOToAssetDTO(
    assetDAO: AssetDAO,
    res: AssetDAO[]
  ): AssetDTO {
    const listSimilarAsset = res.filter(
      (asset: AssetDAO) => assetDAO.name === asset.name
    );
    const arrValuePerPeriod = this.genererValuePerPeriod(listSimilarAsset);
    return {
      id: assetDAO.idAsset,
      name: assetDAO.name,
      distribution: assetDAO.distribution,
      quantity: assetDAO.quantity,
      valuePerPeriod: arrValuePerPeriod,
      amount: assetDAO.amount,
      totalAmount: arrValuePerPeriod.reduce((acc, cur) => {
        if (cur.topBuy === Constante.CODE_OPERATION_TYPE.SELL)
          return acc - cur.value;
        if (cur.topBuy === Constante.CODE_OPERATION_TYPE.BUY)
          return acc + cur.value;
      }, 0),
      purchased: assetDAO.purchased,
      assetType: assetDAO.fk_idAssetType,
    };
  }

  public genererValuePerPeriod(listSimilarAsset: AssetDAO[]) {
    let valuePerPeriod = [];
    let totalAmount = 0;
    for (const asset of listSimilarAsset) {
      if (asset.purchasedAt !== undefined && asset.purchasedAt !== null) {
        totalAmount = totalAmount + asset.amount;
        valuePerPeriod.push({
          date: asset.purchasedAt,
          value: asset.amount,
          totalAmount: totalAmount,
          topBuy: Constante.CODE_OPERATION_TYPE.BUY,
          quantity: asset.quantity,
          id: asset.idAsset,
        });
      }
      if (asset.soldAt !== undefined && asset.soldAt !== null) {
        totalAmount = totalAmount - asset.amount;
        valuePerPeriod.push({
          date: asset.soldAt,
          value: asset.amount,
          topBuy: Constante.CODE_OPERATION_TYPE.SELL,
          totalAmount: totalAmount,
          quantity: asset.quantity,
          id: asset.idAsset,
        });
      }
    }

    return valuePerPeriod;
  }

  public mappeAssetTypeDAOToAssetTypeDTO(
    assetTypeDAO: AssetTypeDAO
  ): AssetTypeDTO {
    return {
      id: assetTypeDAO.id,
      name: assetTypeDAO.name,
    };
  }
}
