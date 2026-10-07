import AppError from '../../errorHelpers/appError.js';
import { Bus, RouteModel, User } from '../../../schema/index.js';

const createBusIntoDB = async (payload, createdBy) => {
  const isBusExist = await Bus.findOne({
    $or: [{ busNumber: payload.busNumber }, { licensePlate: payload.licensePlate }],
  });

  if (isBusExist) {
    throw new AppError(400, 'Bus with this bus number or license plate already exists!');
  }

  if (payload.assignedDriver) {
    const driver = await User.findById(payload.assignedDriver);
    if (!driver || driver.role !== 'driver') {
      throw new AppError(400, 'Assigned user must be an active registered driver!');
    }
  }

  if (payload.assignedRoute) {
    const route = await RouteModel.findById(payload.assignedRoute);
    if (!route) {
      throw new AppError(404, 'Assigned route does not exist!');
    }
  }

  const bus = await Bus.create({
    ...payload,
    createdBy,
  });

  return bus;
};

const getAllBusesFromDB = async (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$or = [
      { busNumber: { $regex: query.search, $options: 'i' } },
      { name: { $regex: query.search, $options: 'i' } },
      { licensePlate: { $regex: query.search, $options: 'i' } },
    ];
  }

  const buses = await Bus.find(filter)
    .populate('assignedDriver', 'name email image role')
    .populate('assignedRoute', 'routeName startPoint endPoint stops status')
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });

  return buses;
};

const getBusByIdFromDB = async (id) => {
  const bus = await Bus.findById(id)
    .populate('assignedDriver', 'name email image role')
    .populate('assignedRoute', 'routeName startPoint endPoint stops status')
    .populate('createdBy', 'name email role');

  if (!bus) {
    throw new AppError(404, 'Bus not found!');
  }

  return bus;
};

const updateBusIntoDB = async (id, payload) => {
  if (payload.assignedDriver) {
    const driver = await User.findById(payload.assignedDriver);
    if (!driver || driver.role !== 'driver') {
      throw new AppError(400, 'Assigned user must be an active registered driver!');
    }
  }

  if (payload.assignedRoute) {
    const route = await RouteModel.findById(payload.assignedRoute);
    if (!route) {
      throw new AppError(404, 'Assigned route does not exist!');
    }
  }

  const bus = await Bus.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('assignedDriver', 'name email image role')
    .populate('assignedRoute', 'routeName startPoint endPoint stops status');

  if (!bus) {
    throw new AppError(404, 'Bus not found!');
  }

  return bus;
};

const assignDriverToBus = async (busId, driverId) => {
  if (driverId) {
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      throw new AppError(400, 'User must be a registered driver!');
    }
  }

  const bus = await Bus.findByIdAndUpdate(
    busId,
    { assignedDriver: driverId || null },
    { new: true }
  ).populate('assignedDriver', 'name email image role');

  if (!bus) {
    throw new AppError(404, 'Bus not found!');
  }

  return bus;
};

const assignRouteToBus = async (busId, routeId) => {
  if (routeId) {
    const route = await RouteModel.findById(routeId);
    if (!route) {
      throw new AppError(404, 'Route not found!');
    }
  }

  const bus = await Bus.findByIdAndUpdate(
    busId,
    { assignedRoute: routeId || null },
    { new: true }
  ).populate('assignedRoute', 'routeName startPoint endPoint stops status');

  if (!bus) {
    throw new AppError(404, 'Bus not found!');
  }

  return bus;
};

const deleteBusFromDB = async (id) => {
  const bus = await Bus.findByIdAndDelete(id);
  if (!bus) {
    throw new AppError(404, 'Bus not found!');
  }
  return bus;
};

export const BusService = {
  createBusIntoDB,
  getAllBusesFromDB,
  getBusByIdFromDB,
  updateBusIntoDB,
  assignDriverToBus,
  assignRouteToBus,
  deleteBusFromDB,
};

export default BusService;
