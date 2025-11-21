export enum BankStatus {
    VALID = 'valid',
    MISSING = 'missing',
}
export enum BonusStatus{
    PENDING='pending',
    PAID='paid',
    APPROVED='approved',
    REJECTED='rejected'
}
export enum BenefitStatus {
    PENDING = 'pending',
    PAID = 'paid',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export enum PayRollStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under review', // pending manager Approval
  PENDING_FINANCE_APPROVAL = 'pending finance approval',
  REJECTED = 'rejected',
  APPROVED = 'approved',// when both manager and finance approved
  LOCKED = 'locked',
  UNLOCKED = 'unlocked'
}
export enum PayRollPaymentStatus {
  PAID = 'paid', // when finace approved 
  PENDING = 'pending'
}
export enum PaySlipPaymentStatus {
    PENDING = 'pending',// until bank response  which is not our case
    PAID = 'paid' // when bank responds
}