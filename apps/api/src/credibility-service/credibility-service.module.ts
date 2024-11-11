import { Module } from '@nestjs/common';
import { CredibilityScoringService } from './credibility-scoring.service';
import { CredibilityServiceController } from './credibility-service.controller';

@Module({
  providers: [CredibilityScoringService],
  controllers: [CredibilityServiceController],
  exports: [CredibilityScoringService],
})
export class CredibilityServiceModule {}
