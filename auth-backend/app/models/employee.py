from sqlalchemy import Boolean, Column, Integer, String, Date, JSON
from app.db.base import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    department = Column(String)
    unlimited_contract = Column(Boolean, default=False)
    contract_end = Column(Date, nullable=True)
    permissions = Column(JSON)
    is_active = Column(Boolean, default=True)