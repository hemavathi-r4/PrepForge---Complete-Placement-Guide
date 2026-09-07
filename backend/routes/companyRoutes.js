import express from 'express';
import {
  getCompanies,
  getCompanyById,
  getCompanyQuestions
} from '../controllers/companyController.js';

const router = express.Router();

// Public routes for company management
router.get('/', getCompanies);
router.get('/:companyId', getCompanyById);
router.get('/:companyId/questions', getCompanyQuestions);

export default router;
