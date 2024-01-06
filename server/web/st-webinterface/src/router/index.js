import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue'; // Import the LoginView
import LogoutView from '../views/LogoutView.vue'; // Import the LogoutView
import DashboardView from '../views/DashboardView.vue'; // Import the DashboardView
import AboutView from '../views/AboutView.vue'; // Import the AboutView
import HomeView from '../views/HomeView.vue'; // Import the HomeView

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      children: [
        {
          path: 'users',
          name: 'users',
          component: AboutView
        },
        {
          path: 'projects',
          name: 'projects',
          component: HomeView
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