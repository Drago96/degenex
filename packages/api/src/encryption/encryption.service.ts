import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { EnvironmentVariables } from 'src/configuration';

import { EncryptionDto } from './encryption.dto';

@Injectable()
export class EncryptionService {
  readonly algorithm = 'aes-256-cbc';

  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  encrypt<T>(data: T): EncryptionDto {
    const iv = randomBytes(16);

    const cipher = createCipheriv(
      this.algorithm,
      Buffer.from(this.configService.get('ENCRYPTION_KEY')),
      iv,
    );

    const encryptedData = Buffer.concat([
      cipher.update(JSON.stringify(data), 'hex'),
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
      Buffer.from(this.configService.get('ENCRYPTION_KEY')),
      encryptionDto.iv,
    );

    const decryptedData = Buffer.concat([
      decipher.update(encryptionDto.data, 'hex'),
      decipher.final(),
    ]);

    return JSON.parse(decryptedData.toString('hex'));
  }
}
