import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PayrollConfigurationController } from './payroll-configuration.controller';
import { PayrollConfigurationService } from './payroll-configuration.service';
import { RolesGuard } from './guards/roles.guard';

// ===== MODELS – EXACT NAMES FROM YOUR PROJECT =====
import { payType, payTypeSchema } from './models/payType.schema';
import { payGrade, payGradeSchema } from './models/payGrades.schema';
import { allowance, allowanceSchema } from './models/allowance.schema';
import {
  insuranceBrackets,
  insuranceBracketsSchema,
} from './models/insuranceBrackets.schema';
import { taxRules, taxRulesSchema } from './models/taxRules.schema';
import { benefit, benefitSchema } from './models/benefit.schema';
import {
  signingBonus,
  signingBonusSchema,
} from './models/signingBonus.schema';
import {
  payrollPolicies,
  payrollPoliciesSchema,
} from './models/payrollPolicies.schema';
import {
  CompanyWideSettings,
  CompanyWideSettingsSchema,
} from './models/CompanyWideSettings.schema';
import {
  configBackup,
  configBackupSchema,
} from './models/configBackup.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: payType.name, schema: payTypeSchema },
      { name: payGrade.name, schema: payGradeSchema },
      { name: allowance.name, schema: allowanceSchema },
      { name: insuranceBrackets.name, schema: insuranceBracketsSchema },
      { name: taxRules.name, schema: taxRulesSchema },
      { name: benefit.name, schema: benefitSchema },
      { name: signingBonus.name, schema: signingBonusSchema },
      { name: payrollPolicies.name, schema: payrollPoliciesSchema },
      { name: CompanyWideSettings.name, schema: CompanyWideSettingsSchema },
      { name: configBackup.name, schema: configBackupSchema },
    ]),
  ],
  controllers: [PayrollConfigurationController],
  providers: [PayrollConfigurationService, RolesGuard],
  exports: [PayrollConfigurationService],
})
export class PayrollConfigurationModule {}
