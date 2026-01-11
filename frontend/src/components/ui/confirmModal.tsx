import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export const ConfirmModal: React.FC<Props> = ({
  title,
  description,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 max-w-sm w-full space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-lg bg-destructive text-white text-sm hover:bg-destructive/90 transition"
          >
            Excluir
          </button>
        </div>
      </motion.div>
    </div>
  );
};
