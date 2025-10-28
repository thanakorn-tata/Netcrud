import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // ✅ เพิ่ม withCredentials: true ให้ทุก request
  const clonedRequest = req.clone({
    withCredentials: true
  });

  console.log('🔐 Request with credentials:', clonedRequest.url);

  return next(clonedRequest);
};
