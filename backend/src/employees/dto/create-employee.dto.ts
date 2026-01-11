import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
