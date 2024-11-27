export class ReceiptDto {
    id: string;
    invoiceNumber: string;
    invoiceSeries: string;
    issueDateTime: string;
    issuerCnpj: string;
    recipientCnpj: string;
    totalValue: number;

    icmsBase: number; // Base de cálculo ICMS
    icmsValue: number; // Valor ICMS
    ipiValue: number; // Valor IPI
    issValue: number; // Valor ISS
    icmsRate: number; // Alíquota ICMS
    ipiRate: number; // Alíquota IPI
    issRate: number; // Alíquota ISS

    barcodeOrAuthCode: string;
    nfeAccessKey?: string;
    nfeNumber?: string;
    nfeAuthCode?: string;
    nfeAuthDateTime?: string;
}
