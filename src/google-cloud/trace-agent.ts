import { start } from '@google-cloud/trace-agent';

export const setupGoogleTraceAgent = (cred: {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}) => {
  return start({
    projectId: cred.projectId,
    credentials: {
      client_email: cred.clientEmail,
      private_key: cred.privateKey,
    },
  });
};
