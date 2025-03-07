import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  CircularProgress
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AdminLayout from '../layouts/AdminLayout';

const Home = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const handleEmployeeManagement = () => {
    console.log('Employee Management button clicked');
    navigate('/employees');
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.username || 'Admin'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {}
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <PeopleAltIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h2">
                    Employee Management
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
                  Add, edit, and manage employee accounts. Control access permissions and monitor employee activities.
                </Typography>
                <Button
                  onClick={handleEmployeeManagement}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Manage Employees
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default Home;