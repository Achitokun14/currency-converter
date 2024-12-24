export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface ConversionHistory {
    _id: string;
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    result: number;
    rate: number;
    date: string;
  }