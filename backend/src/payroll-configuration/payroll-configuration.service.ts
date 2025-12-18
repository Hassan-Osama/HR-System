import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// ===== MODELS =====
import { payType, payTypeDocument } from './models/payType.schema';
import { payGrade } from './models/payGrades.schema';
import { allowance } from './models/allowance.schema';
import { insuranceBrackets } from './models/insuranceBrackets.schema';
import { taxRules } from './models/taxRules.schema';
import { benefit, benefitDocument } from './models/benefit.schema';
import { signingBonus } from './models/signingBonus.schema';
import { payrollPolicies } from './models/payrollPolicies.schema';
import { CompanyWideSettings } from './models/CompanyWideSettings.schema';
import { configBackup, configBackupDocument } from './models/configBackup.schema';
import { ConfigStatus } from './enums/payroll-configuration-enums';

// ===== DTOs =====
import { CreatePayTypeDto, UpdatePayTypeDto } from './dto/pay-type.dto';
import { CreatePayGradeDto, UpdatePayGradeDto } from './dto/pay-grade.dto';
import { CreateAllowanceDto, UpdateAllowanceDto } from './dto/allowance.dto';
import {
  CreateInsuranceBracketDto,
  UpdateInsuranceBracketDto,
} from './dto/insurance-bracket.dto';
import { CreateTaxRuleDto, UpdateTaxRuleDto } from './dto/tax-rule.dto';
import { CreateBenefitDto, UpdateBenefitDto } from './dto/benefit.dto';
import {
  CreateSigningBonusDto,
  UpdateSigningBonusDto,
} from './dto/signing-bonus.dto';
import {
  CreatePayrollPolicyDto,
  UpdatePayrollPolicyDto,
} from './dto/payroll-policy.dto';
import { UpdateCompanySettingsDto } from './dto/company-settings.dto';

@Injectable()
export class PayrollConfigurationService {
  constructor(
    // PAY TYPES
    @InjectModel(payType.name)
    private readonly payTypeModel: Model<payTypeDocument>,

    // PAY GRADES
    @InjectModel(payGrade.name)
    private readonly payGradeModel: Model<any>,

    // ALLOWANCES
    @InjectModel(allowance.name)
    private readonly allowanceModel: Model<any>,

    // INSURANCE BRACKETS
    @InjectModel(insuranceBrackets.name)
    private readonly insuranceBracketsModel: Model<any>,

    // TAX RULES
    @InjectModel(taxRules.name)
    private readonly taxRulesModel: Model<any>,

    // BENEFITS
    @InjectModel(benefit.name)
    private readonly benefitModel: Model<benefitDocument>,

    // SIGNING BONUSES
    @InjectModel(signingBonus.name)
    private readonly signingBonusModel: Model<any>,

    // PAYROLL POLICIES
    @InjectModel(payrollPolicies.name)
    private readonly payrollPoliciesModel: Model<any>,

    // COMPANY SETTINGS
    @InjectModel(CompanyWideSettings.name)
    private readonly companySettingsModel: Model<any>,

    // CONFIG BACKUPS
    @InjectModel(configBackup.name)
    private readonly configBackupModel: Model<configBackupDocument>,
  ) { }

  /* ==========================
   *          PAY TYPES
   * ========================== */

  async createPayType(dto: CreatePayTypeDto) {
    return new this.payTypeModel(dto).save();
  }

