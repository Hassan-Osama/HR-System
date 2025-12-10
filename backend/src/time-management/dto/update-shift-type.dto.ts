import { PartialType } from '@nestjs/swagger';
import { CreateShiftTypeDto } from './create-shift-type.dto';

export class UpdateShiftTypeDto extends PartialType(CreateShiftTypeDto) {}
