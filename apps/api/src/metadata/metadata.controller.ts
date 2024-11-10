import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadatumDto } from './dto/create-metadatum.dto';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get()
  getMetadata(@Query('url') url: string) {
    return this.metadataService.getMetadata(url);
  }

  @Post()
  create(@Body() createMetadatumDto: CreateMetadatumDto) {
    return this.metadataService.create(createMetadatumDto);
  }

  @Get()
  findAll() {
    return this.metadataService.findAll();
  }
}
