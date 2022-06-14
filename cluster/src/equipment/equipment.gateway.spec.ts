import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentGateway } from './equipment.gateway';

describe('EquipmentGateway', () => {
  let gateway: EquipmentGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentGateway],
    }).compile();

    gateway = module.get<EquipmentGateway>(EquipmentGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
