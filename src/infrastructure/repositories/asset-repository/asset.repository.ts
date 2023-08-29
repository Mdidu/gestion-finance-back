import { Inject, Injectable } from "@nestjs/common";
import { AssetRepository } from "src/domain/repositories/asset-repository/asset.repository";
import { AssetTypeDAO } from "src/infrastructure/entities/asset-type-dao/asset-type.dao";
import { DateToolsService } from "src/lib/tools/date-tools/date-tools.service";
import { AssetDTO } from "../../../domain/model/asset-dto/asset.dto";
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
    assetId: number
  ): Promise<AssetDAO[]> {
    const [row] = await this.conn
      .promise()
      .query(
        `SELECT name FROM asset WHERE fk_idWallet = ${portfolioId} AND idAsset = ${assetId} LIMIT 1`
      );

    const assetName = row[0].name;
    const [rows] = await this.conn
      .promise()
      .query(
        `SELECT * FROM asset WHERE fk_idWallet = ${portfolioId} AND name = '${assetName}'`
      );
    console.log(rows, "rrrrrrrrrrrrrrr");
    const listAssetDAO: AssetDAO[] = rows.map((row: any) =>
      this.mappeToAssetDAO(row)
    );
    return listAssetDAO;
  }

  public async createAsset(
    asset: any,
    portfolioId: number
  ): Promise<AssetDAO[]> {
    let purchasedAt = null;
    let soldAt = null;
    let purchased = null;
    let request = "";

    if (asset.typeOperation === "buy") {
      purchasedAt = asset.date;
      purchased = 1;
      request = `INSERT INTO asset (name, amount, quantity, purchasedAt, soldAt, purchased, fk_idAssetType, fk_idWallet) VALUES ('${asset.name}', ${asset.amount}, ${asset.quantity}, '${purchasedAt}', ${soldAt}, ${purchased}, ${asset.assetType}, ${portfolioId})`;
    }
    if (asset.typeOperation === "sell") {
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
    asset: AssetDTO
  ): Promise<AssetDAO> {
    let purchasedAt = null;
    let soldAt = null;

    if (asset.purchased) {
      purchasedAt = DateToolsService.formatDateToDateString(
        new Date(asset.valuePerPeriod[0].date)
      );
    } else {
      soldAt = DateToolsService.formatDateToDateString(
        new Date(asset.valuePerPeriod[0].date)
      );
    }
    const rows = await this.conn
      .promise()
      .query(
        `UPDATE asset SET name = '${asset.name}', amount = ${asset.amount}, quantity = ${asset.quantity}, purchasedAt = ${purchasedAt}, soldAt = ${soldAt}, purchased = ${asset.purchased}, fk_idAssetType = ${asset.assetType} WHERE idAsset = ${asset.id} AND fk_idWallet = ${portfolioId}`
      );
    const assetDAO = this.mappeToAssetDAO(rows);
    return assetDAO;
  }

  public async deleteAsset(assetId: number): Promise<AssetDAO> {
    const rows = await this.conn
      .promise()
      .query(`DELETE FROM asset WHERE idAsset = ${assetId}`);
    const assetDAO = this.mappeToAssetDAO(rows);
    return assetDAO;
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
