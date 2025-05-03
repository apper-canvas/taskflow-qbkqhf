import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const AlertCircleIcon = getIcon('AlertCircle');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 to-surface-100 
                    dark:from-surface-900 dark:to-surface-800 
                    flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 200 
          }}
          className="mb-6 text-accent"
        >
          <AlertCircleIcon className="h-24 w-24 mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100">
          Oops!
        </h1>
        
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card mb-8 
                        border border-surface-200 dark:border-surface-700">
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-surface-800 dark:text-surface-100">
            Page Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-300 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/" 
              className="btn-primary flex items-center justify-center gap-2 w-full"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Homepage
            </Link>
          </motion.div>
        </div>
        
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Need help? Contact support@todolist.com
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;