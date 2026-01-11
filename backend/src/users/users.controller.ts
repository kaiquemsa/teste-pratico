import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('seed-admin')
  async seedAdmin() {
    const admin = await this.usersService.ensureAdminSeed();
    return {
      message: 'Admin criado/garantido com sucesso',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));
  }

  @Post()
  async create(
    @Body()
    body: { name: string; email: string; password: string; role: Role },
  ) {
    const user = await this.usersService.create(body);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
