import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';

import { EnvironmentVariables } from 'src/configuration';
import { EncryptionDto } from './encryption.dto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';

  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  encrypt<T>(data: T): EncryptionDto {
    const iv = randomBytes(16);

    const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);

    const encryptedData = Buffer.concat([
      cipher.update(JSON.stringify(data)),
      cipher.final(),
    ]);

    return {
      iv: iv.toString('hex'),
      data: encryptedData.toString('hex'),
    };
  }

  decrypt<T>(encryptionDto: EncryptionDto): T {
    const decipher = createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      Buffer.from(encryptionDto.iv, 'hex'),
    );

    const decryptedData = Buffer.concat([
      decipher.update(Buffer.from(encryptionDto.data, 'hex')),
      decipher.final(),
    ]);

    return JSON.parse(decryptedData.toString());
  }

  get encryptionKey() {
    return scryptSync(this.configService.get('ENCRYPTION_PASSWORD'), 'GfG', 32);
  }
}
