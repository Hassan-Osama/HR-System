import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { EmployeeProfile, EmployeeProfileDocument } from '../employee-profile/models/employee-profile.schema';
import { EmployeeSystemRole, EmployeeSystemRoleDocument } from '../employee-profile/models/employee-system-role.schema';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { SystemRole } from '../employee-profile/enums/employee-profile.enums';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(EmployeeProfile.name)
    private employeeProfileModel: Model<EmployeeProfileDocument>,
    @InjectModel(EmployeeSystemRole.name)
    private employeeSystemRoleModel: Model<EmployeeSystemRoleDocument>,
  ) { }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const employee = await this.employeeProfileModel
      .findOne({ workEmail: loginDto.email })
      .populate('accessProfileId')
      .exec();

    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = employee.password
      ? await bcrypt.compare(loginDto.password, employee.password)
      : false;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get role information
    const accessProfile = employee.accessProfileId as any;
    const roleName = accessProfile?.roles?.[0] || SystemRole.DEPARTMENT_EMPLOYEE;

    // Create JWT payload
    const payload = {
      sub: employee._id.toString(),
      email: employee.workEmail || loginDto.email,
      role: roleName,
      roles: [roleName],
      fullName: employee.fullName || `${employee.firstName} ${employee.lastName}`,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
      expiresIn: '24h',
    });

    return {
      accessToken,
      email: employee.workEmail || loginDto.email,
      userId: employee._id.toString(),
      fullName: payload.fullName,
      role: roleName,
      isTemporaryPassword: employee.isTemporaryPassword || false,
    };
  }

  async validateUser(userId: string, email: string): Promise<any> {
    const user = await this.employeeProfileModel
      .findById(userId)
      .populate('accessProfileId')
      .exec();

    if (user && user.workEmail === email) {
      return user;
    }

    return null;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword);
    await this.employeeProfileModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      isTemporaryPassword: false,
    }).exec();
  }
}
