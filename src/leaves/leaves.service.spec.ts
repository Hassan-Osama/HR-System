import { Test, TestingModule } from '@nestjs/testing';
import { LeavesService } from './leaves.service';

describe('LeavesService', () => {
  let service: LeavesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeavesService],
    }).compile();

    service = module.get<LeavesService>(LeavesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
