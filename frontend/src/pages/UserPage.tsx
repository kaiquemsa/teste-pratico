import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Mail,
  Shield,
} from 'lucide-react';
import {
  fetchUsers,
  createUser,
  type AppUser,
  type CreateUserPayload,
} from '../api/users';
import axios from 'axios';

type Tab = 'list' | 'create';

const UsersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'VIEWER'>('VIEWER');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error('Erro ao carregar usuários', err);
      alert('Erro ao carregar usuários.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('VIEWER');
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Nome é obrigatório';
    else if (name.trim().length < 2)
      errors.name = 'Nome deve ter pelo menos 2 caracteres';

    if (!email.trim()) errors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = 'Email inválido';

    if (!password.trim()) errors.password = 'Senha é obrigatória';
    else if (password.length < 6)
      errors.password = 'Senha deve ter pelo menos 6 caracteres';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload: CreateUserPayload = {
        name,
        email,
        password,
        role,
      };

      await createUser(payload);
      await loadUsers();
      resetForm();
      setActiveTab('list');
    } catch (err: unknown) {
      console.error('Erro ao criar usuário', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
        setFormErrors({ email: 'Email já cadastrado' });
        return;
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const isListTab = activeTab === 'list';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Usuários do Sistema
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gerencie contas de acesso (apenas administradores)
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs rounded-full bg-sidebar-accent/60 px-4 py-1 text-sidebar-foreground">
            <Shield className="h-3 w-3" />
            Acesso restrito a administradores
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-card border border-border rounded-3xl shadow-lg overflow-hidden">
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${
                  isListTab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Users className="h-4 w-4" />
                Lista de usuários
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${
                  !isListTab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Plus className="h-4 w-4" />
                Criar usuário
              </button>
            </div>

            <div className="p-5">
              {isListTab ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{users.length} usuário(s)</span>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="p-4 rounded-full bg-muted mb-3">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Nenhum usuário encontrado
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Comece criando um novo usuário na aba ao lado
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="text-xs text-muted-foreground border-b border-border">
                            <th className="px-3 py-2">Nome</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">Perfil</th>
                            <th className="px-3 py-2">Criado em</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr
                              key={u.id}
                              className="border-b last:border-0 border-border"
                            >
                              <td className="px-3 py-2 text-foreground">
                                {u.name}
                              </td>
                              <td className="px-3 py-2 text-xs text-muted-foreground">
                                {u.email}
                              </td>
                              <td className="px-3 py-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] ${
                                    u.role === 'ADMIN'
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {u.role === 'ADMIN' ? 'Admin' : 'Viewer'}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-xs text-muted-foreground">
                                {new Date(u.createdAt).toLocaleDateString(
                                  'pt-BR',
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleCreateUser} className="space-y-5">
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="text-xs font-medium text-foreground"
                    >
                      Nome *
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Nome do usuário"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500">
                        {formErrors.name}
                      </p>
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
                    {formErrors.email && (
                      <p className="text-xs text-red-500">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="text-xs font-medium text-foreground"
                    >
                      Senha *
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {formErrors.password && (
                      <p className="text-xs text-red-500">
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-foreground">
                      Perfil *
                    </span>
                    <div className="flex gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => setRole('ADMIN')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border ${
                          role === 'ADMIN'
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-border text-muted-foreground bg-background'
                        }`}
                      >
                        Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('VIEWER')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border ${
                          role === 'VIEWER'
                            ? 'border-slate-500 bg-slate-100 text-slate-700'
                            : 'border-border text-muted-foreground bg-background'
                        }`}
                      >
                        Viewer
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 rounded-xl border border-border bg-background text-sm text-foreground py-2.5 hover:bg-muted transition"
                    >
                      Limpar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold py-2.5 shadow-glow disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {saving ? 'Criando...' : 'Criar usuário'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
