// backend/controllers/ruleController.js


const fs = require('fs').promises;
const path = require('path');
const jsep = require('jsep'); // Ensure jsep is installed: npm install jsep
const { evaluateAST } = require('../utils/astUtils'); // Correctly import evaluateAST
const { parseRuleToAST } = require('../utils/astUtils'); // Assuming you have a utils file for AST functions
const { v4: uuidv4 } = require('uuid');

const rulesFilePath = path.join(__dirname, '../data/rules.json');

/**
 * Helper Function: Read JSON File
 * Reads and parses a JSON file. If the file doesn't exist, returns an empty array.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Promise<Array>} - Parsed JSON data as an array.
 */
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error.code === 'ENOENT') return [];
    throw error; // Propagate other errors
  }
};

/**
 * Helper Function: Write JSON File
 * Writes data to a JSON file, stringifying it with indentation for readability.
 * @param {string} filePath - Path to the JSON file.
 * @param {Array} data - Data to write to the file.
 * @returns {Promise<void>}
 */
const writeJSON = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error; // Propagate errors
  }
};

/**
 * Controller: Create a New Rule
 * Handles the creation of a new rule by parsing the rule string, generating a unique ID,
 * and storing it in the rules JSON file.
 * 
 * Endpoint: POST /api/rules/create
 * 
 * Request Body:
 * {
 *   "ruleString": "(salary > 200) AND (age < 30)"
 * }
 * 
 * Response:
 * {
 *   "message": "Rule created successfully",
 *   "rule": { ...newRule }
 * }
 */
