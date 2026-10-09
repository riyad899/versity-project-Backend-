# Express Node.js Server (MongoDB & Mongoose with Better Auth)

A modular, production-ready REST API boilerplate using **Node.js**, **Express**, **MongoDB**, **Mongoose**, **Zod**, and **Better Auth** with Role-Based Access Control (RBAC) across 4 roles: **`user`**, **`admin`**, **`driver`**, and **`transportation-manager`**.

## 👥 Supported Roles

1. **`user`** — Standard consumer/passenger account
2. **`admin`** — System administration & role management
3. **`driver`** — Transportation driver account
4. **`transportation-manager`** — Fleet, bus & route manager account

---

## 🔐 Admin Role Management Routes (`/api/v1/admin`)

All role change routes require an **Admin Bearer Token** in the header:
`Authorization: Bearer <ADMIN_TOKEN>`

### 1. General Role Update Route
- **Method**: `PATCH`
- **URL**: `/api/v1/admin/users/:id/role` *(or `/api/v1/admin/users/:id/change-role`)*
- **Body (JSON)**:
  ```json
  {
    "role": "driver" 
  }
  ```
  *(Supported roles: `"user"`, `"driver"`, `"transportation-manager"`, `"admin"`)*

### 2. Dedicated Single-Click Convenience Routes
- **Make Driver**: `PATCH /api/v1/admin/users/:id/make-driver` (Sets role to `driver`)
- **Make Transportation Manager**: `PATCH /api/v1/admin/users/:id/make-transportation-manager` (Sets role to `transportation-manager`)
- **Make Passenger/User**: `PATCH /api/v1/admin/users/:id/make-user` (Sets role to `user`)
- **Make Admin**: `PATCH /api/v1/admin/users/:id/make-admin` (Sets role to `admin`)

---

## 🚌 Campus Fleet & Route Routes

### Campus Buses (`/api/v1/buses`)
- `POST /api/v1/buses` — Add campus bus (Transportation Manager & Admin)
- `GET /api/v1/buses` — View all campus buses
- `GET /api/v1/buses/:id` — View bus with populated driver & route
- `PATCH /api/v1/buses/:id` — Update bus information
- `PATCH /api/v1/buses/:id/assign-driver` — **Assign driver to bus**
- `PATCH /api/v1/buses/:id/assign-route` — **Assign route to bus**
- `DELETE /api/v1/buses/:id` — Delete bus

### Transportation Routes (`/api/v1/routes`)
- `POST /api/v1/routes` — Create route (Transportation Manager & Admin)
- `GET /api/v1/routes` — View all routes
- `GET /api/v1/routes/:id` — View route and assigned buses
- `PATCH /api/v1/routes/:id` — Update route
- `DELETE /api/v1/routes/:id` — Delete route

---

## 🧪 Automated Testing

```bash
npm test
```
*(Runs 31 end-to-end tests covering all auth, roles, buses, routes, and security guards)*
