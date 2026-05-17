import React from 'react';
import SuperAdminDashboard from './dashboards/SuperAdmin';
import AcademicAdminDashboard from './dashboards/AcademicAdmin';
import InstructorDashboard from './dashboards/Instructor';
import StudentDashboard from './dashboards/Student';

const Dashboard: React.FC = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const role = user?.role || 'student';

  switch (role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'academic_admin':
      return <AcademicAdminDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

export default Dashboard;
