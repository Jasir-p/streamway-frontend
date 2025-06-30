export const StatusBadge = ({ status, paymentDate }) => {
  const today = new Date();
  const payment = new Date(paymentDate);

  let statusColor = 'bg-green-100 text-green-800';
  let statusText = 'Paid';

  // If not paid
  if (!status) {
    const daysFromPayment = Math.floor((today - payment) / (1000 * 60 * 60 * 24));

    if (payment < today) {
      
        statusColor = 'bg-red-100 text-red-800';
        statusText = 'Overdue';
    }
   else {
        statusColor = 'bg-gray-100 text-gray-800';
        statusText = 'Unpaid';
      }
    
  }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
        {statusText}
        </span>
    );
};
