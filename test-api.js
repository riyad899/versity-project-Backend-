/**
 * Automated API Endpoints Test Suite
 * Tests Health Check, User Signup/Login/Profile, Admin Signup/Login/Management, and Security Guards.
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5009';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passedTests = 0;
let failedTests = 0;

function logTest(title, passed, details = '') {
  if (passed) {
    passedTests++;
    console.log(`${colors.green}✔ PASS:${colors.reset} ${title}`);
  } else {
    failedTests++;
    console.log(`${colors.red}✖ FAIL:${colors.reset} ${title} - ${details}`);
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    let data = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    return {
      status: res.status,
      headers: res.headers,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      error: error.message,
    };
  }
}

async function runTests() {
  console.log(`\n${colors.bold}${colors.cyan}========================================`);
  console.log(`  STARTING API ENDPOINT TEST SUITE`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`========================================${colors.reset}\n`);

  const timestamp = Date.now();
  const testUser = {
    name: `Test User ${timestamp}`,
    email: `user_${timestamp}@example.com`,
    password: 'password123',
  };

  const testAdmin = {
    name: `Test Admin ${timestamp}`,
    email: `admin_${timestamp}@example.com`,
    password: 'adminpassword123',
  };

  let userToken = '';
  let userCookie = '';
  let userId = '';
  let adminToken = '';
  let adminCookie = '';

  // 1. Health Check
  {
    const res = await request('/');
    const ok = res.status === 200 && res.data?.success === true;
    logTest('Health Check GET /', ok, `Status: ${res.status}`);
  }

  // 2. Validation Error on Signup (Invalid Request Body)
  {
    const res = await request('/api/v1/users/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid-email' }),
    });
    const ok = res.status === 400 && res.data?.success === false;
    logTest('Validation Error Handling POST /api/v1/users/signup', ok, `Status: ${res.status}`);
  }

  // 3. User Sign Up
  {
    const res = await request('/api/v1/users/signup', {
      method: 'POST',
      body: JSON.stringify(testUser),
    });

    userToken = res.data?.data?.token;
    userId = res.data?.data?.user?.id || res.data?.data?.user?._id;
    const setCookie = res.headers?.get('set-cookie');
    if (setCookie) userCookie = setCookie.split(';')[0];

    const ok = res.status === 201 && res.data?.success === true && !!(userToken || userCookie);
    logTest('User Sign Up POST /api/v1/users/signup', ok, `Status: ${res.status}`);
  }

  // 4. User Login
  {
    const res = await request('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    if (res.data?.data?.token) userToken = res.data.data.token;
    const setCookie = res.headers?.get('set-cookie');
    if (setCookie) userCookie = setCookie.split(';')[0];

    const ok = res.status === 200 && res.data?.success === true;
    logTest('User Login POST /api/v1/users/login', ok, `Status: ${res.status}`);
  }

  // 5. Get User Profile (/api/v1/users/me)
  {
    const headers = {};
    if (userToken) headers['Authorization'] = `Bearer ${userToken}`;
    if (userCookie) headers['Cookie'] = userCookie;

    const res = await request('/api/v1/users/me', {
      method: 'GET',
      headers,
    });

    const ok = res.status === 200 && res.data?.success === true;
    logTest('Get Current User Profile GET /api/v1/users/me (Protected)', ok, `Status: ${res.status}`);
  }

  // 6. Update User Profile (/api/v1/users/update-me)
  {
    const headers = {};
    if (userToken) headers['Authorization'] = `Bearer ${userToken}`;
    if (userCookie) headers['Cookie'] = userCookie;

    const res = await request('/api/v1/users/update-me', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ name: `${testUser.name} (Updated)` }),
    });

    const ok = res.status === 200 && res.data?.success === true;
    logTest('Update User Profile PATCH /api/v1/users/update-me', ok, `Status: ${res.status}`);
  }

  // 7. Admin Sign Up
  {
    const res = await request('/api/v1/admin/signup', {
      method: 'POST',
      body: JSON.stringify(testAdmin),
    });

    adminToken = res.data?.data?.token;
    const setCookie = res.headers?.get('set-cookie');
    if (setCookie) adminCookie = setCookie.split(';')[0];

    const ok = res.status === 201 && res.data?.success === true;
    logTest('Admin Sign Up POST /api/v1/admin/signup (Role: admin)', ok, `Status: ${res.status}`);
  }

  // 8. Admin Login
  {
    const res = await request('/api/v1/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testAdmin.email,
        password: testAdmin.password,
      }),
    });

    if (res.data?.data?.token) adminToken = res.data.data.token;
    const setCookie = res.headers?.get('set-cookie');
    if (setCookie) adminCookie = setCookie.split(';')[0];

    const ok = res.status === 200 && res.data?.success === true;
    logTest('Admin Login POST /api/v1/admin/login', ok, `Status: ${res.status}`);
  }

  // 9. Role Guard: Regular User Denied Access to Admin Endpoint
  {
    const headers = {};
    if (userToken) headers['Authorization'] = `Bearer ${userToken}`;
    if (userCookie) headers['Cookie'] = userCookie;

    const res = await request('/api/v1/admin/users', {
      method: 'GET',
      headers,
    });

    // Regular user should receive 403 Forbidden
    const ok = res.status === 403;
    logTest('Security Guard: Regular User Blocked from Admin GET /api/v1/admin/users', ok, `Expected 403, got: ${res.status}`);
  }

  // 10. Admin Get All Users
  {
    const headers = {};
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
    if (adminCookie) headers['Cookie'] = adminCookie;

    const res = await request('/api/v1/admin/users', {
      method: 'GET',
      headers,
    });

    const ok = res.status === 200 && res.data?.success === true && Array.isArray(res.data?.data);
    logTest('Admin Get All Users GET /api/v1/admin/users', ok, `Status: ${res.status}`);
  }

  // 11. Admin Update User Role
  if (userId) {
    const headers = {};
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
    if (adminCookie) headers['Cookie'] = adminCookie;

    const res = await request(`/api/v1/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ role: 'admin' }),
    });

    const ok = res.status === 200 && res.data?.success === true;
    logTest(`Admin Update User Role PATCH /api/v1/admin/users/:id/role`, ok, `Status: ${res.status}`);
  }

  // 12. Admin Ban User
  if (userId) {
    const headers = {};
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
    if (adminCookie) headers['Cookie'] = adminCookie;

    const res = await request(`/api/v1/admin/users/${userId}/ban`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ banned: true, banReason: 'Testing automated ban' }),
    });

    const ok = res.status === 200 && res.data?.success === true;
    logTest(`Admin Ban User PATCH /api/v1/admin/users/:id/ban`, ok, `Status: ${res.status}`);
  }

  // 13. Unified Auth Login
  {
    const res = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testAdmin.email,
        password: testAdmin.password,
      }),
    });

    const ok = res.status === 200 && res.data?.success === true;
    logTest('Unified Auth Login POST /api/v1/auth/login', ok, `Status: ${res.status}`);
  }

  // --- DRIVER MODULE TESTS ---
  const testDriver = {
    name: `Test Driver ${timestamp}`,
    email: `driver_${timestamp}@example.com`,
    password: 'driverpassword123',
  };
  let driverToken = '';

  // 14. Driver Sign Up
  {
    const res = await request('/api/v1/drivers/signup', {
      method: 'POST',
      body: JSON.stringify(testDriver),
    });
    driverToken = res.data?.data?.token;
    const ok = res.status === 201 && res.data?.success === true;
    logTest('Driver Sign Up POST /api/v1/drivers/signup (Role: driver)', ok, `Status: ${res.status}`);
  }

  // 15. Driver Login
  {
    const res = await request('/api/v1/drivers/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testDriver.email,
        password: testDriver.password,
      }),
    });
    if (res.data?.data?.token) driverToken = res.data.data.token;
    const ok = res.status === 200 && res.data?.success === true;
    logTest('Driver Login POST /api/v1/drivers/login', ok, `Status: ${res.status}`);
  }

  // 16. Driver Profile (Protected)
  {
    const headers = {};
    if (driverToken) headers['Authorization'] = `Bearer ${driverToken}`;

    const res = await request('/api/v1/drivers/me', {
      method: 'GET',
      headers,
    });
    const ok = res.status === 200 && res.data?.success === true;
    logTest('Driver Profile GET /api/v1/drivers/me (Protected)', ok, `Status: ${res.status}`);
  }

  // --- TRANSPORTATION MANAGER MODULE TESTS ---
  const testManager = {
    name: `Test Manager ${timestamp}`,
    email: `manager_${timestamp}@example.com`,
    password: 'managerpassword123',
  };
  let managerToken = '';

  // 17. Transportation Manager Sign Up
  {
    const res = await request('/api/v1/transportation-managers/signup', {
      method: 'POST',
      body: JSON.stringify(testManager),
    });
    managerToken = res.data?.data?.token;
    const ok = res.status === 201 && res.data?.success === true;
    logTest('Transportation Manager Sign Up POST /api/v1/transportation-managers/signup', ok, `Status: ${res.status}`);
  }

  // 18. Transportation Manager Login
  {
    const res = await request('/api/v1/transportation-managers/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testManager.email,
        password: testManager.password,
      }),
    });
    if (res.data?.data?.token) managerToken = res.data.data.token;
    const ok = res.status === 200 && res.data?.success === true;
    logTest('Transportation Manager Login POST /api/v1/transportation-managers/login', ok, `Status: ${res.status}`);
  }

  // 19. Transportation Manager Get Drivers List (Protected)
  {
    const headers = {};
    if (managerToken) headers['Authorization'] = `Bearer ${managerToken}`;

    const res = await request('/api/v1/transportation-managers/drivers', {
      method: 'GET',
      headers,
    });
    const ok = res.status === 200 && res.data?.success === true && Array.isArray(res.data?.data);
    logTest('Transportation Manager GET /api/v1/transportation-managers/drivers', ok, `Status: ${res.status}`);
  }

  // 20. Role Guard: Driver Denied Access to Transportation Manager Drivers Route
  {
    const headers = {};
    if (driverToken) headers['Authorization'] = `Bearer ${driverToken}`;

    const res = await request('/api/v1/transportation-managers/drivers', {
      method: 'GET',
      headers,
    });
    const ok = res.status === 403;
    logTest('Security Guard: Driver Blocked from Manager Route (Expected 403)', ok, `Status: ${res.status}`);
  }

  // 21. Admin View Passengers by Role Query
  {
    const headers = {};
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await request('/api/v1/admin/users?role=user', {
      method: 'GET',
      headers,
    });
    const ok = res.status === 200 && res.data?.success === true && Array.isArray(res.data?.data);
    logTest('Admin Filter Accounts by Role GET /api/v1/admin/users?role=user (Passengers)', ok, `Status: ${res.status}`);
  }

  // 22. Admin View Drivers & Transportation Managers
  {
    const headers = {};
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const resDrivers = await request('/api/v1/admin/users?role=driver', { method: 'GET', headers });
    const resManagers = await request('/api/v1/admin/users?role=transportation-manager', { method: 'GET', headers });

    const ok = resDrivers.status === 200 && resManagers.status === 200;
    logTest('Admin View Drivers & Managers (role=driver, role=transportation-manager)', ok);
  }

  // 23. Admin Update User Details (Name / Profile)
  if (userId) {
    const headers = {};
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await request(`/api/v1/admin/users/${userId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ name: 'Passenger Updated by Admin' }),
    });
    const ok = res.status === 200 && res.data?.success === true;
    logTest('Admin Update User Account PATCH /api/v1/admin/users/:id', ok, `Status: ${res.status}`);
  }

  // 24. Admin Dashboard Stats
  {
    const headers = {};
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await request('/api/v1/admin/stats', {
      method: 'GET',
      headers,
    });
    const ok = res.status === 200 && res.data?.success === true && res.data?.data?.accounts?.totalUsers > 0;
    logTest('Admin Dashboard Statistics GET /api/v1/admin/stats', ok, `Status: ${res.status}`);
  }

  // --- CAMPUS BUS & ROUTE MANAGEMENT (Transportation Manager) ---
  let createdRouteId = '';
  let createdBusId = '';
  let createdDriverId = '';

  // Get driver ID to assign
  {
    const headers = {};
    if (managerToken) headers['Authorization'] = `Bearer ${managerToken}`;
    const res = await request('/api/v1/transportation-managers/drivers', { method: 'GET', headers });
    if (res.data?.data && res.data.data.length > 0) {
      createdDriverId = res.data.data[0]._id || res.data.data[0].id;
    }
  }

  // 25. Transportation Manager Create Route
  {
    const headers = {};
    if (managerToken) headers['Authorization'] = `Bearer ${managerToken}`;

    const res = await request('/api/v1/routes', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        routeName: `Route ${timestamp} Main Campus to Dormitory`,
        startPoint: 'Main Gate',
        endPoint: 'North Dormitory',
        stops: ['Library', 'Science Hall', 'Sports Complex'],
        scheduleTimes: ['08:00 AM', '10:30 AM', '02:00 PM', '05:30 PM'],
      }),
    });

    createdRouteId = res.data?.data?._id || res.data?.data?.id;
    const ok = res.status === 201 && res.data?.success === true;
    logTest('Transportation Manager Create Route POST /api/v1/routes', ok, `Status: ${res.status}`);
  }

  // 26. Transportation Manager Add Campus Bus
  {
    const headers = {};
    if (managerToken) headers['Authorization'] = `Bearer ${managerToken}`;

    const res = await request('/api/v1/buses', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        busNumber: `BUS-${timestamp}`,
        name: `Campus Shuttle Express ${timestamp}`,
        licensePlate: `DHAKA-METRO-GA-${Math.floor(Math.random() * 90000 + 10000)}`,
        capacity: 45,
        status: 'active',
      }),
    });

    createdBusId = res.data?.data?._id || res.data?.data?.id;
    const ok = res.status === 201 && res.data?.success === true;
    logTest('Transportation Manager Add Campus Bus POST /api/v1/buses', ok, `Status: ${res.status}`);
  }

  // 27. Transportation Manager Assign Driver to Bus
  if (createdBusId && createdDriverId) {
    const headers = {};
    if (managerToken) headers['Authorization'] = `Bearer ${managerToken}`;

    const res = await request(`/api/v1/buses/${createdBusId}/assign-driver`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ driverId: createdDriverId }),
    });

    const ok = res.status === 200 && res.data?.success === true;
    logTest('Transportation Manager Assign Driver to Bus PATCH /api/v1/buses/:id/assign-driver', ok, `Status: ${res.status}`);
  }

  // 28. Transportation Manager Assign Route to Bus
  if (createdBusId && createdRouteId) {
    const headers = {};
    if (managerToken) headers['Authorization'] = `Bearer ${managerToken}`;

    const res = await request(`/api/v1/buses/${createdBusId}/assign-route`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ routeId: createdRouteId }),
    });

    const ok = res.status === 200 && res.data?.success === true;
    logTest('Transportation Manager Assign Route to Bus PATCH /api/v1/buses/:id/assign-route', ok, `Status: ${res.status}`);
  }

  // 29. Get Bus with Populated Assigned Driver & Route
  if (createdBusId) {
    const headers = {};
    if (userToken) headers['Authorization'] = `Bearer ${userToken}`;

    const res = await request(`/api/v1/buses/${createdBusId}`, {
      method: 'GET',
      headers,
    });

    const ok = res.status === 200 && res.data?.success === true && res.data?.data?.assignedDriver && res.data?.data?.assignedRoute;
    logTest('Get Bus with Populated Driver & Route GET /api/v1/buses/:id', ok, `Status: ${res.status}`);
  }

  // 30. Security Guard: Passenger Blocked from Adding Bus (Expected 403)
  {
    const passengerRes = await request('/api/v1/users/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: `Passenger Test ${timestamp}`,
        email: `passenger_guard_${timestamp}@example.com`,
        password: 'password123',
      }),
    });
    const passengerToken = passengerRes.data?.data?.token;

    const headers = {};
    if (passengerToken) headers['Authorization'] = `Bearer ${passengerToken}`;

    const res = await request('/api/v1/buses', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        busNumber: `UNAUTHORIZED-${timestamp}`,
        name: 'Hacker Bus',
        licensePlate: 'FAKE-1234',
        capacity: 30,
      }),
    });

    const ok = res.status === 403;
    logTest('Security Guard: Passenger Blocked from Adding Bus (Expected 403)', ok, `Status: ${res.status}`);
  }

  // 31. 404 Route Not Found
  {
    const res = await request('/api/v1/invalid-route-testing-404');
    const ok = res.status === 404 && res.data?.success === false;
    logTest('404 Route Not Found GET /api/v1/invalid-route-testing-404', ok, `Status: ${res.status}`);
  }

  console.log(`\n${colors.bold}${colors.cyan}========================================`);
  console.log(`  TEST RESULTS SUMMARY`);
  console.log(`========================================${colors.reset}`);
  console.log(`${colors.green}  Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}  Failed: ${failedTests}${colors.reset}`);
  console.log(`  Total:  ${passedTests + failedTests}\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();
