import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';

import { EnvironmentVariables } from '../configuration';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class MailerService {
  private readonly ses: aws.SES;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.ses = new aws.SES({
      region: this.configService.getOrThrow('AWS_REGION'),
    });
  }

  async sendEmail(emailDto: EmailDto) {
    const sesTransport = nodemailer.createTransport({
      SES: {
        ses: this.ses,
        aws,
      },
    });

    return sesTransport.sendMail({
      from: this.configService.getOrThrow('MAILER_SOURCE_EMAIL'),
      to: emailDto.receiver,
      subject: emailDto.subject,
      html: emailDto.body,
    });
  }
}
