import { firebaseAuth } from './auth-handler.firebase';
import { mockAuth } from './auth-handler.mock';

export const authzHandler = () => {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return firebaseAuth;
    default:
      return mockAuth;
  }
};