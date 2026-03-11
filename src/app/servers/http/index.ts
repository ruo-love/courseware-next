import axios, { type AxiosResponse } from 'axios';

const http = axios.create({
  timeout: 120000,
});

// 请求拦截
http.interceptors.request.use((config) => {
  const accessToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1dHlwIjoiTERBUF9VU0VSIiwiYXVkIjpbImFvc3AtZ2F0ZXdheSIsIml5eS1hcGkiLCJhb3QiLCJ2d29wcyIsIm5vdGlmaWNhdGlvbi1jZW50ZXItYWRtaW4iLCJhb2MtYWRtaW4iLCJhaWdjIl0sInN1YiI6InFpYW5jaGVuZy56aGFvIiwiaXNzIjoiYWxvNy5jb20iLCJleHAiOjE3NzMyMzQ2MDEsImp0aSI6Ijc1NDcwMGZjLWZlNDktNGIyNS04YjdlLThlMzY5YzM2OWM0MyJ9.tBMXn9CsOkZcgKuk2NBkEnkkvNAB2_q8lSlTUSe7W5mFi8-NVnBNw8GIOkjwQHhpnDAI3mDjMJ2NRuqNn_myXyQzOVi16EYLwvMeaWWK548js_Q3VMOzazIydwnOOT_NTK7Bbb7C3r6odP73sna5gXCidZj5V-Cc8j7YelQD0nw`;
  if (accessToken) {
    config.headers?.set?.('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});


// 响应拦截
http.interceptors.response.use(
  <T>(response: AxiosResponse<T>) => response,
  (error) => {
    return Promise.reject(error)
  }
);

export default http;

