// src/services/currencyService.ts
import { z } from 'zod';
import { Conversion, IConversion } from '../models/Conversion';
import { AppError } from '../utils/errors';

const CurrencySchema = z.object({
  amount: z.number().positive(),
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
  userId: z.string()
});

export class CurrencyService {
  private readonly baseUrl = 'https://api.frankfurter.app';

  /**
   * Retrieves a list of supported currencies from the Frankfurter API.
   * @returns A promise that resolves to an array of strings representing the supported currencies.
   */
  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/currencies`);
      if (!response.ok) throw new AppError(response.status, 'Failed to fetch currencies');
      const data = await response.json() as { [key: string]: string };
      // Return an array of supported currencies
      return Object.keys(data);
      
    } catch (error) {
      throw new AppError(500, 'Currency service unavailable');
    }
  }

  /**
   * Converts a given amount of currency from one currency to another using the Frankfurter API.
   * @param data - An object containing the amount, fromCurrency, toCurrency, and userId.
   * @returns A promise that resolves to an IConversion object representing the conversion result.
   */
  async convertCurrency(data: z.infer<typeof CurrencySchema>): Promise<IConversion> {
    try {
      // Validate input
      const validated = CurrencySchema.parse(data);
      
      const response = await fetch(
        `${this.baseUrl}/latest?amount=${validated.amount}&from=${validated.fromCurrency}&to=${validated.toCurrency}`
      );
      
      if (!response.ok) {
        throw new AppError(response.status, 'Invalid conversion request');
      }

      const result = (await response.json()) as { rates: { [key: string]: number } };
      const rate = result.rates[validated.toCurrency];
      
      // Save conversion to database
      const conversion = await Conversion.create({
        user: validated.userId,
        fromCurrency: validated.fromCurrency,
        toCurrency: validated.toCurrency,
        amount: validated.amount,
        result: rate * validated.amount,
        rate: rate,
        date: new Date()
      });

      return conversion;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(400, 'Invalid input format');
      }
      throw error;
    }
  }

  /**
   * Retrieves historical exchange rates for a given currency pair between a start and end date.
   * @param params - An object containing the fromCurrency, toCurrency, startDate, and userId.
   * @returns A promise that resolves to an array of IConversion objects representing the historical rates.  Currently only supports fetching data for a single day.
   * @throws {AppError} If the API request fails or the input is invalid.
   * 
   */
  async getHistoricalRates(params: {
    fromCurrency: string,
    toCurrency: string,
    startDate: string,
    userId: string
  }): Promise<IConversion[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${params.startDate}..?from=${params.fromCurrency}&to=${params.toCurrency}`
      );
      
      if (!response.ok) {
        throw new AppError(response.status, 'Failed to fetch historical rates');
      }

      const data = (await response.json()) as { rates: { [key: string]: { [key: string]: number } } };
      
      // Store historical data in database
      const conversions = await Promise.all(
        Object.entries(data.rates).map(([date, rates]: [string, any]) =>
          Conversion.create({
            user: params.userId,
            fromCurrency: params.fromCurrency,
            toCurrency: params.toCurrency,
            amount: 1,
            result: rates[params.toCurrency], 
            rate: rates[params.toCurrency], 
            date
          })
        )
      );

      return conversions;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to process historical rates');
    }
  }

  /**
   * Retrieves the conversion history for a given user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of IConversion objects representing the user's conversion history.
   */
  async getUserConversionHistory(userId: string): Promise<IConversion[]> {
    return Conversion.find({ user: userId })
      .sort({ date: -1 })
      .limit(10);
  }

  /**
   * Retrieves the 5 most popular currency conversions.
   * @returns A promise that resolves to an array of objects representing the popular conversions.  Each object contains the fromCurrency, toCurrency, count, and avgRate.
   * 
   */
  async getPopularConversions(): Promise<any> {
    return Conversion.aggregate([
      {
        $group: {
          _id: {
            fromCurrency: "$fromCurrency",
            toCurrency: "$toCurrency"
          },
          count: { $sum: 1 },
          avgRate: { $avg: "$rate" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
  }
}

export default new CurrencyService();
