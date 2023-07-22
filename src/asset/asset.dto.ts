import { z } from "zod";

const AssetDTOScheme = z.object({
  id: z.number().optional(),
  name: z.string(),
  distribution: z.number(),
  value: z.number(),
});

/** Exportable type */
export type AssetDTO = z.infer<typeof AssetDTOScheme>;
