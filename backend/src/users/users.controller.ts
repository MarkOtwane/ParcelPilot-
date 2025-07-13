import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.gurad';
import { Roles } from '../shared/decorators/roles.decorator';
import { ChangePasswordDto } from './dto/change-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req: { user: { sub: string } }) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('update')
  updateProfile(
    @Request() req: { user: { sub: string } },
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(req.user.sub, dto);
  }

  @Patch('change-password')
  changePassword(
    @Request() req: { user: { sub: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(req.user.sub, dto);
  }

  @Delete('deactivate')
  deactivate(@Request() req: { user: { sub: string } }) {
    return this.usersService.softDeleteUser(req.user.sub);
  }

  @Roles(Role.ADMIN)
  @Get()
  getAll(@Request() req: { user: { sub: string; role: Role } }) {
    return this.usersService.getAllUsers(req.user.role);
  }
}
