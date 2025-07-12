import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  initiate(@Request() req, @Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiate(req.user.sub, dto);
  }

  @Get('my')
  getUserPayments(@Request() req) {
    return this.paymentsService.getUserPayments(req.user.sub);
  }

  @Roles(Role.ADMIN)
  @Get()
  getAll(@Request() req) {
    return this.paymentsService.getAllPayments(req.user.role);
  }

  @Roles(Role.ADMIN)
  @Patch('update-status')
  update(@Body() dto: UpdatePaymentStatusDto) {
    return this.paymentsService.updateStatus(dto);
  }
}
