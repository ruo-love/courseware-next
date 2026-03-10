import axios, { type AxiosResponse } from 'axios';

const http = axios.create({
  timeout: 120000,
});

// 请求拦截
http.interceptors.request.use((config) => {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1dHlwIjoiTERBUF9VU0VSIiwiYXVkIjpbImFvc3AtZ2F0ZXdheSIsIml5eS1hcGkiLCJhb3QiLCJ2d29wcyIsIm5vdGlmaWNhdGlvbi1jZW50ZXItYWRtaW4iLCJhb2MtYWRtaW4iLCJhaWdjIl0sInN1YiI6Imd1aWZhbmcud2VuIiwiaXNzIjoiYWxvNy5jb20iLCJleHAiOjE3NzMxNTIwMDIsImp0aSI6ImE2OWRmODc3LTM1NDYtNDRmYi04ZDVlLWQ2NzBlM2NlMWIxYyJ9.Fi2MFRIxMjj5SMsh9dn61CxZLR8AU3fj1kWqbqD6VlL1ME5OanmNCOQk7Rzn5BJ4Y3cPAH9EkpMBgKoumDAhtMoUBexJAGb0jPCPyFVa5-WG70hDt2str6K1ULMihePVvRmvR7IRg5FIdrwwVd10IlQQp3UGFVzaf7cCLHeYB-4";
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

