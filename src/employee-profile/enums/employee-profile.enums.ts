export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
  RETIRED = 'RETIRED',
  PROBATION = 'PROBATION',
  TERMINATED = 'TERMINATED',
}

export enum ContractType {
  FULL_TIME_CONTRACT = 'FULL_TIME_CONTRACT',
  PART_TIME_CONTRACT = 'PART_TIME_CONTRACT',
} // to be checked with Recruitment SubSystem

export enum WorkType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
} // to be checked with Recruitment SubSystem

export enum SystemRole {
  DEPARTMENT_EMPLOYEE = 'department employee',
  DEPARTMENT_HEAD = 'department head',
  HR_MANAGER = 'HR Manager',
  HR_EMPLOYEE = 'HR Employee',
  PAYROLL_SPECIALIST = 'Payroll Specialist',
  PAYROLL_MANAGER = 'Payroll Manager',
  SYSTEM_ADMIN = 'System Admin',
  LEGAL_POLICY_ADMIN = 'Legal & Policy Admin',
  RECRUITER = 'Recruiter',
  FINANCE_STAFF = 'Finance Staff',
  JOB_CANDIDATE = 'Job Candidate',
  HR_ADMIN = 'HR Admin',
}

export enum CandidateStatus {
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER_SENT = 'OFFER_SENT',
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum GraduationType {
  UNDERGRADE = 'UNDERGRADE',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  PHD = 'PHD',
  OTHER = 'OTHER',
}

export enum ProfileChangeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}
