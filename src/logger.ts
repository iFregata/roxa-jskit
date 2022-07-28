import bunyan from 'bunyan';
import { LoggingBunyan } from '@google-cloud/logging-bunyan';

export function setupLogger(meta: {
  name: string;
  id: string;
  version: string;
}): bunyan;
export function setupLogger(
  meta: { name: string; id: string; version: string },
  serviceObject: { projectId: string; clientEmail: string; privateKey: string }
): bunyan;
export function setupLogger(
  meta: { name: string; id: string; version: string },
  serviceObject?: { projectId: string; clientEmail: string; privateKey: string }
): bunyan {
  const env = process.env.NODE_ENV;
  if (serviceObject && (env === 'dev' || env === 'staging' || env === 'prod')) {
    return createBunyanLog(
      meta.id,
      meta.version,
      meta.name,
      serviceObject.projectId,
      serviceObject.clientEmail,
      serviceObject.privateKey
    );
  }
  // default?
  return bunyan.createLogger({
    name: `${meta.name} on ${process.env.NODE_ENV}`,
    level: 20,
    app_id: meta.id,
  });
}

function createBunyanLog(
  appId: string,
  versionName: string,
  serviceName: string,
  projectId: string,
  clientEmail: string,
  privateKey: string
): bunyan {
  // Creates a Bunyan Stackdriver Logging client
  const loggingBunyan = new LoggingBunyan({
    projectId: projectId,
    serviceContext: {
      service: serviceName,
      version: versionName,
    },
    credentials:
      clientEmail && privateKey
        ? {
            client_email: clientEmail,
            private_key: privateKey,
          }
        : undefined,
  });
  // Create a Bunyan logger that streams to Cloud Logging
  // Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log"
  return bunyan.createLogger({
    name: serviceName,
    app_id: appId,
    level: 'info',
    streams: [loggingBunyan.stream('info')],
  });
}
/*
 *
 * Imports the Google Cloud client library for Bunyan
 *
 * "fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
 * "error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
 * "warn" (40): A note on something that should probably be looked at by an operator eventually.
 * "info" (30): Detail on regular operation.
 * "debug" (20): Anything else, i.e. too verbose to be included in "info" level.
 * "trace" (10): Logging from external libraries used by your app or very detailed application logging.
 */
