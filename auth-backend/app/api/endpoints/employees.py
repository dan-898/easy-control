from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas import employee as employee_schemas
from app.services import employee_service
from typing import Any, List
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[employee_schemas.Employee])
def read_employees(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:

    employees = employee_service.get_employees(db, skip=skip, limit=limit)
    return employees

@router.post("/", response_model=employee_schemas.Employee)
def create_employee(
    *,
    db: Session = Depends(deps.get_db),
    employee_in: employee_schemas.EmployeeCreate,
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:

    employee = employee_service.create_employee(db, employee_in=employee_in)
    return employee

@router.put("/{employee_id}", response_model=employee_schemas.Employee)
def update_employee(
    *,
    db: Session = Depends(deps.get_db),
    employee_id: int,
    employee_in: employee_schemas.EmployeeUpdate,
    current_admin: User = Depends(deps.get_current_admin),  # Changed this line
) -> Any:

    employee = employee_service.get_employee(db, employee_id=employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    employee = employee_service.update_employee(db, db_employee=employee, employee_in=employee_in)
    return employee

@router.get("/{employee_id}", response_model=employee_schemas.Employee)
def read_employee(
    *,
    db: Session = Depends(deps.get_db),
    employee_id: int,
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:

    employee = employee_service.get_employee(db, employee_id=employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.delete("/{employee_id}", response_model=employee_schemas.Employee)
def delete_employee(
    *,
    db: Session = Depends(deps.get_db),
    employee_id: int,
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:

    employee = employee_service.get_employee(db, employee_id=employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    employee = employee_service.delete_employee(db, employee_id=employee_id)
    return employee