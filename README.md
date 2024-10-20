# Interactive Rule Engine Canvas

Welcome to the **Interactive Rule Engine Canvas**, a sophisticated and highly customizable tool designed to empower developers and business analysts to create, visualize, and manage complex rule sets with ease. This canvas leverages a dynamic drag-and-drop interface, allowing users to construct intricate logical rules without writing a single line of code. Whether you're building simple conditional statements or complex nested rules, our tool provides the flexibility and functionality to streamline your workflow.

## Table of Contents

1. [Features](#features)
2. [Demo](#demo)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Project Structure](#project-structure)
6. [API Endpoints](#api-endpoints)
7. [Screenshots](#screenshots)
8. [Tutorials](#tutorials)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

## Features

- **Drag and Drop Interface:** Seamlessly add conditions, operators, and containers to build your rules without any coding.
- **Nested Containers:** Group multiple rules within containers for better organization and scalability.
- **Real-time Rule Generation:** Automatically generate rule strings that reflect your diagram in real-time, ensuring accuracy and consistency.
- **Validation:** Built-in validation ensures that your rules are syntactically correct before saving.
- **Save and Export:** Save your rule configurations and export them for backend processing or further analysis.
- **Responsive Design:** Optimized for various devices and screen sizes, ensuring a consistent user experience across platforms.
- **Extensible Node Types:** Easily extendable with custom node types to accommodate specific business logic requirements.
- **Undo/Redo Functionality:** Improve user experience by allowing users to revert or reapply changes effortlessly.
- **Collaboration Support:** Share and collaborate on rule sets with team members in real-time.

## Demo

Experience the power of the Interactive Rule Engine Canvas firsthand. Watch our demo video to see how you can create and manage complex rules effortlessly.

![Demo Video Thumbnail](assets/demo-thumbnail.png)

[![Watch Demo](assets/watch-demo-button.png)](https://www.youtube.com/watch?v=your-demo-link)

## Installation

Follow these steps to set up the Interactive Rule Engine Canvas on your local machine:

### Prerequisites

- **Node.js** (v14 or later)
- **npm** (v6 or later) or **yarn**

### Steps

1. **Clone the Repository**

   Open your terminal and run:

   ```bash
   git clone https://github.com/yourusername/interactive-rule-engine-canvas.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd interactive-rule-engine-canvas
   ```

3. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

4. **Start the Development Server**

   Using npm:

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

5. **Access the Application**

   Open your browser and navigate to `http://localhost:5173/` to start using the canvas.

## Usage

Once the application is running, follow these steps to create and save your rules:

1. **Add Conditions and Operators**

   - Drag conditions (e.g., Age > 30) and operators (AND, OR) from the toolbar onto the canvas.
   - Customize each condition by double-clicking on it to set the attribute, operator, and value.

2. **Connect Nodes**

   - Click and drag from the output handle of one node to the input handle of another to establish logical connections.
   - Ensure that operators are correctly placed between conditions or containers.

3. **Group into Containers**

   - Select multiple nodes by clicking and dragging a selection box around them.
   - Click the "Wrap in Container" button to group the selected nodes into a container for better organization.

4. **Generate Rule**

   - Click the "Generate Rule" button to compile the visual rule set into a string representation.
   - A popup will display the generated rule string, allowing you to review and save it.

5. **Save Rule**

   - In the popup, click "Save Rule" to store the generated rule in the backend.
   - Upon successful save, the canvas will reset, allowing you to create new rule sets.

6. **Manage Rules**

   - Use the undo/redo buttons to revert or reapply changes.
   - Delete nodes or containers by selecting them and clicking the delete icon.

## Project Structure

Understanding the project structure is crucial for effective development and maintenance. Below is an overview of the key directories and files:

```
interactive-rule-engine-canvas/
├── .gitignore
├── package.json
├── README.md
├── yarn.lock
├── backend/
│   ├── .env
│   ├── app.js
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── controllers/
│   │   ├── ruleController.js
│   │   └── userController.js
│   ├── data/
│   │   ├── rules.json
│   │   └── users.json
│   ├── routes/
│   │   ├── ruleRoutes.js
│   │   └── userRoutes.js
│   └── utils/
│       └── astUtils.js
├── frontend/
│   ├── .env
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── yarn.lock
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── api.js
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── routes.jsx
│       ├── assets/
│       │   └── react.svg
│       ├── components/
│       │   ├── Admin/
│       │   │   ├── AttributeButton.jsx
│       │   │   ├── ConditionNode.jsx
│       │   │   ├── ConfirmationModal.jsx
│       │   │   ├── ContainerNode.jsx
│       │   │   ├── CustomNodes.jsx
│       │   │   ├── DragAndDropCanvas.jsx
│       │   │   ├── EditRuleModal.jsx
│       │   │   ├── InteractiveCanvas.jsx
│       │   │   ├── OperatorButton.jsx
│       │   │   ├── OperatorNode.jsx
│       │   │   ├── RuleLink.jsx
│       │   │   ├── RuleNode.jsx
│       │   │   ├── RuleValidationModal.jsx
│       │   │   ├── TextBasedEditor.jsx
│       │   │   └── Toolbar.jsx
│       │   ├── Shared/
│       │   │   ├── ErrorBoundary.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── Navbar.jsx
│       │   └── User/
│       │       ├── EvaluationResult.jsx
│       │       └── InputForm.jsx
│       └── pages/
│           ├── AdminPage.jsx
│           ├── CreateRulePage.jsx
│           ├── HomePage.jsx
│           ├── NotFoundPage.jsx
│           └── UserPage.jsx


```

### Key Directories and Files

- **public/**: Contains static assets like images and the main HTML file.
- **src/**: Main source code directory.
  - **components/**: Reusable React components.
    - **Admin/**: Contains administrative components like the `InteractiveCanvas`, custom node types, toolbar, and confirmation modal.
  - **api/**: API helper functions for backend communication.
  - **hooks/**: Custom React hooks for state management and other utilities.
  - **styles/**: CSS and styling files.
  - **utils/**: Utility functions and helpers.
  - **App.jsx**: Root component that integrates all parts of the application.
  - **main.jsx**: Entry point for the React application.
- **vite.config.js**: Configuration file for Vite, the build tool.
- **LICENSE**: License information for the project.

## API Endpoints

Integrate the rule engine with your backend using our API. Below are the key endpoints:

### Create Rule

- **Endpoint:** `/api/create-rule`
- **Method:** `POST`
- **Description:** Saves the generated rule string to the backend.
- **Payload:**

  ```json
  {
    "ruleString": "((Age > 20) && (Salary > 10000) && (Department == 'finance')) && (Role == 'manager')"
  }
  ```

- **Response:**

  ```json
  {
    "success": true,
    "message": "Rule saved successfully!"
  }
  ```

### Get All Rules

- **Endpoint:** `/api/rules`
- **Method:** `GET`
- **Description:** Retrieves all saved rule strings.
- **Response:**

  ```json
  {
    "success": true,
    "rules": [
      {
        "id": "rule1",
        "ruleString": "((Age > 20) && (Salary > 10000) && (Department == 'finance')) && (Role == 'manager')"
      },
      ...
    ]
  }
  ```

### Delete Rule

- **Endpoint:** `/api/delete-rule/:id`
- **Method:** `DELETE`
- **Description:** Deletes a specific rule by ID.
- **Response:**

  ```json
  {
    "success": true,
    "message": "Rule deleted successfully!"
  }
  ```

## Screenshots

Visualize the power of the Interactive Rule Engine Canvas through our screenshots.

### Main Interface

![Main Interface](assets/main-interface.png)

*Main interface showcasing the drag-and-drop functionality.*

### Rule Generation

![Rule Generation](assets/rule-generation.png)

*Generated rule string displayed in the popup.*

### Container Grouping

![Container Grouping](assets/container-grouping.png)

*Grouped conditions within a container for better organization.*

## Tutorials

Enhance your experience with our step-by-step tutorials.

### Video Tutorials

Watch our comprehensive video tutorials to master the tool.

![Tutorial Video Thumbnail](assets/tutorial-video-thumbnail.png)

[![Watch Tutorial Video](assets/watch-tutorial-button.png)](https://www.youtube.com/watch?v=your-tutorial-link)

### Written Guides

Prefer reading? Check out our written guides for detailed instructions.

- **Getting Started:** Learn the basics of using the canvas.
  - [Link to Getting Started Guide](https://yourwebsite.com/getting-started)
- **Advanced Features:** Explore advanced functionalities and tips.
  - [Link to Advanced Features Guide](https://yourwebsite.com/advanced-features)
- **API Integration:** Step-by-step guide on integrating the rule engine with your backend.
  - [Link to API Integration Guide](https://yourwebsite.com/api-integration)

## Contributing

We welcome contributions from the community! Follow these steps to contribute to the Interactive Rule Engine Canvas:

1. **Fork the Repository**

   Click the "Fork" button at the top-right corner of the repository page to create your own fork.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/yourusername/interactive-rule-engine-canvas.git
   ```

3. **Navigate to the Project Directory**

   ```bash
   cd interactive-rule-engine-canvas
   ```

4. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

5. **Make Your Changes**

   Implement your feature or bug fix.

6. **Commit Your Changes**

   ```bash
   git commit -m "Add feature: YourFeatureName"
   ```

7. **Push to Your Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

8. **Open a Pull Request**

   Navigate to the original repository and click "Compare & pull request". Provide a clear description of your changes.

### Guidelines

- **Code Quality:** Ensure your code follows the project's coding standards and is well-documented.
- **Testing:** Include relevant tests for your changes to maintain the integrity of the project.
- **Documentation:** Update the README or other documentation as needed to reflect your changes.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute it as per the license terms.

---

![Footer Image](assets/footer-image.png)

For more information, visit our [website](https://yourwebsite.com) or contact us at [support@yourwebsite.com](mailto:support@yourwebsite.com).

---

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out to us:

- **Email:** [support@yourwebsite.com](mailto:support@yourwebsite.com)
- **Website:** [https://yourwebsite.com](https://yourwebsite.com)
- **GitHub:** [https://github.com/yourusername/interactive-rule-engine-canvas](https://github.com/yourusername/interactive-rule-engine-canvas)

```

