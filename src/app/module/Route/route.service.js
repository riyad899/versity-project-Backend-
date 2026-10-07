import AppError from '../../errorHelpers/appError.js';
import { Bus, RouteModel } from '../../../schema/index.js';

const createRouteIntoDB = async (payload, createdBy) => {
  const isRouteExist = await RouteModel.findOne({ routeName: payload.routeName });
  if (isRouteExist) {
    throw new AppError(400, 'Route with this name already exists!');
  }

  const route = await RouteModel.create({
    ...payload,
    createdBy,
  });

  return route;
};

const getAllRoutesFromDB = async (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$or = [
      { routeName: { $regex: query.search, $options: 'i' } },
      { startPoint: { $regex: query.search, $options: 'i' } },
      { endPoint: { $regex: query.search, $options: 'i' } },
    ];
  }

  const routes = await RouteModel.find(filter)
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });

  return routes;
};

const getRouteByIdFromDB = async (id) => {
  const route = await RouteModel.findById(id).populate('createdBy', 'name email role');
  if (!route) {
    throw new AppError(404, 'Route not found!');
  }

  // Also find buses assigned to this route
  const assignedBuses = await Bus.find({ assignedRoute: id })
    .populate('assignedDriver', 'name email image role')
    .select('busNumber name licensePlate capacity status assignedDriver');

  return {
    ...route.toObject(),
    assignedBuses,
  };
};

const updateRouteIntoDB = async (id, payload) => {
  const route = await RouteModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!route) {
    throw new AppError(404, 'Route not found!');
  }

  return route;
};

const deleteRouteFromDB = async (id) => {
  const route = await RouteModel.findByIdAndDelete(id);
  if (!route) {
    throw new AppError(404, 'Route not found!');
  }

  // Remove route reference from assigned buses
  await Bus.updateMany({ assignedRoute: id }, { assignedRoute: null });

  return route;
};

export const RouteService = {
  createRouteIntoDB,
  getAllRoutesFromDB,
  getRouteByIdFromDB,
  updateRouteIntoDB,
  deleteRouteFromDB,
};

export default RouteService;