  async getPayTypes() {
    return this.payTypeModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async updatePayType(id: string, dto: UpdatePayTypeDto) {
    const updated = await this.payTypeModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Pay type not found');
    return updated;
  }

  async deletePayType(id: string) {
    const deleted = await this.payTypeModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Pay type not found');
    return deleted;
  }

  /* ==========================
   *          PAY GRADES
   * ========================== */

  async createPayGrade(dto: CreatePayGradeDto) {
    return new this.payGradeModel(dto).save();
  }

  async getPayGrades() {
    return this.payGradeModel.find().lean().exec();
  }

  async updatePayGrade(id: string, dto: UpdatePayGradeDto) {
    const updated = await this.payGradeModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Pay grade not found');
    return updated;
  }

  async deletePayGrade(id: string) {
    const deleted = await this.payGradeModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Pay grade not found');
    return deleted;
  }

  /* ==========================
   *          ALLOWANCES
   * ========================== */

  async createAllowance(dto: CreateAllowanceDto) {
    return new this.allowanceModel(dto).save();
  }

  async getAllowances() {
    return this.allowanceModel.find().lean().exec();
  }

  async updateAllowance(id: string, dto: UpdateAllowanceDto) {
    const updated = await this.allowanceModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Allowance not found');
    return updated;
  }

  async deleteAllowance(id: string) {
    const deleted = await this.allowanceModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Allowance not found');
    return deleted;
  }

  /* ==========================
   *     INSURANCE BRACKETS
   * ========================== */

  async createInsuranceBracket(dto: CreateInsuranceBracketDto) {
    return new this.insuranceBracketsModel(dto).save();
  }

  async getInsuranceBrackets() {
    return this.insuranceBracketsModel.find().lean().exec();
  }

  async updateInsuranceBracket(id: string, dto: UpdateInsuranceBracketDto) {
    const updated = await this.insuranceBracketsModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    );
    if (!updated) throw new NotFoundException('Insurance bracket not found');
    return updated;
  }

