import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icons
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash2');
  const CheckIcon = getIcon('Check');
  const EditIcon = getIcon('Edit2');
  const CloseIcon = getIcon('X');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const SaveIcon = getIcon('Save');
  const ListFilterIcon = getIcon('ListFilter');
  const ArrowUpDownIcon = getIcon('ArrowUpDown');
  const ClockIcon = getIcon('Clock');
  const StarIcon = getIcon('Star');
  
  // State management
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Priority display helper
  const getPriorityDetails = (priority) => {
    switch (priority) {
      case 'high':
        return { 
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-100 dark:bg-red-900/30', 
          border: 'border-red-200 dark:border-red-800',
          icon: <AlertTriangleIcon className="w-4 h-4" />,
          label: 'High'
        };
      case 'medium':
        return { 
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-100 dark:bg-amber-900/30', 
          border: 'border-amber-200 dark:border-amber-800',
          icon: <StarIcon className="w-4 h-4" />,
          label: 'Medium'
        };
      case 'low':
        return { 
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-100 dark:bg-blue-900/30', 
          border: 'border-blue-200 dark:border-blue-800',
          icon: <ClockIcon className="w-4 h-4" />,
          label: 'Low'
        };
      default:
        return { 
          color: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-100 dark:bg-gray-800', 
          border: 'border-gray-200 dark:border-gray-700',
          icon: null,
          label: 'None'
        };
    }
  };
  
  // CRUD operations
  const validateForm = (task) => {
    const errors = {};
    
    if (!task.title.trim()) {
      errors.title = "Title is required";
    } else if (task.title.length > 80) {
      errors.title = "Title must be 80 characters or less";
    }
    
    if (task.description && task.description.length > 250) {
      errors.description = "Description must be 250 characters or less";
    }
    
    return errors;
  };
  
  const handleAddTask = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(newTask);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const task = {
      id: Date.now().toString(),
      ...newTask,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setFormErrors({});
    setIsFormVisible(false);
    
    toast.success('Task added successfully!');
  };
  
  const handleUpdateTask = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(editingTask);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    
    setEditingTask(null);
    setFormErrors({});
    
    toast.info('Task updated successfully!');
  };
  
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.error('Task deleted');
  };
  
  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };
  
  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'priority') {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      return priorityValues[b.priority] - priorityValues[a.priority];
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });
  
  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div 
          className="flex items-center gap-3 bg-white dark:bg-surface-800 p-3 rounded-xl shadow-soft
                     border border-surface-200 dark:border-surface-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <ListFilterIcon className="w-5 h-5 text-primary mr-2" />
            <span className="text-xs font-semibold text-surface-600 dark:text-surface-300">Filter:</span>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-surface-50 dark:bg-surface-700 border-0 rounded-lg text-sm py-1 px-2
                       focus:ring-primary-light"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          
          <div className="flex items-center ml-2">
            <ArrowUpDownIcon className="w-5 h-5 text-primary mr-2" />
            <span className="text-xs font-semibold text-surface-600 dark:text-surface-300">Sort:</span>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-50 dark:bg-surface-700 border-0 rounded-lg text-sm py-1 px-2
                      focus:ring-primary-light"
          >
            <option value="date">Date Added</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </motion.div>
        
        <motion.button
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? (
            <>
              <CloseIcon className="w-5 h-5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <PlusIcon className="w-5 h-5" />
              <span>Add Task</span>
            </>
          )}
        </motion.button>
      </div>
      
      {/* Add Task Form */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-soft
                           border border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-semibold mb-4 text-surface-800 dark:text-surface-100">
                Add New Task
              </h2>
              
              <form onSubmit={handleAddTask}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className={`w-full ${formErrors.title ? 'border-red-500 dark:border-red-700 focus:ring-red-500' : ''}`}
                    placeholder="What needs to be done?"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className={`w-full min-h-[80px] ${formErrors.description ? 'border-red-500 dark:border-red-700 focus:ring-red-500' : ''}`}
                    placeholder="Add details about this task..."
                  ></textarea>
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date (optional)
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Task
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-5 max-w-md w-full shadow-xl
                         border border-surface-200 dark:border-surface-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">
                  Edit Task
                </h2>
                <button 
                  onClick={() => setEditingTask(null)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <CloseIcon className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateTask}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    className={`w-full ${formErrors.title ? 'border-red-500 dark:border-red-700 focus:ring-red-500' : ''}`}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    className={`w-full min-h-[80px] ${formErrors.description ? 'border-red-500 dark:border-red-700 focus:ring-red-500' : ''}`}
                  ></textarea>
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                      className="w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date (optional)
                    </label>
                    <input
                      type="date"
                      value={editingTask.dueDate || ''}
                      onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SaveIcon className="w-5 h-5" />
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Task List */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="task-card text-center py-8"
          >
            <div className="mb-3 inline-block p-3 bg-surface-100 dark:bg-surface-700 rounded-full">
              <ListFilterIcon className="w-8 h-8 text-surface-500 dark:text-surface-400" />
            </div>
            <h3 className="text-xl font-medium text-surface-700 dark:text-surface-300 mb-2">
              No tasks found
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              {filter !== 'all' 
                ? `There are no ${filter} tasks.` 
                : "Your task list is empty. Add a new task to get started!"}
            </p>
            {filter !== 'all' && (
              <button 
                onClick={() => setFilter('all')}
                className="text-primary hover:text-primary-dark dark:hover:text-primary-light font-medium"
              >
                View all tasks
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence>
              {sortedTasks.map(task => {
                const priorityDetails = getPriorityDetails(task.priority);
                
                return (
                  <motion.div 
                    key={task.id}
                    layout
                    variants={itemVariants}
                    exit="exit"
                    className={`task-card ${task.isCompleted ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <motion.button
                        onClick={() => handleToggleComplete(task.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`rounded-full flex-shrink-0 w-6 h-6 border-2 ${
                          task.isCompleted 
                            ? 'bg-primary-light border-primary' 
                            : 'border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800'
                        } flex items-center justify-center`}
                      >
                        {task.isCompleted && (
                          <CheckIcon className="w-4 h-4 text-white" />
                        )}
                      </motion.button>
                      
                      <div className="flex-grow">
                        <div className="flex flex-wrap gap-2 items-start justify-between mb-1">
                          <h3 className={`font-medium text-lg break-words ${
                            task.isCompleted 
                              ? 'line-through text-surface-500 dark:text-surface-400' 
                              : 'text-surface-800 dark:text-surface-100'
                          }`}>
                            {task.title}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 items-center sm:ml-auto">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full 
                                           text-xs font-medium ${priorityDetails.color} ${priorityDetails.bg} 
                                           border ${priorityDetails.border}`}>
                              {priorityDetails.icon}
                              {priorityDetails.label}
                            </span>
                            
                            {task.dueDate && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full 
                                               text-xs font-medium text-indigo-600 dark:text-indigo-400 
                                               bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 
                                               dark:border-indigo-800">
                                <ClockIcon className="w-3 h-3" />
                                Due: {format(new Date(task.dueDate), 'MMM d')}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm mb-3 ${
                            task.isCompleted 
                              ? 'text-surface-500 dark:text-surface-500' 
                              : 'text-surface-600 dark:text-surface-300'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 justify-end mt-3">
                          <motion.button
                            onClick={() => setEditingTask(task)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 text-surface-600 dark:text-surface-400 
                                       hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                          >
                            <EditIcon className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleDeleteTask(task.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      
      {/* Task Statistics */}
      {tasks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 p-4 bg-white dark:bg-surface-800 rounded-xl shadow-soft
                     border border-surface-200 dark:border-surface-700"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3">
              <p className="text-surface-500 dark:text-surface-400 text-sm mb-1">Total Tasks</p>
              <p className="text-xl font-semibold text-surface-800 dark:text-surface-100">{tasks.length}</p>
            </div>
            
            <div className="p-3">
              <p className="text-surface-500 dark:text-surface-400 text-sm mb-1">Completed</p>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                {tasks.filter(t => t.isCompleted).length}
              </p>
            </div>
            
            <div className="p-3 col-span-2 sm:col-span-1">
              <p className="text-surface-500 dark:text-surface-400 text-sm mb-1">Pending</p>
              <p className="text-xl font-semibold text-amber-600 dark:text-amber-400">
                {tasks.filter(t => !t.isCompleted).length}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MainFeature;