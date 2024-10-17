// backend/controllers/userController.js

const fs = require('fs').promises;
const path = require('path');
const { evaluateAST } = require('../utils/astUtils');
const { v4: uuidv4 } = require('uuid');

// Paths to JSON files
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper function to read JSON file
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

// Helper function to write JSON file
const writeJSON = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
};

// Evaluate user data against all stored rules
exports.evaluateUser = async (req, res) => {
  try {
    const userData = req.body;
    if (!userData) {
      return res.status(400).json({ error: 'User data is required' });
    }

    // Fetch all rules from rules.json
    const rulesFilePath = path.join(__dirname, '../data/rules.json');
    const rulesData = await fs.readFile(rulesFilePath, 'utf-8');
    const rules = rulesData ? JSON.parse(rulesData) : [];

    let isEligible = false;

    for (const rule of rules) {
      try {
        if (rule.active) {
          isEligible = evaluateAST(rule.rule_ast, userData);
          if (isEligible) break; // Exit early if any rule is satisfied
        }
      } catch (err) {
        console.error(`Error evaluating rule ${rule.rule_id}:`, err.message);
      }
    }

    // Store the evaluation result
    const newUserEvaluation = {
      id: uuidv4(),
      user_data: userData,
      evaluation_result: isEligible,
      evaluated_at: new Date(),
    };

    const users = await readJSON(usersFilePath);
    users.push(newUserEvaluation);
    await writeJSON(usersFilePath, users);

    res.status(200).json({ eligible: isEligible });
  } catch (error) {
    console.error('Error evaluating user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
