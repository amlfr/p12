import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import HomePage from './routes/user/user';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from './routes/error/error';
import LayoutPage from './routes/layout/layout';
import UserPage from './routes/user/user';
import { profilePageLoader } from './loader/profilePageLoader';


const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPage />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/user/:userId",
                element: <UserPage />,
                loader: profilePageLoader,
            },
           
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);

