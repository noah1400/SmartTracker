import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue'; // Import the LoginView
import LogoutView from '../views/LogoutView.vue'; // Import the LogoutView
import DashboardView from '../views/DashboardView.vue'; // Import the DashboardView
import AboutView from '../views/AboutView.vue'; // Import the AboutView
import DashboardContentView from '../views/DashboardContentView.vue'; // Import the DashboardContentView
import UsersView from '../views/UsersView.vue'; // Import the UsersView
import ProjectsView from '../views/ProjectsView.vue'; // Import the ProjectsView
import ProjectDetailView from '../views/ProjectDetailView.vue'; // Import the ProjectDetailView

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      children: [
        {
          path: '',
          name: 'dashboard-content',
          component: DashboardContentView
        },
        {
          path: 'users',
          name: 'users',
          component: UsersView
        },
        {
          path: 'projects',
          name: 'projects',
          component: ProjectsView
        },
        {
          path: 'projects/:id',
          name: 'project-detail',
          component: ProjectDetailView,
          props: true // Enables the id param to be passed as a prop to the component
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView // Add the Login route
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView // Add the Logout route
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (to.path !== '/login' && !isLoggedIn) {
    try {
      await axios.get('http://localhost/auth/status', { withCredentials: true });
      localStorage.setItem('isLoggedIn', 'true');
      next();
    } catch (error) {
      localStorage.removeItem('isLoggedIn');
      next('/login');
    }
  } else if (to.path === '/login' && isLoggedIn) {
    next('/');
  } else {
    next();
  }
});


export default router;