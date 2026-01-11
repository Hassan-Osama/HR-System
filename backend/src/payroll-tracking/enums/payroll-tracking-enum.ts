export enum ClaimStatus {
    UNDER_REVIEW = 'under review',
    PENDING_MANAGER_APPROVAL = 'pending payroll Manager approval',
    APPROVED = 'approved',// when manager approves
    REJECTED = 'rejected'
}
export enum DisputeStatus {
    UNDER_REVIEW = 'under review',
    PENDING_MANAGER_APPROVAL = 'pending payroll Manager approval',
    APPROVED = 'approved',// when manager approves
    REJECTED = 'rejected'
}
export enum RefundStatus {
    PENDING = 'pending',
    PAID = 'paid' // when payroll execution
}

export enum PayrollDocumentType {
    TAX_FORM = 'Tax Form',
    INSURANCE_CERTIFICATE = 'Insurance Certificate',
    PAYSLIP = 'Payslip',
    YTD_SUMMARY = 'Year-to-Date Summary'
}
