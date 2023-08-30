import { z } from "zod";

const AssetDAOScheme = z.object({
  idAsset: z.number(),
  name: z.string(),
  amount: z.number(),
  totalAmount: z.number().optional(),
  quantity: z.number(),
  distribution: z.number().optional(),
  purchasedAt: z.string(),
  soldAt: z.string(),
  purchased: z.boolean(),
  fk_idAssetType: z.number(),
  fk_idWallet: z.number(),
});

const AssetDAOArrayScheme = z.array(AssetDAOScheme);

export type AssetDAO = z.infer<typeof AssetDAOScheme>;
export type AssetDAOArray = z.infer<typeof AssetDAOArrayScheme>;
