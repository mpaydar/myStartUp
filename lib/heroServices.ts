import { careerLensFeatures } from "@/lib/careerLensMarketing";
import { siliconLensFeatures } from "@/lib/siliconLensMarketing";

/** Homepage hero — both SimBay AI platforms. */
export const heroServices = [
  ...careerLensFeatures.slice(0, 2),
  ...siliconLensFeatures.slice(0, 2),
] as const;

export type HeroServiceAccent = (typeof heroServices)[number]["accent"];
