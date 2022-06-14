import { Test, TestingModule } from '@nestjs/testing';
import { ProcessService } from './process.service';

describe('ProcessService', () => {
  let service: ProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessService],
    }).compile();

    service = module.get<ProcessService>(ProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
