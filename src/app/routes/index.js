import { Router } from 'express';
import AdminRoutes from '../module/Admin/admin.route.js';
import AuthRoutes from '../module/Auth/auth.route.js';
import BusRoutes from '../module/Bus/bus.route.js';
import DriverRoutes from '../module/Driver/driver.route.js';
import RouteRoutes from '../module/Route/route.route.js';
import TransportationManagerRoutes from '../module/TransportationManager/transportationManager.route.js';
import UserRoutes from '../module/User/user.route.js';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/drivers',
    route: DriverRoutes,
  },
  {
    path: '/transportation-managers',
    route: TransportationManagerRoutes,
  },
  {
    path: '/buses',
    route: BusRoutes,
  },
  {
    path: '/routes',
    route: RouteRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
