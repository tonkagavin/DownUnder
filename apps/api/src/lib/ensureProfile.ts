import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { profiles, users } from '../db/schema.js';
import { loadProfileContext } from '../services/checkService.js';

export const ensureProfileContext = async (userId: string) => {
  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (existing[0]) return loadProfileContext(userId);

  await db
    .insert(users)
    .values({
      id: userId,
      tenantId: 'tenant-demo',
      role: 'patient',
      authSubject: `${userId}@product.local`,
      createdAt: new Date()
    })
    .onConflictDoNothing();

  const profileId = `profile-${userId}`.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
  await db
    .insert(profiles)
    .values({
      id: profileId,
      userId,
      displayName: null,
      ageYears: null,
      smoker: false,
      bmiBand: 'unknown',
      conditionFlags: []
    })
    .onConflictDoNothing();

  return loadProfileContext(userId);
};
