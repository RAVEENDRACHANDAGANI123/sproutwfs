from fastapi import APIRouter

api_router = APIRouter()

# Domain modules will register their routers here:
# from app.modules.auth.router import router as auth_router
# from app.modules.recruitment.router import router as recruitment_router
# from app.modules.employees.router import router as employees_router
# from app.modules.leave.router import router as leave_router
# from app.modules.payroll.router import router as payroll_router

# api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
# api_router.include_router(recruitment_router, prefix="/recruitment", tags=["Recruitment"])
# api_router.include_router(employees_router, prefix="/employees", tags=["Employees"])
# api_router.include_router(leave_router, prefix="/leave", tags=["Leave"])
# api_router.include_router(payroll_router, prefix="/payroll", tags=["Payroll"])
