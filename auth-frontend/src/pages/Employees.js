import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminLayout from '../layouts/AdminLayout';
import EditEmployeeModal from '../components/EditEmployeeModal';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  FormGroup,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosInstance } from '../utils/axios';

const Employees = () => {
  const { isAuthenticated, loading, getAuthHeaders, user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Sales',
    unlimited_contract: false,
    contract_end: '',
    permissions: {
      crm: false,
      bulkplanning: false
    }
  });

  useEffect(() => {
    if (isAuthenticated()) {
      fetchEmployees();
    }
  }, [isAuthenticated]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/api/employees/`
      );
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isEmployeeActive = (employee) => {
    if (employee.unlimited_contract) return true;
    if (!employee.contract_end) return false;
    return new Date(employee.contract_end) > new Date();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePermissionChange = (permission) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission]
      }
    });
  };

  const handleContractTypeChange = (e) => {
    const isUnlimited = e.target.checked;
    setFormData({
      ...formData,
      unlimited_contract: isUnlimited,
      contract_end: isUnlimited ? null : formData.contract_end
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      department: 'Sales',
      unlimited_contract: false,
      contract_end: '',
      is_active: true,
      permissions: {
        crm: false,
        bulkplanning: false
      }
    });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/employees/`,
        { ...formData, is_active: true }
      );
      setShowAddModal(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      setError('Failed to add employee');
      console.error(err);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      const dataToSend = { ...updatedEmployee };
      

      if (!dataToSend.password) {
        delete dataToSend.password;
      }
  
      await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/api/employees/${updatedEmployee.id}`,
        dataToSend
      );
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      setError('Failed to update employee');
      console.error(err);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axiosInstance.delete(
          `${process.env.REACT_APP_API_URL}/api/employees/${id}`
        );
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete employee');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Employee Accounts
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <TextField
              label="Search employees"
              variant="outlined"
              size="small"
              sx={{ width: 300 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  defaultValue="all"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                  <MenuItem value="support">Customer Support</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue="all"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddModal(true)}
              >
                Add Employee
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

                  <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NAME</TableCell>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>DEPARTMENT</TableCell>
                  <TableCell>CONTRACT</TableCell>
                  <TableCell>PERMISSIONS</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Loading employees...</TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No employees found</TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        {employee.unlimited_contract ? 'Unlimited' : employee.contract_end}
                      </TableCell>
                      <TableCell>
                        {employee.permissions && Object.entries(employee.permissions)
                          .filter(([_, value]) => value)
                          .map(([key, _]) => (
                            <Chip
                              key={key}
                              label={key.charAt(0).toUpperCase() + key.slice(1)}
                              size="small"
                              color="primary"
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isEmployeeActive(employee) ? "Active" : "Inactive"}
                          color={isEmployeeActive(employee) ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditEmployee(employee)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteEmployee(employee.id)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleAddEmployee}>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  label="Department"
                >
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Customer Support">Customer Support</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    name="unlimited_contract"
                    checked={formData.unlimited_contract}
                    onChange={handleContractTypeChange}
                  />
                }
                label="Unlimited Contract"
              />

              {!formData.unlimited_contract && (
                <TextField
                  label="Contract End Date"
                  name="contract_end"
                  type="date"
                  value={formData.contract_end}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required={!formData.unlimited_contract}
                />
              )}

              <Typography variant="subtitle1" sx={{ mt: 1 }}>Permissions</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.crm}
                      onChange={() => handlePermissionChange('crm')}
                    />
                  }
                  label="CRM"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.bulkplanning}
                      onChange={() => handlePermissionChange('bulkplanning')}
                    />
                  }
                  label="Bulkplanning"
                />
              </FormGroup>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Employee</Button>
          </DialogActions>
        </form>
      </Dialog>

      {}
      {editingEmployee && (
        <EditEmployeeModal
          open={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          employee={editingEmployee}
          onUpdate={handleUpdateEmployee}
        />
      )}
    </AdminLayout>
  );
};

export default Employees;