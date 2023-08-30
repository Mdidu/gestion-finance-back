import { Inject, Injectable } from "@nestjs/common";
import { AssetRepository } from "src/domain/repositories/asset-repository/asset.repository";
import { AssetTypeDAO } from "src/infrastructure/entities/asset-type-dao/asset-type.dao";
import { Constante } from "src/lib/shared/constante";
import { DateToolsService } from "src/lib/tools/date-tools/date-tools.service";
import { AssetDTO, AssetForm } from "../../../domain/model/asset-dto/asset.dto";
import { AssetDAO } from "../../entities/asset-dao/asset.dao";

@Injectable()
export class DatabaseAssetRepository implements AssetRepository {
  constructor(@Inject("MYSQL_CONNECTION") private conn: any) {}

  public async getAllAssetTypes(): Promise<AssetTypeDAO[]> {
    const [rows] = await this.conn.promise().query(`SELECT * FROM asset_type`);
    const listAssetTypeDAO: AssetTypeDAO[] = rows.map((row: any) =>
      this.mappeToAssetTypeDAO(row)
    );
    return listAssetTypeDAO;
  }

  public async getAllAssetsByPortfolio(
    portfolioId: number
  ): Promise<AssetDAO[]> {
    const [rows] = await this.conn.promise().query(`SELECT a.*, t.totalAmount
      FROM asset a
      JOIN (
        SELECT fk_idWallet, SUM(amount) as totalAmount
        FROM asset
        WHERE fk_idWallet = ${portfolioId}
        GROUP BY fk_idWallet
      ) t ON a.fk_idWallet = t.fk_idWallet
      WHERE a.fk_idWallet = ${portfolioId}`);
    const listAssetDAO: AssetDAO[] = rows.map((row: any) =>
      this.mappeToAssetDAO(row)
    );
    return listAssetDAO;
  }

  public async getAllAssetFromLastMonth(
    portfolioId: number
  ): Promise<AssetDAO[]> {
    const previousMonthDate = DateToolsService.getPreviousMonthDate(new Date());
    const previousMonthDateString =
      DateToolsService.formatDateToDateString(previousMonthDate);
    const currentDate = DateToolsService.formatDateToDateString(new Date());
    const [rows] = await this.conn
      .promise()
      .query(
        `SELECT * FROM asset WHERE fk_idWallet = ${portfolioId} AND purchasedAt BETWEEN ${previousMonthDateString} AND ${currentDate} OR soldAt BETWEEN ${previousMonthDateString} AND ${currentDate}`
      );
    const listAssetDAO: AssetDAO[] = rows.map((row: any) =>
      this.mappeToAssetDAO(row)
    );
    return listAssetDAO;
  }

  public getAllAssetsByMonth(month: number): Promise<AssetDAO[]> {
    return new Promise((resolve, reject) => {});
  }

  public async getAllOperationForOneAsset(
    portfolioId: number,
    assetName: string
  ): Promise<AssetDAO[]> {
    const [rows] = await this.conn
      .promise()
      .query(
        `SELECT * FROM asset WHERE fk_idWallet = ${portfolioId} AND name = '${assetName}'`
      );
    const listAssetDAO: AssetDAO[] = rows.map((row: any) =>
      this.mappeToAssetDAO(row)
    );
    return listAssetDAO;
  }

