import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BinaryLike,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from 'crypto';
import { promisify } from 'util';

import { EnvironmentVariables } from '../configuration';
import { EncryptionDto } from './encryption.dto';

const scryptAsync = promisify<BinaryLike, BinaryLike, number, Buffer>(scrypt);

const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

@Injectable()
export class EncryptionService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async encrypt<T>(data: T): Promise<EncryptionDto> {
    const iv = randomBytes(16);

    const cipher = createCipheriv(
      ENCRYPTION_ALGORITHM,
      await this.getEncryptionKey(),
      iv,
    );

    const encryptedData = Buffer.concat([
      cipher.update(JSON.stringify(data)),
      cipher.final(),
    ]);

    return {
      iv: iv.toString('hex'),
      data: encryptedData.toString('hex'),
    };
  }

  async decrypt<T>(encryptionDto: EncryptionDto): Promise<T> {
    const decipher = createDecipheriv(
      ENCRYPTION_ALGORITHM,
      await this.getEncryptionKey(),
      Buffer.from(encryptionDto.iv, 'hex'),
    );

    const decryptedData = Buffer.concat([
      decipher.update(Buffer.from(encryptionDto.data, 'hex')),
      decipher.final(),
    ]);

    return JSON.parse(decryptedData.toString());
  }

  async getEncryptionKey() {
    return scryptAsync(
      this.configService.get('ENCRYPTION_PASSWORD'),
      'GfG',
      32,
    );
  }
}
