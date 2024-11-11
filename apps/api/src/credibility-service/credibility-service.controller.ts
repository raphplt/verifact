import { Controller, Post, Body } from '@nestjs/common';
import { CredibilityScoringService } from './credibility-scoring.service';

@Controller('credibility')
export class CredibilityServiceController {
  constructor(
    private readonly credibilityScoringService: CredibilityScoringService,
  ) {}

  @Post('/analyze')
  async analyzeContent(@Body('content') content: string) {
    return await this.credibilityScoringService.analyzeContent(content);
  }
}
