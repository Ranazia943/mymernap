import express from 'express';
import {
  sendWithdrawalRequest,
  respondToWithdrawalRequest,
  fetchAllWithdrawalRequests,
  fetchWithdrawalRequestByUserId,
} from '../controllers/WithdrawController.js';
import protect from '../utils/protectroute.js';

const router = express.Router();

// User sends withdrawal request (protected route)
router.post('/request/:userid', protect, sendWithdrawalRequest);

// Admin responds to withdrawal request (unprotected route)
router.put('/response/:withdrawalId', respondToWithdrawalRequest);

// Fetch all withdrawal requests
router.get('/all', fetchAllWithdrawalRequests);

// Fetch a specific withdrawal request by ID
router.get('/:userId', fetchWithdrawalRequestByUserId);

export default router;