import api from "./api.js";

export const authApi = {
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};

export const productApi = {
  list: (params) => api.get("/products", { params }).then((r) => r.data),
  get: (id) => api.get(`/products/${id}`).then((r) => r.data),
  create: (data) => api.post("/products", data).then((r) => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
};

export const orderApi = {
  create: (data) => api.post("/orders", data).then((r) => r.data),
  mine: () => api.get("/orders/my-orders").then((r) => r.data),
  all: (params) => api.get("/orders", { params }).then((r) => r.data),
  setStatus: (id, status) => api.put(`/orders/${id}/status`, { status }).then((r) => r.data),
};

export const reviewApi = {
  list: (productId) => api.get(`/reviews/${productId}`).then((r) => r.data),
  create: (productId, data) => api.post(`/reviews/${productId}`, data).then((r) => r.data),
};

export const adminApi = {
  stats: () => api.get("/admin/stats").then((r) => r.data),
};
