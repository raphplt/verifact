import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('test')
  testOpenAI(@Body('input') input: string) {
    return this.openaiService.testOpenAI(input);
  }
}
