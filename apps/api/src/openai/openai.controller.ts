import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('completion')
  testOpenAI(@Body('url') url: string, @Body('metadata') metadata: any) {
    return this.openaiService.getOpenAICompletion(url, metadata);
  }
}