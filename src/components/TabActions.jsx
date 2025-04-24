"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, AlertCircle, Clock, CheckCircle } from "lucide-react"
import Modal from "./Modal"
import ActionForm from "./ActionForm"

const TabActions = ({ establishmentId, onUpdate, contacts = [] }) => {
  const [actions, setActions] = useState(() => {
    const savedActions = localStorage.getItem(`actions_${establishmentId}`)
    return savedActions ? JSON.parse(savedActions) : []
  })
  const [showModal, setShowModal] = useState(false)
  const [editingAction, setEditingAction] = useState(null)

  const saveActions = (updatedActions) => {
    setActions(updatedActions)
    localStorage.setItem(`actions_${establishmentId}`, JSON.stringify(updatedActions))

    // Mettre à jour le nombre total d'actions dans l'établissement
    onUpdate({ totalActions: updatedActions.length })
  }

  const handleAddAction = (actionData) => {
    const newAction = {
      ...actionData,
      id: Date.now(),
      dateCreation: new Date().toISOString().split("T")[0],
    }

    const updatedActions = [...actions, newAction]
    saveActions(updatedActions)
    setShowModal(false)
  }

  const handleEditAction = (action) => {
    setEditingAction(action)
    setShowModal(true)
  }

  const handleUpdateAction = (updatedActionData) => {
    const updatedActions = actions.map((action) =>
      action.id === editingAction.id ? { ...action, ...updatedActionData } : action,
    )

    saveActions(updatedActions)
    setShowModal(false)
    setEditingAction(null)
  }

  const handleDeleteAction = (actionId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette action ?")) {
      const updatedActions = actions.filter((action) => action.id !== actionId)
      saveActions(updatedActions)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "À faire":
        return <AlertCircle size={16} className="status-icon status-todo" />
      case "En cours":
        return <Clock size={16} className="status-icon status-progress" />
      case "Réalisé":
        return <CheckCircle size={16} className="status-icon status-done" />
      default:
        return null
    }
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Basse":
        return "priority-low"
      case "Moyenne":
        return "priority-medium"
      case "Haute":
        return "priority-high"
      case "Critique":
        return "priority-critical"
      default:
        return ""
    }
  }

  return (
    <div className="actions-tab">
      <div className="tab-header">
        <h3>Actions à réaliser</h3>
        <button
          className="add-button"
          onClick={() => {
            setEditingAction(null)
            setShowModal(true)
          }}
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      {actions.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Statut</th>
              <th>Description</th>
              <th>Échéance</th>
              <th>Responsable</th>
              <th>Priorité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action) => (
              <tr key={action.id}>
                <td>
                  <div className="status-cell">
                    {getStatusIcon(action.statut)}
                    <span>{action.statut}</span>
                  </div>
                </td>
                <td>{action.description}</td>
                <td>{new Date(action.echeance).toLocaleDateString()}</td>
                <td>{action.responsable === "Autre" ? action.responsableAutre : action.responsable}</td>
                <td>
                  <span className={`priority-badge ${getPriorityClass(action.priorite)}`}>{action.priorite}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="icon-button" onClick={() => handleEditAction(action)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-button delete" onClick={() => handleDeleteAction(action.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>Aucune action à réaliser</p>
        </div>
      )}

      {showModal && (
        <Modal
          title={editingAction ? "Modifier l'action" : "Ajouter une action"}
          onClose={() => {
            setShowModal(false)
            setEditingAction(null)
          }}
        >
          <ActionForm
            initialData={editingAction}
            onSubmit={editingAction ? handleUpdateAction : handleAddAction}
            contacts={contacts}
          />
        </Modal>
      )}

      <style jsx>{`
        .status-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-icon {
          flex-shrink: 0;
        }
        
        .status-todo {
          color: #f57c00;
        }
        
        .status-progress {
          color: #1e88e5;
        }
        
        .status-done {
          color: #43a047;
        }
        
        .priority-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .priority-low {
          background-color: #e8f5e9;
          color: #43a047;
        }
        
        .priority-medium {
          background-color: #e3f2fd;
          color: #1e88e5;
        }
        
        .priority-high {
          background-color: #fff4e5;
          color: #ff9800;
        }
        
        .priority-critical {
          background-color: #ffeceb;
          color: #e53935;
        }
        
        .row-actions {
          display: flex;
          gap: 8px;
        }
        
        .icon-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #555;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .icon-button:hover {
          background-color: #f0f0f0;
        }
        
        .icon-button.delete:hover {
          background-color: #ffeceb;
          color: #e53935;
        }
      `}</style>
    </div>
  )
}

export default TabActions
