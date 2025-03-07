from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
from datetime import date

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    department: str
    unlimited_contract: bool
    contract_end: Optional[date]
    permissions: Dict[str, bool]

class EmployeeCreate(EmployeeBase):
    password: str


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    unlimited_contract: Optional[bool] = None
    contract_end: Optional[date] = None
    permissions: Optional[Dict[str, bool]] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class Employee(EmployeeBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

