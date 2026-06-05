import React, { useState } from 'react';
import { useEmployee } from './hooks/useEmployee';
import { Employee } from './types/employee';
import { Modal } from './components/Modal/Modal';
import { Toast, ToastType } from './components/Toast/Toast';
import { EmployeeForm } from './components/EmployeeForm/EmployeeForm';
import { EmployeeList } from './components/EmployeeList/EmployeeList';
import styles from './App.module.css';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export const App: React.FC = () => {
  const {
    employees,
    loading,
    error,
    validationErrors,
    fetchEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
    clearValidationErrors
  } = useEmployee();

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Toast notification state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const triggerToast = (message: string, type: ToastType) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Local Search filtering logic
  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.employee_name.toLowerCase().includes(term) ||
      emp.employee_code.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term) ||
      emp.designation.toLowerCase().includes(term)
    );
  });

  const handleOpenCreateModal = () => {
    setSelectedEmployee(undefined);
    clearValidationErrors();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    clearValidationErrors();
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (id: number) => {
    const emp = employees.find(e => e.employee_id === id);
    setSelectedEmployee(emp);
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: Employee): Promise<boolean> => {
    let success = false;
    if (selectedEmployee && selectedEmployee.employee_id !== undefined) {
      success = await editEmployee(selectedEmployee.employee_id, data);
      if (success) {
        triggerToast('Employee record updated successfully.', 'success');
        setIsFormModalOpen(false);
      } else {
        triggerToast('Failed to update employee. Please check details.', 'error');
      }
    } else {
      success = await addEmployee(data);
      if (success) {
        triggerToast('Employee record created successfully.', 'success');
        setIsFormModalOpen(false);
      } else {
        triggerToast('Failed to create employee. Check values.', 'error');
      }
    }
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;
    const success = await removeEmployee(deleteId);
    setIsDeleteModalOpen(false);
    setDeleteId(null);
    if (success) {
      triggerToast('Employee record deleted successfully.', 'success');
    } else {
      triggerToast('Failed to delete employee record.', 'error');
    }
  };

  return (
    <div className={styles.portalContainer}>
      
      <header className={styles.portalHeader}>
        <div className={styles.brandGroup}>
          <span className={styles.brandTitle}>Employee Tracker</span>
          <div className={styles.searchWrapper}>
            <span className="material-symbols-outlined absolute left-md text-outline">search</span>
            <input
              type="text"
              placeholder="Search data points..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className={styles.portalMain}>
        <section className={styles.sectionCanvas}>
          {/* Controls bar */}
          <div className={styles.canvasHeader}>
            <div className={styles.canvasTitleGroup}>
              <h2>Employee Directory</h2>
              <p>Manage organizational personnel data through create, read, update, and delete operations.</p>
            </div>
            <div className={styles.canvasControls}>
              <button className={styles.addNewBtn} onClick={handleOpenCreateModal}>
                <span className="material-symbols-outlined">person_add</span>
                <span>Add New Employee</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          {loading ? (
            <div className={styles.skeletonList}>
              <div className={styles.skeletonRow} />
              <div className={styles.skeletonRow} />
              <div className={styles.skeletonRow} />
              <div className={styles.skeletonRow} />
            </div>
          ) : error ? (
            <div className={styles.errorCard}>
              <span className="material-symbols-outlined text-[48px]" style={{ color: 'var(--color-status-error)' }}>error</span>
              <h4 className={styles.errorTitle}>Connection Error</h4>
              <p className={styles.errorText}>{error}</p>
              <button className={styles.retryBtn} onClick={fetchEmployees}>
                Retry Connection
              </button>
            </div>
          ) : (
            <EmployeeList
              employees={filteredEmployees}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              variant="portal"
            />
          )}

          {/* Footer pagination */}
          <div className={styles.paginationFooter}>
            <span className={styles.paginationText}>Showing {filteredEmployees.length} of {employees.length} employees</span>
            <div className={styles.paginationControls}>
              <button className={styles.paginationBtn}>
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className={styles.paginationActivePage}>1</span>
              <button className={styles.paginationBtn}>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Floating Add Button */}
      <button className={styles.mobileFloatingBtn} onClick={handleOpenCreateModal} aria-label="Add Employee">
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* Create / Edit Employee Dialog */}
      <Modal
        isOpen={isFormModalOpen}
        title={selectedEmployee ? 'Edit Employee Details' : 'Create Employee Profile'}
        onClose={() => setIsFormModalOpen(false)}
      >
        <EmployeeForm
          initialData={selectedEmployee}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          backendErrors={validationErrors}
          clearBackendErrors={clearValidationErrors}
        />
      </Modal>

      {/* Deletion confirmation dialog */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Confirm Record Deletion"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div>
          <p className={styles.confirmDeleteTitle}>
            Are you sure you want to permanently delete the profile of{' '}
            <strong>{selectedEmployee?.employee_name}</strong> (
            <code>{selectedEmployee?.employee_code}</code>)?
          </p>
          <div className={styles.confirmDeleteWarning}>
            Warning: This operation is permanent and cannot be undone.
          </div>
          <div className={styles.deleteActions}>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className={styles.retryBtn}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className={`${styles.addNewBtn} ${styles.deleteConfirmBtn}`}
            >
              Delete Record
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification Container */}
      <div className="toast-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

    </div>
  );
};
export default App;
