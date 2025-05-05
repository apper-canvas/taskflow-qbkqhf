import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const CheckCircleIcon = getIcon('CheckCircle');
  const ListTodoIcon = getIcon('ListTodo');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 to-surface-100 
                    dark:from-surface-900 dark:to-surface-800 transition-colors duration-300">
      <AnimatePresence>
        {showIntro ? (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-surface-50 dark:bg-surface-900 z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              className="flex flex-col items-center"
            >
              <motion.div 
                className="text-primary dark:text-primary-light mb-4"
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <ListTodoIcon className="w-20 h-20" />
              </motion.div>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                Todo Lister......
              </motion.h1>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.1 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="text-primary-dark dark:text-primary-light mr-3"
              >
                <ListTodoIcon className="w-8 h-8" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Todo Listerrrrrrrrr
              </h1>
            </div>
            
            <motion.p 
              className="text-surface-600 dark:text-surface-300 text-sm md:text-base"
              whileHover={{ scale: 1.02 }}
            >
              <CheckCircleIcon className="h-4 w-4 inline-block mr-1 text-primary" />
              <span>Organize your day</span>
            </motion.p>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="mb-8"
        >
          <MainFeature />
        </motion.div>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
          className="text-center mt-12 pt-6 border-t border-surface-200 dark:border-surface-700"
        >
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Todo List &copy; {new Date().getFullYear()} • Get things done
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;
