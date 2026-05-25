import { useState } from "react";

/**
 * Drop-in replacement for browser confirm().
 * Returns { confirm, ConfirmDialog }.
 *
 * Usage:
 *   const { confirm, ConfirmDialog } = useConfirm();
 *
 *   async function handleDelete(id) {
 *     if (!await confirm("Delete this item?")) return;
 *     // proceed with delete
 *   }
 *
 *   return (
 *     <>
 *       {ConfirmDialog}
 *       ...rest of JSX...
 *     </>
 *   );
 */
export function useConfirm() {
  const [dialog, setDialog] = useState(null);

  function confirm(message, { confirmLabel = "Delete", danger = true } = {}) {
    return new Promise((resolve) => {
      setDialog({ message, confirmLabel, danger, resolve });
    });
  }

  function accept() {
    dialog?.resolve(true);
    setDialog(null);
  }

  function dismiss() {
    dialog?.resolve(false);
    setDialog(null);
  }

  const ConfirmDialog = dialog ? (
    <div className="modal-overlay" onClick={dismiss}>
      <div
        className="modal"
        style={{ maxWidth: "380px", textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>
          {dialog.danger ? "⚠️" : "❓"}
        </div>
        <h2 style={{ fontSize: "1.1rem", marginBottom: ".6rem" }}>Are you sure?</h2>
        <p style={{ color: "var(--gray-500)", fontSize: ".9rem", marginBottom: 0 }}>
          {dialog.message}
        </p>
        <div className="modal-footer" style={{ justifyContent: "center" }}>
          <button className="btn btn--ghost btn--sm" onClick={dismiss}>
            Cancel
          </button>
          <button
            className={`btn btn--sm ${dialog.danger ? "btn--danger" : "btn--primary"}`}
            onClick={accept}
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ConfirmDialog };
}
