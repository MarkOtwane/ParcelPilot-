import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.gurad';
import { Roles } from '../shared/decorators/roles.decorator';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { PaymentsService } from './payments.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  initiate(
    @Request() req: { user: { sub: string } },
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiate(req.user.sub, dto);
  }

  @Get('my')
  getUserPayments(@Request() req: { user: { sub: string } }) {
    return this.paymentsService.getUserPayments(req.user.sub);
  }

  @Roles(Role.ADMIN)
  @Get()
  getAll(@Request() req: { user: { sub: string; role: Role } }) {
    return this.paymentsService.getAllPayments(req.user.role);
  }

  @Roles(Role.ADMIN)
  @Patch('update-status')
  update(@Body() dto: UpdatePaymentStatusDto) {
    return this.paymentsService.updateStatus(dto);
  }
}