  public async createAsset(
    asset: AssetForm,
    portfolioId: number
  ): Promise<AssetDAO[]> {
    let purchasedAt = null;
    let soldAt = null;
    let purchased = null;
    let request = "";

    if (asset.typeOperation === Constante.NOM_OPERATION_TYPE.BUY) {
      purchasedAt = asset.date;
      purchased = 1;
      request = `INSERT INTO asset (name, amount, quantity, purchasedAt, soldAt, purchased, fk_idAssetType, fk_idWallet) VALUES ('${asset.name}', ${asset.amount}, ${asset.quantity}, '${purchasedAt}', ${soldAt}, ${purchased}, ${asset.assetType}, ${portfolioId})`;
    }
    if (asset.typeOperation === Constante.NOM_OPERATION_TYPE.SELL) {
      soldAt = asset.date;
      purchased = 0;
      request = `INSERT INTO asset (name, amount, quantity, purchasedAt, soldAt, purchased, fk_idAssetType, fk_idWallet) VALUES ('${asset.name}', ${asset.amount}, ${asset.quantity}, ${purchasedAt}, '${soldAt}', ${purchased}, ${asset.assetType}, ${portfolioId})`;
    }

    const rows = await this.conn
      .promise()
      .query(request)
      .catch((err: any) => {
        throw new Error("Error while creating asset : " + err.message);
      })
      .then((res: any) => {
        const result = this.getAllAssetsByPortfolio(portfolioId);
        return result;
      });

    return rows;
  }

  public async updateAsset(
    portfolioId: number,
    asset: AssetForm
  ): Promise<AssetDAO[]> {
    let purchasedAt = null;
    let soldAt = null;
    let purchased = null;
    let request = "";

    if (asset.typeOperation === Constante.NOM_OPERATION_TYPE.BUY) {
      purchasedAt = asset.date;
      purchased = 1;
      request = `UPDATE asset SET name = '${asset.name}', amount = ${asset.amount}, quantity = ${asset.quantity}, purchasedAt = '${purchasedAt}', soldAt = ${soldAt}, purchased = ${purchased}, fk_idAssetType = ${asset.assetType} WHERE idAsset = ${asset.id} AND fk_idWallet = ${portfolioId}`;
    }
    if (asset.typeOperation === Constante.NOM_OPERATION_TYPE.SELL) {
      soldAt = asset.date;
      purchased = 0;
      request = `UPDATE asset SET name = '${asset.name}', amount = ${asset.amount}, quantity = ${asset.quantity}, purchasedAt = ${purchasedAt}, soldAt = '${soldAt}', purchased = ${purchased}, fk_idAssetType = ${asset.assetType} WHERE idAsset = ${asset.id} AND fk_idWallet = ${portfolioId}`;
    }
    const rows = await this.conn
      .promise()
      .query(request)
      .catch((err: any) => {
        throw new Error("Error while updating asset : " + err.message);
      })
      .then((res: any) => {
        if (asset.name) {
          const result = this.getAllOperationForOneAsset(
            portfolioId,
            asset.name
          );
          return result;
        }
      });
    return rows;
  }

  public async deleteAsset(
    assetId: number,
    assetName: string,
    portfolioId: number
  ): Promise<AssetDAO[]> {
    const rows = await this.conn
      .promise()
      .query(`DELETE FROM asset WHERE idAsset = ${assetId}`)
      .then((res: any) => {
        const result = this.getAllOperationForOneAsset(portfolioId, assetName);
        return result;
      });
    return rows;
  }

  public toDAO(assetDTO: AssetDTO): AssetDAO {
    return {
      idAsset: assetDTO.id ? assetDTO.id : -1,
      name: assetDTO.name,
      amount: assetDTO.amount,
      quantity: assetDTO.quantity,
      purchasedAt: assetDTO.valuePerPeriod[0].date,
      soldAt: assetDTO.valuePerPeriod[1].date,
      purchased: assetDTO.purchased,
      fk_idAssetType: 1,
      fk_idWallet: 1,
    };
  }

  public mappeToAssetDAO(row: any): AssetDAO {
    return {
      idAsset: row.idAsset,
      name: row.name,
      totalAmount: row.totalAmount,
      amount: row.amount,
      quantity: row.quantity,
      distribution: (row.amount / row.totalAmount) * 100,
      purchasedAt: row.purchasedAt,
      soldAt: row.soldAt,
      purchased: row.purchased === 1 ? true : false,
      fk_idAssetType: row.fk_idAssetType,
      fk_idWallet: row.fk_idWallet,
    };
  }

  public mappeToAssetTypeDAO(row: any): AssetTypeDAO {
    return {
      id: row.idAssetType,
      name: row.name,
    };
  }
}
