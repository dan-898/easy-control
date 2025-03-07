from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.schemas import employee as employee_schemas
from typing import Optional
def create_employee(db: Session, employee_in: employee_schemas.EmployeeCreate) -> Employee:
    db_employee = Employee(
        name=employee_in.name,
        email=employee_in.email,
        department=employee_in.department,
        unlimited_contract=employee_in.unlimited_contract,
        contract_end=employee_in.contract_end,
        permissions=employee_in.permissions,
        is_active=True
    )


    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Employee).offset(skip).limit(limit).all()



def get_employee(db: Session, employee_id: int) -> Optional[Employee]:
    return db.query(Employee).filter(Employee.id == employee_id).first()

def update_employee(db: Session, db_employee: Employee, employee_in: employee_schemas.EmployeeUpdate) -> Employee:
    update_data = employee_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_employee, field, value)
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int) -> Optional[Employee]:
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee:
        db.delete(employee)
        db.commit()
    return employee