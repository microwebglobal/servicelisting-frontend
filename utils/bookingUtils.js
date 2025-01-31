// bookingUtils.js
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  export const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = (end - start) / (1000 * 60); // Duration in minutes
    
    return `${diff} minutes`;
  };
  
  export const getBookingStatusColor = (status) => {
    const statusColors = {
      cart: 'text-gray-500',
      payment_pending: 'text-yellow-500',
      confirmed: 'text-blue-500',
      assigned: 'text-indigo-500',
      in_progress: 'text-orange-500',
      completed: 'text-green-500',
      cancelled: 'text-red-500',
      refunded: 'text-purple-500'
    };
    
    return statusColors[status] || 'text-gray-500';
  };
  
  export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  export const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };