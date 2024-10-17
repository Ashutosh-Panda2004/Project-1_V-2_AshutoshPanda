// // frontend/src/routes.jsx

// import React from 'react';
// import { Switch, Route } from 'react-router-dom';
// import AdminPage from './pages/AdminPage';
// import UserPage from './pages/UserPage';
// import NotFoundPage from './pages/NotFoundPage';

// const Routes = () => (
//   <Switch>
//     <Route exact path="/" component={UserPage} />
//     <Route path="/admin" component={AdminPage} />
//     <Route component={NotFoundPage} />
//   </Switch>
// );

// export default Routes;














// frontend/src/routes.jsx

import React from 'react';
import { Routes as Switch, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import NotFoundPage from './pages/NotFoundPage';

const Routes = () => (
  <Switch>
    <Route path="/" element={<UserPage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Switch>
);

export default Routes;
