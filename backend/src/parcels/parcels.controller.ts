import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.gurad';
import { Roles } from '../shared/decorators/roles.decorator';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelStatusDto } from './dto/update-parcel-status.dto';
import { ParcelsService } from './parcels.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Roles(Role.ADMIN)
  @Post('create')
  createParcel(
    @Request() req: { user: { sub: string } },
    @Body() dto: CreateParcelDto,
  ) {
    return this.parcelsService.createParcel(req.user.sub, dto);
  }

  @Get('my')
  listParcels(@Request() req: { user: { sub: string } }) {
    console.log('=== PARCELS CONTROLLER - LIST PARCELS ===');
    console.log('Request user:', req.user);
    console.log('User sub:', req.user.sub);
    return this.parcelsService.listUserParcels(req.user.sub);
  }

  @Roles(Role.ADMIN)
  @Get()
  getAllParcels(@Request() req: { user: { sub: string; role: Role } }) {
    return this.parcelsService.getAllParcels(req.user.role);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  getParcelById(
    @Request() req: { user: { sub: string; role: Role } },
    @Param('id') id: string,
  ) {
    return this.parcelsService.getParcelById(id, req.user.role);
  }

  @Roles(Role.ADMIN)
  @Patch('update-status')
  updateStatus(
    @Request() req: { user: { sub: string; role: Role } },
    @Body() dto: UpdateParcelStatusDto,
  ) {
    return this.parcelsService.updateStatus(req.user.sub, dto, req.user.role);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  updateParcel(
    @Request() req: { user: { sub: string; role: Role } },
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.parcelsService.updateParcel(id, dto, req.user.role);
  }

  @Patch('my/:id')
  updateMyParcel(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.parcelsService.updateUserParcel(req.user.sub, id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteParcel(
    @Request() req: { user: { sub: string; role: Role } },
    @Param('id') id: string,
  ) {
    return this.parcelsService.deleteParcel(id, req.user.role);
  }

  @Delete('my/:id')
  deleteMyParcel(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
  ) {
    return this.parcelsService.deleteUserParcel(req.user.sub, id);
  }
}
