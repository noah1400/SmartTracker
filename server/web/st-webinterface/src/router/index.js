import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue'; // Import the LoginView
import LogoutView from '../views/LogoutView.vue'; // Import the LogoutView

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
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