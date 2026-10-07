import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin, bearer } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';
import envVars from '../../config/env.js';

let authInstance = null;
let mongoClient = null;

export const getAuth = () => {
  if (!authInstance) {
    if (!mongoClient) {
      mongoClient = new MongoClient(envVars.databaseUrl);
    }
    const db = mongoClient.db();

    authInstance = betterAuth({
      database: mongodbAdapter(db, { client: mongoClient }),
      secret: envVars.betterAuthSecret,
      baseURL: `http://localhost:${envVars.port}`,
      emailAndPassword: {
        enabled: true,
      },
      plugins: [
        bearer(),
        admin({
          defaultRole: 'user',
          adminRole: 'admin',
        }),
      ],
      user: {
        additionalFields: {
          role: {
            type: 'string',
            defaultValue: 'user',
            required: false,
          },
        },
      },
    });
  }
  return authInstance;
};

export default getAuth;
