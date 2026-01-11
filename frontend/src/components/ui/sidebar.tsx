import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

type NavItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  path: string;
  requiresAdmin?: boolean;
};

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Funcionários', path: '/employees' },
  { icon: UserPlus, label: 'Novo Funcionário', path: '/employees/new', requiresAdmin: true },
  { icon: Shield, label: 'Usuários', path: '/users', requiresAdmin: true },
];


export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleNavItems = navItems.filter(
    (item) => !item.requiresAdmin || isAdmin,
  );

  const asideClassName = [
    'fixed left-0 top-0 h-screen gradient-dark text-sidebar-foreground flex flex-col transition-all duration-300 z-50',
    collapsed ? 'w-20' : 'w-64',
  ].join(' ');

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={asideClassName}
    >
      <div className="p-6 flex items-center justify-between border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary shadow-glow">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg"
            >
              StaffHub
            </motion.span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="h-8 w-8 flex items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              )}    
            >
              <Icon
                className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-primary-foreground' : ''
                }`}
              />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="mb-4 px-1">
            <p className="text-xs text-sidebar-foreground/60">Logado como</p>
            <p className="text-sm font-medium truncate">{user.email}</p>
          </div>
        )}

        <button
          type="button"
          onClick={logout}
          className={[
            'w-full flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-red-400 text-sm rounded-lg px-3 py-2 transition',
            collapsed ? 'justify-center' : 'justify-start',
          ].join(' ')}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </motion.aside>
  );
};
