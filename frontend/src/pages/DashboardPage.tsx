import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Employee, fetchEmployees } from '../api/employees';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

    const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.active).length;
    const inactive = total - active;
    const onLeave = 0;

    return { total, active, inactive, onLeave };
  }, [employees]);

  const departmentData = useMemo(() => {
    return employees.reduce((acc: Record<string, number>, emp) => {
      const dept = emp.department ?? 'Não informado';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
  }, [employees]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu time e métricas importantes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-4 shadow-glow text-white gradient-primary border border-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-80">Total de Funcionários</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
                <p className="text-xs mt-2 opacity-80">+12% vs mês anterior</p>
              </div>
              <Users className="h-8 w-8" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-4 bg-card shadow-lg border border-border text-foreground"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-3xl font-bold mt-1">{stats.active}</p>
                <p className="text-xs mt-2 text-green-500">+5% vs mês anterior</p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl p-4 bg-card shadow-lg border border-border text-foreground"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Inativos</p>
                <p className="text-3xl font-bold mt-1">{stats.inactive}</p>
              </div>
              <UserX className="h-8 w-8 text-muted-foreground" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl p-4 bg-card shadow-lg border border-border text-foreground"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Afastados</p>
                <p className="text-3xl font-bold mt-1">{stats.onLeave}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl p-5 bg-card border border-border shadow-lg min-h-[240px]">
            <h2 className="text-sm font-semibold text-foreground">
              Funcionários por Departamento
            </h2>
            {Object.keys(departmentData).length === 0 ? (
              <div className="flex justify-center items-center h-full text-xs text-muted-foreground">
                Nenhum dado disponível
              </div>
            ) : (
              <div className="mt-4 space-y-2 text-sm">
                {Object.entries(departmentData).map(([name, count]) => (
                  <div key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl p-5 bg-card border border-border shadow-lg min-h-[240px]">
            <h2 className="text-sm font-semibold text-foreground">
              Contratações Recentes
            </h2>
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground mt-4">
              Nenhum funcionário cadastrado
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};


export default DashboardPage;
