const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController'); // Ensure correct import

// Create a new rule
router.post('/create', ruleController.createRule);

// Get all rules
router.get('/', ruleController.getRules);

// Toggle active status of a rule
router.patch('/:id/toggle', ruleController.toggleRuleActive);

// Update an existing rule
router.patch('/:id/update', ruleController.updateRule);

// Evaluate rules against user data
router.post('/evaluate', ruleController.evaluateRules);

// Delete a rule by ID
router.delete('/:id', ruleController.deleteRule);

module.exports = router;
