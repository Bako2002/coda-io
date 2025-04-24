"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, AlertCircle, Clock, CheckCircle } from "lucide-react"
import Modal from "./Modal"
import ObservationForm from "./ObservationForm"

const TabObservations = ({ establishmentId, onUpdate }) => {
  const [observations, setObservations] = useState(() => {
    const savedObservations = localStorage.getItem(`observations_${establishmentId}`)
    return savedObservations ? JSON.parse(savedObservations) : []
  })
  const [showModal, setShowModal] = useState(false)
  const [editingObservation, setEditingObservation] = useState(null)

  const saveObservations = (updatedObservations) => {
    setObservations(updatedObservations)
    localStorage.setItem(`observations_${establishmentId}`, JSON.stringify(updatedObservations))

    // Mettre à jour le nombre total d'observations dans l'établissement
    onUpdate({ totalObservations: updatedObservations.length })
  }

  const handleAddObservation = (observationData) => {
    const newObservation = {
      ...observationData,
      id: Date.now(),
      dateCreation: new Date().toISOString().split("T")[0],
    }

    const updatedObservations = [...observations, newObservation]
    saveObservations(updatedObservations)
    setShowModal(false)
  }

  const handleEditObservation = (observation) => {
    setEditingObservation(observation)
    setShowModal(true)
  }

  const handleUpdateObservation = (updatedObservationData) => {
    const updatedObservations = observations.map((observation) =>
      observation.id === editingObservation.id ? { ...observation, ...updatedObservationData } : observation,
    )

    saveObservations(updatedObservations)
    setShowModal(false)
    setEditingObservation(null)
  }

  const handleDeleteObservation = (observationId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette observation ?")) {
      const updatedObservations = observations.filter((observation) => observation.id !== observationId)
      saveObservations(updatedObservations)
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

  return (
    <div className="observations-tab">
      <div className="tab-header">
        <h3>Observation PRÉVERIS</h3>
        <button
          className="add-button"
          onClick={() => {
            setEditingObservation(null)
            setShowModal(true)
          }}
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      {observations.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Statut</th>
              <th>Observations des Visites</th>
              <th>Date d'observation</th>
              <th>Date de réalisation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((observation) => (
              <tr key={observation.id}>
                <td>
                  <div className="status-cell">
                    {getStatusIcon(observation.statut)}
                    <span>{observation.statut}</span>
                  </div>
                </td>
                <td>{observation.description}</td>
                <td>{new Date(observation.dateObservation).toLocaleDateString()}</td>
                <td>
                  {observation.dateRealisation ? new Date(observation.dateRealisation).toLocaleDateString() : "-"}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="icon-button" onClick={() => handleEditObservation(observation)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-button delete" onClick={() => handleDeleteObservation(observation.id)}>
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
          <p>Aucune observation enregistrée</p>
        </div>
      )}

      {showModal && (
        <Modal
          title={editingObservation ? "Modifier l'observation" : "Ajouter une observation"}
          onClose={() => {
            setShowModal(false)
            setEditingObservation(null)
          }}
        >
          <ObservationForm
            initialData={editingObservation}
            onSubmit={editingObservation ? handleUpdateObservation : handleAddObservation}
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

export default TabObservations
