import { Test, TestingModule } from '@nestjs/testing';
import { EposService } from './epos.service';

describe('EposService', () => {
  let service: EposService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EposService],
    }).compile();

    service = module.get<EposService>(EposService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
