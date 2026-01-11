import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        position: data.position,
        department: data.department,
        active: data.active ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return employee;
  }

  async update(id: number, data: UpdateEmployeeDto) {
    await this.findOne(id); 
    
    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
