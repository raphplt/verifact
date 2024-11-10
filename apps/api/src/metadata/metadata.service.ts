import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CreateMetadatumDto } from './dto/create-metadatum.dto';

@Injectable()
export class MetadataService {
  async getMetadata(url: string) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const title =
        $("meta[property='og:title']").attr('content') || $('title').text();
      const description =
        $("meta[property='og:description']").attr('content') ||
        $("meta[name='description']").attr('content');
      const image = $("meta[property='og:image']").attr('content');

      // Extraire le nom du site à partir de l'URL
      const siteName = new URL(url).hostname;

      return { title, description, image, siteName };
    } catch (error) {
      throw new Error('Error fetching metadata: ' + error);
    }
  }

  create(createMetadatumDto: CreateMetadatumDto) {
    return 'This action adds a new metadatum';
  }

  findAll() {
    return `This action returns all metadata`;
  }
}
