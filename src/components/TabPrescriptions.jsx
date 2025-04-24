"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, AlertCircle, Clock, CheckCircle } from "lucide-react"
import Modal from "./Modal"
import PrescriptionForm from "./PrescriptionForm"

const TabPrescriptions = ({ establishmentId, onUpdate }) => {
  const [prescriptions, setPrescriptions] = useState(() => {
    const savedPrescriptions = localStorage.getItem(`prescriptions_${establishmentId}`)
    return savedPrescriptions ? JSON.parse(savedPrescriptions) : []
  })
  const [showModal, setShowModal] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState(null)

  const savePrescriptions = (updatedPrescriptions) => {
    setPrescriptions(updatedPrescriptions)
    localStorage.setItem(`prescriptions_${establishmentId}`, JSON.stringify(updatedPrescriptions))

    // Mettre à jour le nombre total de prescriptions dans l'établissement
    onUpdate({ totalPrescriptions: updatedPrescriptions.length })
  }

  const handleAddPrescription = (prescriptionData) => {
    const newPrescription = {
      ...prescriptionData,
      id: Date.now(),
      dateCreation: new Date().toISOString().split("T")[0],
    }

    const updatedPrescriptions = [...prescriptions, newPrescription]
    savePrescriptions(updatedPrescriptions)
    setShowModal(false)
  }

  const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription)
    setShowModal(true)
  }

  const handleUpdatePrescription = (updatedPrescriptionData) => {
    const updatedPrescriptions = prescriptions.map((prescription) =>
      prescription.id === editingPrescription.id ? { ...prescription, ...updatedPrescriptionData } : prescription,
    )

    savePrescriptions(updatedPrescriptions)
    setShowModal(false)
    setEditingPrescription(null)
  }

  const handleDeletePrescription = (prescriptionId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette prescription ?")) {
      const updatedPrescriptions = prescriptions.filter((prescription) => prescription.id !== prescriptionId)
      savePrescriptions(updatedPrescriptions)
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
    <div className="prescriptions-tab">
      <div className="tab-header">
        <h3>Prescriptions Commission de Sécurité</h3>
        <button
          className="add-button"
          onClick={() => {
            setEditingPrescription(null)
            setShowModal(true)
          }}
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      {prescriptions.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Statut</th>
              <th>Prescriptions</th>
              <th>Date de réalisation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription.id}>
                <td>
                  <div className="status-cell">
                    {getStatusIcon(prescription.statut)}
                    <span>{prescription.statut}</span>
                  </div>
                </td>
                <td>{prescription.description}</td>
                <td>
                  {prescription.dateRealisation ? new Date(prescription.dateRealisation).toLocaleDateString() : "-"}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="icon-button" onClick={() => handleEditPrescription(prescription)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-button delete" onClick={() => handleDeletePrescription(prescription.id)}>
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
          <p>Aucune prescription enregistrée</p>
        </div>
      )}

      {showModal && (
        <Modal
          title={editingPrescription ? "Modifier la prescription" : "Ajouter une prescription"}
          onClose={() => {
            setShowModal(false)
            setEditingPrescription(null)
          }}
        >
          <PrescriptionForm
            initialData={editingPrescription}
            onSubmit={editingPrescription ? handleUpdatePrescription : handleAddPrescription}
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

export default TabPrescriptions
