import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ParcelsService } from './parcels.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelStatusDto } from './dto/update-parcel-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Post('create')
  createParcel(@Request() req, @Body() dto: CreateParcelDto) {
    return this.parcelsService.createParcel(req.user.sub, dto);
  }

  @Get('my')
  listParcels(@Request() req) {
    return this.parcelsService.listUserParcels(req.user.sub);
  }

  @Roles(Role.ADMIN)
  @Patch('update-status')
  updateStatus(@Request() req, @Body() dto: UpdateParcelStatusDto) {
    return this.parcelsService.updateStatus(req.user.sub, dto, req.user.role);
  }
}
