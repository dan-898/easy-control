import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  FormGroup,
  Box
} from '@mui/material';

const EditEmployeeModal = ({ open, onClose, employee, onUpdate }) => {
  const [formData, setFormData] = useState({
      ...employee,
      password: '',
    });

  useEffect(() => {
    setFormData(employee);
  }, [employee]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Employee</DialogTitle>
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
              label="New Password (leave blank to keep current)"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
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
                    onChange={() => handlePermissionChange('Management')}
                  />
                }
                label="Management"
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Update Employee</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditEmployeeModal;