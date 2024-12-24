import express from 'express';
import currencyService from '../services/currencyService';
import { authenticate } from '../middleware/auth';
import { IUser } from '../models/User';
import { AppError } from '../utils/errors';

const router = express.Router();

router.get('/currencies', async (_req, res, next) => {
  try {
    const currencies = await currencyService.getSupportedCurrencies();
    res.json({ status: 'success', data: currencies });
  } catch (error) {
    next(error);
  }
});

router.post('/convert', authenticate, async (req, res, next) => {
  try {
    const conversion = await currencyService.convertCurrency({
      ...req.body,      
      userId: (req.user as IUser).id
      
    });
    res.status(201).json({ status: 'success', data: conversion });
  } catch (error) {
    next(error);
  }
});

router.get('/history', authenticate, async (req, res, next) => {
  try {
    const history = await currencyService.getUserConversionHistory((req.user as IUser).id);
    res.json({ status: 'success', data: history });
  } catch (error) {
    next(error);
  }
});

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

router.get('/popular', authenticate, async (_req, res, next) => {
  try {
    const popular = await currencyService.getPopularConversions();
    res.json({ status: 'success', data: popular });
  } catch (error) {
    next(error);
  }
});

export default router;
