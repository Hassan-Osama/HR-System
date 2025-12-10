import { PartialType } from '@nestjs/swagger';
import { AssignShiftDto } from './assign-shift.dto';

export class UpdateShiftDto extends PartialType(AssignShiftDto) {}