  async deleteInsuranceBracket(id: string) {
    const deleted = await this.insuranceBracketsModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted) throw new NotFoundException('Insurance bracket not found');
    return deleted;
  }



  /* ==========================
   *          BENEFITS
   * ========================== */

  async createBenefit(dto: CreateBenefitDto) {
    return new this.benefitModel(dto).save();
  }

  async getBenefits() {
    return this.benefitModel.find().lean().exec();
  }

  async updateBenefit(id: string, dto: UpdateBenefitDto) {
    const updated = await this.benefitModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Benefit not found');
    return updated;
  }

  async deleteBenefit(id: string) {
    const deleted = await this.benefitModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Benefit not found');
    return deleted;
  }

  /* ==========================
   *      SIGNING BONUSES
   * ========================== */

  async createSigningBonus(dto: CreateSigningBonusDto) {
    return new this.signingBonusModel(dto).save();
  }

  async getSigningBonuses() {
    return this.signingBonusModel.find().lean().exec();
  }

  async updateSigningBonus(id: string, dto: UpdateSigningBonusDto) {
    const updated = await this.signingBonusModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Signing bonus not found');
    return updated;
  }

  async deleteSigningBonus(id: string) {
    const deleted = await this.signingBonusModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted) throw new NotFoundException('Signing bonus not found');
    return deleted;
  }

  /* ==========================
   *      PAYROLL POLICIES
   * ========================== */

  async createPayrollPolicy(dto: CreatePayrollPolicyDto) {
    return new this.payrollPoliciesModel(dto).save();
  }

  async getPayrollPolicies() {
    return this.payrollPoliciesModel.find().lean().exec();
  }

  async updatePayrollPolicy(id: string, dto: UpdatePayrollPolicyDto) {
    const updated = await this.payrollPoliciesModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Policy not found');
    return updated;
  }

  async deletePayrollPolicy(id: string) {
    const deleted = await this.payrollPoliciesModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted) throw new NotFoundException('Policy not found');
    return deleted;
  }

  /* ==========================
   *      COMPANY SETTINGS
   * ========================== */

  async getCompanySettings() {
    return this.companySettingsModel.findOne().lean().exec();
  }

  async updateCompanySettings(dto: UpdateCompanySettingsDto) {
    return this.companySettingsModel.findOneAndUpdate({}, dto, {
      new: true,
      upsert: true,
    });
  }

  /* ==========================
   *      CONFIG BACKUPS
   * ========================== */

  async runConfigBackup(triggeredBy?: string) {
    const [
      payTypes,
      payGrades,
      allowances,
      insurance,
      taxes,
      benefits,
      signingBonuses,
      policies,
      companySettings,
    ] = await Promise.all([
      this.payTypeModel.find().lean(),
      this.payGradeModel.find().lean(),
      this.allowanceModel.find().lean(),
      this.insuranceBracketsModel.find().lean(),
      this.taxRulesModel.find().lean(),
      this.benefitModel.find().lean(),
      this.signingBonusModel.find().lean(),
      this.payrollPoliciesModel.find().lean(),
      this.companySettingsModel.findOne().lean(),
    ]);

    const backup = new this.configBackupModel({
      backupType: 'PAYROLL_CONFIGURATION',
      triggeredBy: triggeredBy || undefined,
      data: {
        payTypes,
        payGrades,
        allowances,
        insuranceBrackets: insurance,
        taxRules: taxes,
        benefits,
        signingBonuses,
        payrollPolicies: policies,
        companySettings,
      },
    });

    return backup.save();
  }

  async getConfigBackups() {
    return this.configBackupModel.find().sort({ createdAt: -1 }).exec();
  }

  async getConfigBackupById(id: string) {
    const backup = await this.configBackupModel.findById(id).exec();
    if (!backup) throw new NotFoundException('Backup not found');
    return backup;
  }

  async deleteConfigBackup(id: string) {
    const deleted = await this.configBackupModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Backup not found');
    return deleted;
  }

  async restoreConfigBackup(id: string, restoredBy?: string) {
    const backup = await this.configBackupModel.findById(id).exec();
    if (!backup) throw new NotFoundException('Backup not found');

    const backupData = backup.data;

    try {
      // Restore all configuration data
      // Clear existing data first, then restore from backup
      await Promise.all([
        // Clear existing data
        this.payTypeModel.deleteMany({}),
        this.payGradeModel.deleteMany({}),
        this.allowanceModel.deleteMany({}),
        this.insuranceBracketsModel.deleteMany({}),
        this.taxRulesModel.deleteMany({}),
        this.benefitModel.deleteMany({}),
        this.signingBonusModel.deleteMany({}),
        this.payrollPoliciesModel.deleteMany({}),
        this.companySettingsModel.deleteMany({}),
      ]);

      // Restore data from backup
      // Clean the data to remove Mongoose-specific fields and ensure _id is handled properly
      const cleanDocument = (doc: any) => {
        if (!doc) return null;
        const cleaned = { ...doc };
        // Remove Mongoose-specific fields that might cause issues
        delete cleaned.__v;
        // Keep _id if it exists, Mongoose will handle it
        return cleaned;
      };

      // Use insertMany with ordered: false to allow partial success
      const insertOptions = { ordered: false };

      await Promise.all([
        backupData.payTypes?.length > 0
          ? this.payTypeModel
            .insertMany(
              backupData.payTypes.map(cleanDocument).filter((d) => d !== null),
              insertOptions,
            )
            .catch((err) => {
              console.error('Error restoring payTypes:', err);
              throw err;
            })
          : Promise.resolve(),
        backupData.payGrades?.length > 0
          ? this.payGradeModel
            .insertMany(
              backupData.payGrades.map(cleanDocument).filter((d) => d !== null),
              insertOptions,
            )
            .catch((err) => {
              console.error('Error restoring payGrades:', err);
              throw err;
            })
          : Promise.resolve(),
        backupData.allowances?.length > 0
          ? this.allowanceModel
            .insertMany(
              backupData.allowances.map(cleanDocument).filter((d) => d !== null),
              insertOptions,
            )
            .catch((err) => {
              console.error('Error restoring allowances:', err);
              throw err;
            })
          : Promise.resolve(),
        backupData.insuranceBrackets?.length > 0
          ? this.insuranceBracketsModel
            .insertMany(
              backupData.insuranceBrackets
                .map(cleanDocument)
                .filter((d) => d !== null),
              insertOptions,
            )
            .catch((err) => {
              console.error('Error restoring insuranceBrackets:', err);
              throw err;
            })
          : Promise.resolve(),
        backupData.taxRules?.length > 0
          ? this.taxRulesModel
            .insertMany(
              backupData.taxRules.map(cleanDocument).filter((d) => d !== null),
              insertOptions,
            )
            .catch((err) => {
              console.error('Error restoring taxRules:', err);
              throw err;
            })
          : Promise.resolve(),
        backupData.benefits?.length > 0
          ? this.benefitModel
            .insertMany(
              backupData.benefits.map(cleanDocument).filter((d) => d !== null),
              insertOptions,
            )
            .catch((err) => {
              console.error('Error restoring benefits:', err);
              throw err;
            })
          : Promise.resolve(),
        backupData.signingBonuses?.length > 0
          ? this.signingBonusModel
            .insertMany(
              backupData.signingBonuses
                .map(cleanDocument)
                .filter((d) => d !== null),
              insertOptions,
            )
            .catch((err) => {
              console.error('Error restoring signingBonuses:', err);
              throw err;
            })
          : Promise.resolve(),
        backupData.payrollPolicies?.length > 0
          ? this.payrollPoliciesModel
            .insertMany(
              backupData.payrollPolicies
                .map(cleanDocument)
                .filter((d) => d !== null),
              insertOptions,
            )
            .catch((err) => {
              console.error('Error restoring payrollPolicies:', err);
              throw err;
            })
          : Promise.resolve(),
        backupData.companySettings
          ? this.companySettingsModel
            .create(cleanDocument(backupData.companySettings))
            .catch((err) => {
              console.error('Error restoring companySettings:', err);
              throw err;
            })
          : Promise.resolve(),
      ]);

      return {
        message: 'Configuration restored successfully from backup',
        backupId: id,
        restoredAt: new Date(),
        restoredBy: restoredBy || undefined,
      };
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw new Error(
        `Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /* ==========================
   *    GENERIC APPROVAL HELPERS
   * ========================== */

  private async approveConfig(model: Model<any>, id: string, approvedBy?: string) {
    const updated = await model.findByIdAndUpdate(
      id,
      {
        status: ConfigStatus.APPROVED,
        approvedBy: approvedBy || undefined,
        approvedAt: new Date(),
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Configuration item not found');
    }

    return updated;
  }

  private async rejectConfig(model: Model<any>, id: string, approvedBy?: string) {
    const updated = await model.findByIdAndUpdate(
      id,
      {
        status: ConfigStatus.REJECTED,
        approvedBy: approvedBy || undefined,
        approvedAt: new Date(),
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Configuration item not found');
    }

    return updated;
  }

  /* ==========================
   *       PAY TYPE APPROVAL
   * ========================== */

  approvePayType(id: string, approvedBy?: string) {
    return this.approveConfig(this.payTypeModel, id, approvedBy);
  }

  rejectPayType(id: string, approvedBy?: string) {
    return this.rejectConfig(this.payTypeModel, id, approvedBy);
  }

  /* ==========================
   *     PAY GRADE APPROVAL
   * ========================== */

  approvePayGrade(id: string, approvedBy?: string) {
    return this.approveConfig(this.payGradeModel, id, approvedBy);
  }

  rejectPayGrade(id: string, approvedBy?: string) {
    return this.rejectConfig(this.payGradeModel, id, approvedBy);
  }

  /* ==========================
   *     ALLOWANCE APPROVAL
   * ========================== */

  approveAllowance(id: string, approvedBy?: string) {
    return this.approveConfig(this.allowanceModel, id, approvedBy);
  }

  rejectAllowance(id: string, approvedBy?: string) {
    return this.rejectConfig(this.allowanceModel, id, approvedBy);
  }

  /* ==========================
   *  INSURANCE BRACKET APPROVAL
   * ========================== */

  approveInsuranceBracket(id: string, approvedBy?: string) {
    return this.approveConfig(this.insuranceBracketsModel, id, approvedBy);
  }

  rejectInsuranceBracket(id: string, approvedBy?: string) {
    return this.rejectConfig(this.insuranceBracketsModel, id, approvedBy);
  }

  /* ==========================
 *          TAX RULES
 * ========================== */

  async createTaxRule(dto: any) {
    const rate = Number(dto.rate);
    const bracketFrom = Number(dto.bracketFrom);
    const bracketTo = Number(dto.bracketTo);

    if (Number.isNaN(rate) || rate < 0) {
      throw new Error('Invalid rate');
    }

    return new this.taxRulesModel({
      code: dto.code,
      name: dto.name,
      description: dto.description,
      bracketFrom,
      bracketTo,
      rate,
    }).save();
  }


  async getTaxRules() {
    return this.taxRulesModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async updateTaxRule(id: string, dto: UpdateTaxRuleDto) {
    const update: any = {
      ...(dto.code !== undefined ? { code: dto.code.trim() } : {}),
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.bracketFrom !== undefined ? { bracketFrom: Number(dto.bracketFrom) } : {}),
      ...(dto.bracketTo !== undefined ? { bracketTo: Number(dto.bracketTo) } : {}),
      ...(dto.rate !== undefined ? { rate: Number(dto.rate) } : {}),
    };

    // prevent NaN from ever going to mongoose
    if (update.rate !== undefined && (Number.isNaN(update.rate) || update.rate < 0)) {
      throw new NotFoundException('Invalid rate');
    }

    const updated = await this.taxRulesModel.findByIdAndUpdate(id, update, { new: true });
    if (!updated) throw new NotFoundException('Tax rule not found');
    return updated;
  }
  /* ==========================
 *          TAX RULES
 * ========================== */

  async deleteTaxRule(id: string) {
    const deleted = await this.taxRulesModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Tax rule not found');
    return deleted;
  }

  approveTaxRule(id: string, approvedBy?: string) {
    return this.approveConfig(this.taxRulesModel, id, approvedBy);
  }

  rejectTaxRule(id: string, approvedBy?: string) {
    return this.rejectConfig(this.taxRulesModel, id, approvedBy);
  }



  /* ==========================
   *       BENEFIT APPROVAL
   * ========================== */

  approveBenefit(id: string, approvedBy?: string) {
    return this.approveConfig(this.benefitModel, id, approvedBy);
  }

  rejectBenefit(id: string, approvedBy?: string) {
    return this.rejectConfig(this.benefitModel, id, approvedBy);
  }

  /* ==========================
   *   SIGNING BONUS APPROVAL
   * ========================== */

  approveSigningBonus(id: string, approvedBy?: string) {
    return this.approveConfig(this.signingBonusModel, id, approvedBy);
  }

  rejectSigningBonus(id: string, approvedBy?: string) {
    return this.rejectConfig(this.signingBonusModel, id, approvedBy);
  }

  /* ==========================
   *   PAYROLL POLICY APPROVAL
   * ========================== */

  approvePayrollPolicy(id: string, approvedBy?: string) {
    return this.approveConfig(this.payrollPoliciesModel, id, approvedBy);
  }

  rejectPayrollPolicy(id: string, approvedBy?: string) {
    return this.rejectConfig(this.payrollPoliciesModel, id, approvedBy);
  }

  /* ==========================
   *   GET ALL PENDING CONFIGS
   * ========================== */

  async getAllPendingConfigurations() {
    const statusFilter = { status: 'draft' }; // ConfigStatus.DRAFT

    const [
      payTypes,
      payGrades,
      allowances,
      insuranceBrackets,
      taxRules,
      benefits,
      signingBonuses,
      payrollPolicies,
    ] = await Promise.all([
      this.payTypeModel.find(statusFilter).lean(),
      this.payGradeModel.find(statusFilter).lean(),
      this.allowanceModel.find(statusFilter).lean(),
      this.insuranceBracketsModel.find(statusFilter).lean(),
      this.taxRulesModel.find(statusFilter).lean(),
      this.benefitModel.find(statusFilter).lean(),
      this.signingBonusModel.find(statusFilter).lean(),
      this.payrollPoliciesModel.find(statusFilter).lean(),
    ]);

    return {
      payTypes: payTypes.map((item) => ({
        ...item,
        configType: 'pay-types',
      })),
      payGrades: payGrades.map((item) => ({
        ...item,
        configType: 'pay-grades',
      })),
      allowances: allowances.map((item) => ({
        ...item,
        configType: 'allowances',
      })),
      insuranceBrackets: insuranceBrackets.map((item) => ({
        ...item,
        configType: 'insurance-brackets',
      })),
      taxRules: taxRules.map((item) => ({
        ...item,
        configType: 'tax-rules',
      })),
      benefits: benefits.map((item) => ({
        ...item,
        configType: 'benefits',
      })),
      signingBonuses: signingBonuses.map((item) => ({
        ...item,
        configType: 'signing-bonuses',
      })),
      payrollPolicies: payrollPolicies.map((item) => ({
        ...item,
        configType: 'policies',
      })),
    };
  }
}
