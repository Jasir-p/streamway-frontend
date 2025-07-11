// components/BulkDeleteHandler.js
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { deleteDealsBulk } from '../../../../../../redux/slice/DealSlice';

const useBulkDelete = ({ selectedDeals, refreshDeals, clearSelection }) => {
  const dispatch = useDispatch();

  const handleBulkDelete = () => {
    if (selectedDeals.length === 0) return;

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedDeals.length} deal${selectedDeals.length > 1 ? 's' : ''}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDealsBulk(selectedDeals))
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: `${selectedDeals.length} deal${selectedDeals.length > 1 ? 's' : ''} deleted successfully.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            refreshDeals();
            clearSelection();
          })
          .catch(() => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete selected deals.',
              icon: 'error',
            });
          });
      }
    });
  };

  return handleBulkDelete;
};

export default useBulkDelete;
