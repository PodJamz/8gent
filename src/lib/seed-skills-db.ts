/**
 * Skills Database Migration Utility
 *
 * This utility migrates skills from the static TypeScript registry
 * to the Convex database for real-time, scalable storage.
 *
 * Usage:
 *   import { seedAllSkills } from '@/lib/seed-skills-db';
 *   await seedAllSkills(convexMutation);
 */

import { SKILLS_REGISTRY, type SkillDefinition } from "./skills-registry";

type SeedResult = {
  action: "inserted" | "updated";
  skillId: string;
};

type MutationFn = (args: { skill: SkillDefinition }) => Promise<SeedResult>;

/**
 * Seed all skills from the TypeScript registry to Convex database
 * @param mutation The Convex seedSkillFromRegistry mutation
 * @returns Results of the seeding operation
 */
export async function seedAllSkills(
  mutation: MutationFn
): Promise<{
  total: number;
  inserted: number;
  updated: number;
  errors: Array<{ skillId: string; error: string }>;
}> {
  const results = {
    total: SKILLS_REGISTRY.length,
    inserted: 0,
    updated: 0,
    errors: [] as Array<{ skillId: string; error: string }>,
  };

  console.log(`[Seed] Starting migration of ${SKILLS_REGISTRY.length} skills...`);

  for (const skill of SKILLS_REGISTRY) {
    try {
      const result = await mutation({ skill });

      if (result.action === "inserted") {
        results.inserted++;
      } else {
        results.updated++;
      }

      console.log(`[Seed] ${result.action}: ${skill.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.errors.push({ skillId: skill.id, error: errorMessage });
      console.error(`[Seed] Failed: ${skill.id} - ${errorMessage}`);
    }
  }

  console.log(
    `[Seed] Complete! Inserted: ${results.inserted}, Updated: ${results.updated}, Errors: ${results.errors.length}`
  );

  return results;
}

/**
 * Seed skills in batches to avoid overwhelming the database
 * @param mutation The Convex seedSkillFromRegistry mutation
 * @param batchSize Number of skills to seed per batch
 * @param delayMs Delay between batches in milliseconds
 */
export async function seedAllSkillsBatched(
  mutation: MutationFn,
  batchSize = 10,
  delayMs = 100
): Promise<{
  total: number;
  inserted: number;
  updated: number;
  errors: Array<{ skillId: string; error: string }>;
}> {
  const results = {
    total: SKILLS_REGISTRY.length,
    inserted: 0,
    updated: 0,
    errors: [] as Array<{ skillId: string; error: string }>,
  };

  console.log(
    `[Seed] Starting batched migration of ${SKILLS_REGISTRY.length} skills (batch size: ${batchSize})...`
  );

  for (let i = 0; i < SKILLS_REGISTRY.length; i += batchSize) {
    const batch = SKILLS_REGISTRY.slice(i, i + batchSize);

    const batchPromises = batch.map(async (skill) => {
      try {
        const result = await mutation({ skill });
        return { success: true, action: result.action, skillId: skill.id };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, skillId: skill.id, error: errorMessage };
      }
    });

    const batchResults = await Promise.all(batchPromises);

    for (const result of batchResults) {
      if (result.success) {
        if (result.action === "inserted") {
          results.inserted++;
        } else {
          results.updated++;
        }
      } else {
        results.errors.push({ skillId: result.skillId, error: result.error || "Unknown error" });
      }
    }

    console.log(`[Seed] Batch ${Math.floor(i / batchSize) + 1} complete (${i + batch.length}/${SKILLS_REGISTRY.length})`);

    // Delay between batches
    if (i + batchSize < SKILLS_REGISTRY.length && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  console.log(
    `[Seed] Complete! Inserted: ${results.inserted}, Updated: ${results.updated}, Errors: ${results.errors.length}`
  );

  return results;
}

/**
 * Get a summary of what would be seeded
 */
export function getSeedingSummary(): {
  total: number;
  byCategory: Record<string, number>;
  byRarity: Record<string, number>;
  bySources: Record<string, number>;
} {
  const byCategory: Record<string, number> = {};
  const byRarity: Record<string, number> = {};
  const bySources: Record<string, number> = {};

  for (const skill of SKILLS_REGISTRY) {
    byCategory[skill.category] = (byCategory[skill.category] || 0) + 1;
    byRarity[skill.rarity] = (byRarity[skill.rarity] || 0) + 1;

    const source = skill.source?.author || "8gent (Original)";
    bySources[source] = (bySources[source] || 0) + 1;
  }

  return {
    total: SKILLS_REGISTRY.length,
    byCategory,
    byRarity,
    bySources,
  };
}
