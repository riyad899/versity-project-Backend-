import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import RouteService from './route.service.js';

const createRoute = catchAsync(async (req, res) => {
  const createdBy = req.user.id || req.user._id;
  const result = await RouteService.createRouteIntoDB(req.body, createdBy);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Transportation route created successfully!',
    data: result,
  });
});

const getAllRoutes = catchAsync(async (req, res) => {
  const result = await RouteService.getAllRoutesFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All transportation routes fetched successfully!',
    data: result,
  });
});

const getRouteById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RouteService.getRouteByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transportation route details fetched successfully!',
    data: result,
  });
});

const updateRoute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RouteService.updateRouteIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transportation route updated successfully!',
    data: result,
  });
});

const deleteRoute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RouteService.deleteRouteFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transportation route deleted successfully!',
    data: result,
  });
});

export const RouteController = {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};

export default RouteController;
