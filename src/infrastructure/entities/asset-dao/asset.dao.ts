import { z } from "zod";

const AssetDAOScheme = z.object({
  idAsset: z.number(),
  name: z.string(),
  amount: z.number(),
  quantity: z.number(),
  distribution: z.number().optional(),
  purchasedAt: z.date(),
  soldAt: z.date(),
  purchased: z.boolean(),
  fk_idAssetType: z.number(),
  fk_idWallet: z.number(),
});

const AssetDAOArrayScheme = z.array(AssetDAOScheme);

export type AssetDAO = z.infer<typeof AssetDAOScheme>;
export type AssetDAOArray = z.infer<typeof AssetDAOArrayScheme>;
