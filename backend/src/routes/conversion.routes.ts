import express from 'express';
import currencyService from '../services/currencyService';
import { authenticate } from '../middleware/auth';
import { IUser } from '../models/User';
import { AppError } from '../utils/errors';

const router = express.Router();

/**
 * @route GET /currencies
 * @description Get a list of supported currencies
 * @access public
 */
router.get('/currencies', async (_req, res, next) => {
  try {
    const currencies = await currencyService.getSupportedCurrencies();
    res.json({ status: 'success', data: currencies });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /convert
 * @description Convert currency
 * @access private
 * @body {from, to, amount}
 */
router.post('/convert', authenticate, async (req, res, next) => {
  try {
    const conversion = await currencyService.convertCurrency({
      ...req.body,
      userId: (req.user as IUser).id,

    });
    res.status(201).json({ status: 'success', data: conversion });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /history
 * @description Get user's conversion history
 * @access private
 */
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const history = await currencyService.getUserConversionHistory((req.user as IUser).id);
    res.json({ status: 'success', data: history });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /historical-rates
 * @description Get historical exchange rates
 * @access private
 * @query {from, to, startDate}
 */
router.get('/historical-rates', authenticate, async (req, res, next) => {
  try {
    const { from, to, startDate } = req.query;
    if (!from || !to || !startDate) {
      throw new AppError(400, 'Missing required parameters');
    }

    const rates = await currencyService.getHistoricalRates({
      fromCurrency: from as string,
      toCurrency: to as string,
      startDate: startDate as string,
      userId: (req.user as IUser).id
    });

    res.json({ status: 'success', data: rates });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /popular
 * @description Get popular conversions
 * @access private
 */
router.get('/popular', authenticate, async (_req, res, next) => {
  try {
    const popular = await currencyService.getPopularConversions();
    res.json({ status: 'success', data: popular });
  } catch (error) {
    next(error);
  }
});

export default router;
