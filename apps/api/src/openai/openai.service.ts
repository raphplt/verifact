import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { UpdateOpenaiDto } from './dto/update-openai.dto';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey, maxRetries: 5 });
  }

  create(createOpenaiDto: CreateOpenaiDto) {
    return 'This action adds a new openai';
  }

  findAll() {
    return `This action returns all openai`;
  }

  update(id: number, updateOpenaiDto: UpdateOpenaiDto) {
    return `This action updates a #${id} openai`;
  }

  remove(id: number) {
    return `This action removes a #${id} openai`;
  }

  async testOpenAI() {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Ecris moi un poème d amour' }],
      });
      return completion;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
