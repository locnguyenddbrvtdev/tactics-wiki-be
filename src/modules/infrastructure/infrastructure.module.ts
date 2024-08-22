import { Module } from '@nestjs/common';

import { MailModule } from './mail/mail.module';
import { ExternalApiModule } from './external-api/external-api.module';

@Module({ imports: [MailModule, ExternalApiModule] })
export class InfrastructureModule {}
