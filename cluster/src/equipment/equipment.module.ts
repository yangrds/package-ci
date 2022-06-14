import { Module } from '@nestjs/common';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { EquipmentGateway } from './equipment.gateway';

@Module({
  controllers: [EquipmentController],
  providers: [EquipmentService, EquipmentGateway]
})
export class EquipmentModule {}
