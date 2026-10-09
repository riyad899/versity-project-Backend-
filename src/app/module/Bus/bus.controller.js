import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import BusService from './bus.service.js';

const createBus = catchAsync(async (req, res) => {
  const createdBy = req.user.id || req.user._id;
  const result = await BusService.createBusIntoDB(req.body, createdBy);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Campus bus added successfully!',
    data: result,
  });
});

const getAllBuses = catchAsync(async (req, res) => {
  const result = await BusService.getAllBusesFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All campus buses fetched successfully!',
    data: result,
  });
});

const getBusById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BusService.getBusByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Campus bus details fetched successfully!',
    data: result,
  });
});

const updateBus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BusService.updateBusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Campus bus information updated successfully!',
    data: result,
  });
});

const assignDriver = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { driverId } = req.body;
  const result = await BusService.assignDriverToBus(id, driverId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: driverId ? 'Driver assigned to bus successfully!' : 'Driver unassigned from bus successfully!',
    data: result,
  });
});

const assignRoute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { routeId } = req.body;
  const result = await BusService.assignRouteToBus(id, routeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: routeId ? 'Route assigned to bus successfully!' : 'Route unassigned from bus successfully!',
    data: result,
  });
});

const deleteBus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BusService.deleteBusFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Campus bus deleted successfully!',
    data: result,
  });
});

export const BusController = {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  assignDriver,
  assignRoute,
  deleteBus,
};

export default BusController;
