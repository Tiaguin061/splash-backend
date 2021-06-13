import { container } from 'tsyringe';
import uploadConfig from '@config/upload';
import DiskStorageProvider from './DiskStorageProvider';
import S3StorageProvider from './S3StorageProvider';
import IStorageProvider from './models/IStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);