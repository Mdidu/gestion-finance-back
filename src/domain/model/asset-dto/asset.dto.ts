import { z } from "zod";

const AssetDTOScheme = z.object({
  id: z.number().optional(),
  name: z.string(),
  distribution: z.number().optional(),
  quantity: z.number(),
  valuePerPeriod: z.array(
    z.object({
      date: z.string(),
      value: z.number(),
      totalAmount: z.number(),
      topBuy: z.string(),
      quantity: z.number(),
      id: z.number(),
    })
  ),
  amount: z.number(),
  totalAmount: z.number().optional(),
  purchased: z.boolean(),
  assetType: z.number(),
});

const AssetFormScheme = z.object({
  id: z.number().optional(),
  name: z.string(),
  date: z.string(),
  quantity: z.number(),
  amount: z.number(),
  typeOperation: z.string(),
  assetType: z.number(),
});

/** Exportable type */
/**
 * AssetDTO
 * @type {z.ZodObject}
 * @memberof module:domain/model/asset-dto~AssetDTOScheme
 * @property {number} id - Asset id
 * @property {string} name - Asset name
 * @property {number} distribution - Asset distribution
 * @property {number} quantity - Asset quantity
 * @property {Array} valuePerPeriod - Asset value per period - Array of object with date and value
 * @property {string} valuePerPeriod.date - Asset value per period date
 * @property {number} valuePerPeriod.value - Operation amount
 * @property {number} valuePerPeriod.totalAmount - Total amount with all operation prior to this transaction
 * @property {string} valuePerPeriod.topBuy -Buy/sell transaction indicator - Value 'B' for buy and 'S' for sell
 * @property {number} valuePerPeriod.quantity - Asset quantity
 * @property {number} valuePerPeriod.id - Asset id
 * @property {number} amount - Asset amount
 * @property {number} totalAmount - Asset total amount
 * @property {boolean} purchased - Asset purchased
 * @property {number} assetType - Asset type
 *
 */
export type AssetDTO = z.infer<typeof AssetDTOScheme>;
export type AssetForm = z.infer<typeof AssetFormScheme>;
