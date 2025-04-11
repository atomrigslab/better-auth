create table "user" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" boolean not null, "image" text, "createdAt" timestamp not null, "updatedAt" timestamp not null);

create table "session" ("id" text not null primary key, "expiresAt" timestamp not null, "token" text not null unique, "createdAt" timestamp not null, "updatedAt" timestamp not null, "ipAddress" text, "userAgent" text, "userId" text not null references "user" ("id"));

create table "account" ("id" text not null primary key, "accountId" text not null, "providerId" text not null, "userId" text not null references "user" ("id"), "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" timestamp, "refreshTokenExpiresAt" timestamp, "scope" text, "password" text, "createdAt" timestamp not null, "updatedAt" timestamp not null);

create table "verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" timestamp not null, "createdAt" timestamp, "updatedAt" timestamp);

create table "wallet" ("id" text not null primary key, "userId" text not null, "name" text not null, "address" text not null, "createdAt" timestamp not null, "updatedAt" timestamp not null);

create table "pga" ("id" text not null primary key, "userId" text not null, "mid" text not null, "createdAt" timestamp not null, "updatedAt" timestamp not null);

create table "jwks" ("id" text not null primary key, "publicKey" text not null, "privateKey" text not null, "createdAt" timestamp not null);

-- Create index on "user" table for email field
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user" ("email");

-- Create index on "account" table for userId field
CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account" ("userId");

-- Create indexes on "session" table for userId and token fields
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session" ("userId");
CREATE INDEX IF NOT EXISTS "idx_session_token" ON "session" ("token");

-- Create index on "verification" table for identifier field
CREATE INDEX IF NOT EXISTS "idx_verification_identifier" ON "verification" ("identifier");

-- Create indexes on "pga" table for userId and mid fields
CREATE INDEX IF NOT EXISTS "idx_pga_userId" ON "pga" ("userId");
CREATE INDEX IF NOT EXISTS "idx_pga_mid" ON "pga" ("mid");
-- CREATE INDEX IF NOT EXISTS "idx_pga_userId_mid" ON "pga" ("userId", "mid");

-- Create indexes on "wallet" table for address and userId fields
CREATE INDEX IF NOT EXISTS "idx_wallet_address" ON "wallet" ("address");
CREATE INDEX IF NOT EXISTS "idx_wallet_userId" ON "wallet" ("userId");