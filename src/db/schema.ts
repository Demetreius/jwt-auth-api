import { pgTable, uuid, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

// 1. Users Table
export const usersTable = pgTable('users', {
        id: uuid('id').defaultRandom().primaryKey(),
        email: text('email').notNull().unique(),
        password: text('password').notNull(), // Stores the Argon2 hashed password
        firstName: text('first_name'),
        lastName: text('last_name'),
        isVerified: text('is_verified').default('false').notNull(), // Optional: tracks email verification status
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex('users_email_unique').on(table.email)
    ]
);

// 2. Refresh Tokens Table (For secure mobile session persistence)
export const refreshTokensTable = pgTable('refresh_tokens', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. OTP Verification Codes Table
export const verificationCodesTable = pgTable('verification_codes', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    code: text('code').notNull(), // The OTP string (e.g., 6-digit code)
    type: text('type').notNull(), // e.g., 'EMAIL_VERIFICATION' or 'PASSWORD_RESET'
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. TypeScript Type Exports
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type RefreshToken = typeof refreshTokensTable.$inferSelect;
export type NewRefreshToken = typeof refreshTokensTable.$inferInsert;
export type VerificationCode = typeof verificationCodesTable.$inferSelect;
export type NewVerificationCode = typeof verificationCodesTable.$inferInsert;