export interface PrivatExchange {
    bank: string;
    baseCurrency: number;
    baseCurrencyLit: string;
    date: string;
    exchangeRate: {
        baseCurrency: string
        currency: string,
        purchaseRateNB: number,
        saleRateNB: number,
        saleRate: number,
        purchaseRate: number
    }[];
}