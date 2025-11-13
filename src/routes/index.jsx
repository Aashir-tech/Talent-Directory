import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import AddTalent from '../pages/AddTalent';
import EditTalent from '../pages/EditTalent';
import TalentDetails from '../pages/TalentDetails';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'add-talent',
        element: <AddTalent />,
      },
      {
        path: 'edit-talent/:id',
        element: <EditTalent />,
      },
      {
        path: 'talent/:id',
        element: <TalentDetails />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);