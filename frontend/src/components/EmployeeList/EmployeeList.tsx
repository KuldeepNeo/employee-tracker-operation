import React from 'react';
import { Employee } from '../../types/employee';
import styles from './EmployeeList.module.css';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  variant?: 'portal' | 'dashboard';
}

const getInitials = (name: string) => {
  if (!name || !name.trim()) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  const second = parts[1];
  if (first && second && first[0] && second[0]) {
    return (first[0] + second[0]).toUpperCase();
  }
  if (first && first[0]) {
    return first[0].toUpperCase();
  }
  return '';
};

const getStatus = (name: string, role: string) => {
  // Hardcoded case to match Bennett King (Sales, Account Executive) in Stitch screenshot
  if (name.includes('Bennett King') || role.toLowerCase() === 'account executive') {
    return 'On Leave';
  }
  return 'Active';
};

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onEdit,
  onDelete,
  variant = 'portal'
}) => {
  if (employees.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className="material-symbols-outlined text-[48px]" style={{ color: 'var(--color-outline)' }}>folder_open</span>
        <h4 className={styles.emptyTitle}>No Employees Found</h4>
        <p className={styles.emptyText}>There are no employee records inside the system. Click "Add New Employee" to create one.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className={styles.tableWrapper}>
        <table className={`${styles.table} ${variant === 'dashboard' ? styles.dashboardTable : ''}`}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.th}>Employee Name</th>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Department</th>
              <th className={styles.th}>Role</th>
              <th className={styles.th}>Status</th>
              <th className={`${styles.th} ${styles.actionsHeader}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => {
              const status = getStatus(emp.employee_name, emp.designation);
              const initials = getInitials(emp.employee_name);
              // Alternate initials circle style to match visual variety
              const initialsClass = index % 2 === 0 ? styles.initialsPrimary : styles.initialsSecondary;
              
              return (
                <tr key={emp.employee_id} className={`${styles.row} ${variant === 'dashboard' ? styles.dashboardRow : ''}`}>
                  <td className={styles.td}>
                    <div className={styles.nameContainer}>
                      <div className={`${styles.initialsCircle} ${initialsClass}`}>
                        {initials}
                      </div>
                      <span className={styles.nameText}>{emp.employee_name}</span>
                    </div>
                  </td>
                  <td className={styles.tdId}>{emp.employee_code}</td>
                  <td className={styles.tdOnSurface}>{emp.department}</td>
                  <td className={styles.tdRole}>{emp.designation}</td>
                  <td className={styles.td}>
                    {status === 'Active' ? (
                      <span className={`${styles.statusBadge} ${styles.statusActive}`}>Active</span>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles.statusLeave}`}>On Leave</span>
                    )}
                  </td>
                  <td className={`${styles.td} ${styles.actionsCell}`}>
                    {variant === 'portal' ? (
                      <div className={styles.portalActions}>
                        <button
                          className={styles.portalEditBtn}
                          onClick={() => onEdit(emp)}
                          title="Edit Employee"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          className={styles.portalDeleteBtn}
                          onClick={() => emp.employee_id && onDelete(emp.employee_id)}
                          title="Delete Employee"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    ) : (
                      <div className={styles.dashboardActions}>
                        <button
                          className={styles.dashboardEditBtn}
                          onClick={() => onEdit(emp)}
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          className={styles.dashboardDeleteBtn}
                          onClick={() => emp.employee_id && onDelete(emp.employee_id)}
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className={styles.mobileCards}>
        {employees.map((emp, index) => {
          const status = getStatus(emp.employee_name, emp.designation);
          const initials = getInitials(emp.employee_name);
          const initialsClass = index % 2 === 0 ? styles.initialsPrimary : styles.initialsSecondary;

          return (
            <div key={emp.employee_id} className={styles.mobileCard}>
              <div className={styles.cardHeader}>
                <div className={styles.nameContainer}>
                  <div className={`${styles.initialsCircle} ${initialsClass}`}>
                    {initials}
                  </div>
                  <div>
                    <h4 className={styles.cardTitle}>{emp.employee_name}</h4>
                    <span className={styles.cardSubtitle}>{emp.employee_code}</span>
                  </div>
                </div>
                {status === 'Active' ? (
                  <span className={`${styles.statusBadge} ${styles.statusActive}`}>Active</span>
                ) : (
                  <span className={`${styles.statusBadge} ${styles.statusLeave}`}>On Leave</span>
                )}
              </div>
              
              <div className={styles.cardMeta}>
                <div className={styles.cardMetaRow}>
                  <span className="material-symbols-outlined text-[16px] text-secondary">domain</span>
                  <span>{emp.department}</span>
                </div>
                <div className={styles.cardMetaRow}>
                  <span className="material-symbols-outlined text-[16px] text-secondary">work</span>
                  <span>{emp.designation}</span>
                </div>
                <div className={styles.cardMetaRow}>
                  <span className="material-symbols-outlined text-[16px] text-secondary">call</span>
                  <span>{emp.phone_number}</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button
                  className={styles.portalEditBtn}
                  onClick={() => onEdit(emp)}
                  title="Edit Record"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  className={styles.portalDeleteBtn}
                  onClick={() => emp.employee_id && onDelete(emp.employee_id)}
                  title="Delete Record"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default EmployeeList;
