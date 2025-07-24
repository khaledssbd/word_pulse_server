import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import os from 'os';
import router from './app/routes';
import notFound from './app/utils/notFound';
import globalErrorHandler from './app/utils/globalErrorHandler';
import cookieParser from 'cookie-parser';
import config from './app/config';

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  const currentDateTime = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const serverHostname = os.hostname();
  const serverPlatform = os.platform();
  const serverUptime = os.uptime();
  res.send({
    success: true,
    message: `Welcome to ${config.app.application_name} Server`,
    version: config.app.application_version,
    clientDetails: {
      ipAddress: clientIp,
      accessedAt: currentDateTime,
    },
    serverDetails: {
      hostname: serverHostname,
      platform: serverPlatform,
      uptime: `${Math.floor(serverUptime / 60 / 60)} hours ${Math.floor(
        (serverUptime / 60) % 60
      )} minutes`,
    },
    developerContact: {
      email: 'khaledssbd@gmail.com',
      website: 'https://khaled-siddique.vercel.app',
    },
  });
});

// all routes
app.use('/api/v1', router);

// global error handler
app.use(globalErrorHandler);

// not found route handler
app.use(notFound);

export default app;
