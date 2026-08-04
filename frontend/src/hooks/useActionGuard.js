import { useAuth } from '../context/AuthContext';

/**
 * Hook to guard actions for PENDING users.
 * If user status is PENDING, it prevents the action and alerts the user.
 */
export const useActionGuard = () => {
  const { user } = useAuth();

  const guardAction = (callback) => {
    return (e) => {
      // Prevent default if it's an event
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      if (user?.status === 'PENDING') {
        alert("Not yet approved user role. Please wait for an Admin to approve your account.");
        return;
      }

      // Execute original callback if approved
      if (callback) {
        callback(e);
      }
    };
  };

  const isPending = user?.status === 'PENDING';

  return { guardAction, isPending };
};
