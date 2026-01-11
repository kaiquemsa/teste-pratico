import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  fetchEmployees,
  deleteEmployee as apiDeleteEmployee,
  type Employee,
} from '../api/employees';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Building,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ConfirmModal } from '../components/ui/confirmModal';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Erro ao carregar funcionários', error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        const term = search.toLowerCase();
        return (
          employee.fullName.toLowerCase().includes(term) ||
          employee.email.toLowerCase().includes(term) ||
          (employee.department ?? '').toLowerCase().includes(term) ||
          (employee.position ?? '').toLowerCase().includes(term)
        );
      }),
    [employees, search],
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiDeleteEmployee(deleteId);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteId));
    } catch (error) {
      console.error('Erro ao deletar funcionário', error);
      alert('Erro ao excluir funcionário.');
    } finally {
      setDeleteId(null);
    }
  };

  const total = filteredEmployees.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Funcionários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os funcionários da empresa
            </p>
          </div>

          {isAdmin && (
            <button className="gradient-primary shadow-glow rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground flex items-center gap-2">
              <Link to="/employees/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Funcionário
              </Link>
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-card border border-border rounded-3xl shadow-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar funcionários..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-3 py-2 pl-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {total} funcionário(s)
              </span>
            </div>

            <div className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : filteredEmployees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-xs text-muted-foreground border-b border-border">
                        <th className="px-5 py-3">Funcionário</th>
                        <th className="px-5 py-3">Departamento</th>
                        <th className="px-5 py-3">Cargo</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">
                          {isAdmin ? 'Ações' : ''}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee, index) => (
                        <motion.tr
                          key={employee.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="group border-b last:border-0 border-border"
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-semibold uppercase">
                                {employee.fullName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {employee.fullName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {employee.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2 text-foreground">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              {employee.department ?? '—'}
                            </div>
                          </td>

                          <td className="px-5 py-3 text-foreground">
                            {employee.position ?? '—'}
                          </td>

                          <td className="px-5 py-3">
                            {employee.active ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-xs px-3 py-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 text-xs px-3 py-1">
                                <XCircle className="h-3 w-3" />
                                Inativo
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-3 text-right">
                            {isAdmin ? (
                              <div className="flex items-center justify-end gap-2 text-xs">
                                <Link
                                  to={`/employees/${employee.id}/edit`}
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  <Edit className="h-3 w-3" />
                                  Editar
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setDeleteId(employee.id)}
                                  className="text-destructive hover:underline flex items-center gap-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Excluir
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">
                                Somente leitura
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1 text-foreground">
                    Nenhum funcionário encontrado
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {search
                      ? 'Tente ajustar sua busca'
                      : 'Comece adicionando seu primeiro funcionário'}
                  </p>
                  {!search && isAdmin && (
                    <button className="gradient-primary rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground flex items-center gap-2">
                      <Link
                        to="/employees/new"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Funcionário
                      </Link>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      {deleteId && (
        <ConfirmModal
          title="Excluir Funcionário"
          description="Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita."
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            await handleDelete();
            setDeleteId(null);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default EmployeesPage;