exports.createRule = async (req, res) => {
    try {
      console.log('Received payload:', req.body);
  
      const { ruleString } = req.body;
  
      if (!ruleString || typeof ruleString !== 'string') {
        return res.status(400).json({ error: 'Invalid rule string.' });
      }
  
      // Try parsing the rule to an AST
      let ruleAST;
      try {
        ruleAST = parseRuleToAST(ruleString); // Parsing logic
        console.log('Parsed AST:', ruleAST);  // Log the result to see if parsing worked
      } catch (error) {
        console.error('Error parsing rule string:', error.message);
        return res.status(400).json({ error: 'Error parsing rule string. Invalid syntax.' });
      }
  
      // Create a new rule object
      const newRule = {
        rule_id: uuidv4(),
        ruleString,
        rule_ast: ruleAST,
        active: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
  
      // Read existing rules from the JSON file
      const rules = await readJSON(rulesFilePath);
  
      // Add the new rule to the array
      rules.push(newRule);
  
      // Write the updated rules back to the JSON file
      await writeJSON(rulesFilePath, rules);
  
      res.status(201).json({ message: 'Rule created successfully.', rule: newRule });
    } catch (error) {
      console.error('Error creating rule:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  
  

/**
 * Controller: Get All Rules
 * Retrieves all rules stored in the rules JSON file.
 * 
 * Endpoint: GET /api/rules
 * 
 * Response:
 * [
 *   { ...rule1 },
 *   { ...rule2 },
 *   ...
 * ]
 */
exports.getRules = async (req, res) => {
  try {
    const rules = await readJSON(rulesFilePath);
    res.status(200).json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Controller: Toggle Active Status of a Rule
 * Toggles the 'active' status of a specified rule.
 * 
 * Endpoint: PATCH /api/rules/:id/toggle
 * 
 * Request Body:
 * {
 *   "active": true
 * }
 * 
 * Response:
 * {
 *   "message": "Rule status updated successfully.",
 *   "rule": { ...updatedRule }
 * }
 */
exports.toggleRuleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    // Validate that 'active' is a boolean
    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: 'Active status must be a boolean.' });
    }

    // Read existing rules
    const rules = await readJSON(rulesFilePath);

    // Find the rule by ID
    const ruleIndex = rules.findIndex((rule) => rule.rule_id === id);

    // If rule not found, respond with 404
    if (ruleIndex === -1) {
      return res.status(404).json({ error: 'Rule not found.' });
    }

    // Toggle the active status
    rules[ruleIndex].active = active;
    rules[ruleIndex].updated_at = new Date();

    // Write the updated rules back to the JSON file
    await writeJSON(rulesFilePath, rules);

    // Respond with the updated rule
    res.status(200).json({ message: 'Rule status updated successfully.', rule: rules[ruleIndex] });
  } catch (error) {
    console.error('Error toggling rule status:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Controller: Update an Existing Rule
 * Updates the 'ruleString' and 'rule_ast' of a specified rule.
 * 
 * Endpoint: PATCH /api/rules/:id/update
 * 
 * Request Body:
 * {
 *   "ruleString": "(salary > 250) AND (age < 35)"
 * }
 * 
 * Response:
 * {
 *   "message": "Rule updated successfully.",
 *   "rule": { ...updatedRule }
 * }
 */
exports.updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { ruleString } = req.body;

    // Validate that ruleString is provided
    if (!ruleString) {
      return res.status(400).json({ error: 'Rule string is required for updating.' });
    }

    // Read existing rules
    const rules = await readJSON(rulesFilePath);

    // Find the rule by ID
    const ruleIndex = rules.findIndex((rule) => rule.rule_id === id);

    // If rule not found, respond with 404
    if (ruleIndex === -1) {
      return res.status(404).json({ error: 'Rule not found.' });
    }

    // Parse the new rule string into an AST
    const newRuleAST = parseRuleToAST(ruleString);

    // Update the rule's properties
    rules[ruleIndex].ruleString = ruleString;
    rules[ruleIndex].rule_ast = newRuleAST;
    rules[ruleIndex].updated_at = new Date();

    // Write the updated rules back to the JSON file
    await writeJSON(rulesFilePath, rules);

    // Respond with the updated rule
    res.status(200).json({ message: 'Rule updated successfully.', rule: rules[ruleIndex] });
  } catch (error) {
    console.error('Error updating rule:', error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Controller: Evaluate Rules Against User Data
 * Evaluates active rules against provided user data to determine eligibility.
 * 
 * Endpoint: POST /api/rules/evaluate
 * 
 * Request Body:
 * {
 *   "salary": 250,
 *   "age": 25
 * }
 * 
 * Response:
 * {
 *   "eligible": true
 * }
 */
// exports.evaluateRules = async (req, res) => {
//     try {
//       const userData = req.body;
  
//       // Log received data
//       console.log('Received user data:', userData);
  
//       // Read rules from JSON
//       const rulesData = await fs.readFile(rulesFilePath, 'utf8');
//       const rules = JSON.parse(rulesData);
  
//       // Log active rules
//       const activeRules = rules.filter(rule => rule.active);
//       console.log('Active rules:', activeRules);
  
//       let isEligible = false;
  
//       // Evaluate each active rule
//       for (const rule of activeRules) {
//         try {
//           console.log(`Evaluating rule ${rule.rule_id}:`, rule.ruleString);
//           const ast = jsep(rule.ruleString);
//           const result = evaluateAST(ast, userData);
//           console.log(`Result for rule ${rule.rule_id}:`, result);
//           if (result) {
//             isEligible = true;
//             console.log(`User is eligible based on rule ${rule.rule_id}.`);
//             break; // If any rule is satisfied, the user is eligible
//           } else {
//             console.log(`User does not satisfy rule ${rule.rule_id}.`);
//           }
//         } catch (err) {
//           console.error(`Error evaluating rule ${rule.rule_id}:`, err.message);
//         }
//       }
  
//       res.status(200).json({ eligible: isEligible });
//     } catch (error) {
//       console.error('Error evaluating rules:', error.message);
//       res.status(400).json({ error: 'Failed to evaluate rules.' });
//     }
//   };



exports.evaluateRules = async (req, res) => {
  try {
    const userData = req.body;

    // Log received data
    console.log('Received user data:', userData);

    // Read rules from JSON
    const rulesData = await fs.readFile(rulesFilePath, 'utf8');
    const rules = JSON.parse(rulesData);

    // Log active rules
    const activeRules = rules.filter(rule => rule.active);
    console.log('Active rules:', activeRules);

    let isEligible = false;

    // Evaluate each active rule
    for (const rule of activeRules) {
      try {
        console.log(`Evaluating rule ${rule.rule_id}:`, rule.ruleString);
        
        // Use the pre-parsed AST from the rule, do not parse again with jsep
        const ast = rule.rule_ast; 

        // Evaluate the AST with the provided user data
        const result = evaluateAST(ast, userData);
        console.log(`Result for rule ${rule.rule_id}:`, result);

        if (result) {
          isEligible = true;
          console.log(`User is eligible based on rule ${rule.rule_id}.`);
          break; // If any rule is satisfied, the user is eligible
        } else {
          console.log(`User does not satisfy rule ${rule.rule_id}.`);
        }
      } catch (err) {
        console.error(`Error evaluating rule ${rule.rule_id}:`, err.message);
      }
    }

    res.status(200).json({ eligible: isEligible });
  } catch (error) {
    console.error('Error evaluating rules:', error.message);
    res.status(400).json({ error: 'Failed to evaluate rules.' });
  }
};


/**
 * Controller: Delete a Rule by ID
 * 
 * Endpoint: DELETE /api/rules/:id
 * 
 * Response:
 * {
 *   "message": "Rule deleted successfully"
 * }
 */
exports.deleteRule = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Log the ID for debugging
      console.log(`Deleting rule with ID: ${id}`);
  
      // Read existing rules
      const rules = await readJSON(rulesFilePath);
  
      // Log the rules before deletion
      console.log('Current rules:', rules);
  
      // Find the rule by ID
      const ruleIndex = rules.findIndex((rule) => rule.rule_id === id);
  
      // If rule not found, respond with 404
      if (ruleIndex === -1) {
        console.log(`Rule with ID ${id} not found.`);
        return res.status(404).json({ error: 'Rule not found.' });
      }
  
      // Remove the rule from the array
      rules.splice(ruleIndex, 1);
  
      // Log the rules after deletion
      console.log('Updated rules:', rules);
  
      // Write the updated rules back to the JSON file
      await writeJSON(rulesFilePath, rules);
  
      res.status(200).json({ message: 'Rule deleted successfully.' });
    } catch (error) {
      console.error('Error deleting rule:', error.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  


















