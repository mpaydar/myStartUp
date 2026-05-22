import { careerLensFeatures } from "@/lib/careerLensMarketing";

/** Homepage hero — CareerLens product pillars. */
export const heroServices = careerLensFeatures;

export type HeroServiceAccent = (typeof heroServices)[number]["accent"];
