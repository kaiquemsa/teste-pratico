import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  createEmployee,
  updateEmployee,
  type Employee,
  fetchEmployeeById,
} from '../api/employees';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Building,
  Briefcase,
  XCircle,
  CheckCircle2,
} from 'lucide-react';

const departments = [
  'Tecnologia',
  'Recursos Humanos',
  'Administrativo',
];

const NewEmployeePage: React.FC = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [active, setActive] = useState(true);

  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAdmin) {
      navigate('/employees');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!isEditing || !id) return;

      setLoadingEmployee(true);
      try {
        const emp: Employee = await fetchEmployeeById(Number(id));
        setFullName(emp.fullName);
        setEmail(emp.email);
        setDepartment(emp.department ?? '');
        setPosition(emp.position ?? '');
        setActive(emp.active);
      } catch (error) {
        console.error('Erro ao carregar funcionário', error);
        alert('Erro ao carregar dados do funcionário.');
        navigate('/employees');
      } finally {
        setLoadingEmployee(false);
      }
    };

    load();
  }, [isEditing, id, navigate]);

  const validate = () => {
    const fieldErrors: Record<string, string> = {};
    if (!fullName.trim()) fieldErrors.fullName = 'Nome é obrigatório';
    else if (fullName.trim().length < 2)
      fieldErrors.fullName = 'Nome deve ter pelo menos 2 caracteres';

    if (!email.trim()) fieldErrors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      fieldErrors.email = 'Email inválido';

    if (!department.trim())
      fieldErrors.department = 'Departamento é obrigatório';

    if (!position.trim()) fieldErrors.position = 'Cargo é obrigatório';

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        fullName,
        email,
        department: department || undefined,
        position: position || undefined,
        active,
      };

      if (isEditing && id) {
        await updateEmployee(Number(id), payload);
      } else {
        await createEmployee(payload);
      }

      navigate('/employees');
    } catch (error) {
      console.error('Erro ao salvar funcionário', error);
      alert('Erro ao salvar funcionário.');
    } finally {
      setSaving(false);
    }
  };

  if (isEditing && loadingEmployee) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isEditing
                ? 'Atualize os dados do funcionário'
                : 'Preencha os dados para cadastrar um novo funcionário'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-card border border-border rounded-3xl shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-foreground">
                Informações do Funcionário
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label
                  htmlFor="fullName"
                  className="text-xs font-medium text-foreground"
                >
                  Nome completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Nome do funcionário"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pl-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-foreground"
                >
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pl-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="department"
                    className="text-xs font-medium text-foreground"
                  >
                    Departamento *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pl-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Selecione o departamento</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.department && (
                    <p className="text-xs text-red-500">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="position"
                    className="text-xs font-medium text-foreground"
                  >
                    Cargo *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="position"
                      type="text"
                      placeholder="Ex: Desenvolvedor Sênior"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pl-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {errors.position && (
                    <p className="text-xs text-red-500">{errors.position}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-foreground">
                  Status *
                </span>
                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setActive(true)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border ${
                      active
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-border text-muted-foreground bg-background'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Ativo
                  </button>
                  <button
                    type="button"
                    onClick={() => setActive(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border ${
                      !active
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-border text-muted-foreground bg-background'
                    }`}
                  >
                    <XCircle className="h-3 w-3" />
                    Inativo
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/employees')}
                  className="flex-1 rounded-xl border border-border bg-background text-sm text-foreground py-2.5 hover:bg-muted transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold py-2.5 shadow-glow disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default NewEmployeePage;