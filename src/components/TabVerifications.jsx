"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, FileText, AlertCircle, CheckCircle } from "lucide-react"
import Modal from "./Modal"
import VerificationForm from "./VerificationForm"

const TabVerifications = ({ establishmentId, onUpdate }) => {
  const [verifications, setVerifications] = useState(() => {
    const savedVerifications = localStorage.getItem(`verifications_${establishmentId}`)
    return savedVerifications ? JSON.parse(savedVerifications) : []
  })
  const [showModal, setShowModal] = useState(false)
  const [editingVerification, setEditingVerification] = useState(null)

  const saveVerifications = (updatedVerifications) => {
    setVerifications(updatedVerifications)
    localStorage.setItem(`verifications_${establishmentId}`, JSON.stringify(updatedVerifications))

    // Mettre à jour le nombre total de vérifications dans l'établissement
    onUpdate({ totalVerifications: updatedVerifications.length })
  }

  const handleAddVerification = (verificationData) => {
    const newVerification = {
      ...verificationData,
      id: Date.now(),
      dateCreation: new Date().toISOString().split("T")[0],
    }

    const updatedVerifications = [...verifications, newVerification]
    saveVerifications(updatedVerifications)
    setShowModal(false)
  }

  const handleEditVerification = (verification) => {
    setEditingVerification(verification)
    setShowModal(true)
  }

  const handleUpdateVerification = (updatedVerificationData) => {
    const updatedVerifications = verifications.map((verification) =>
      verification.id === editingVerification.id ? { ...verification, ...updatedVerificationData } : verification,
    )

    saveVerifications(updatedVerifications)
    setShowModal(false)
    setEditingVerification(null)
  }

  const handleDeleteVerification = (verificationId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vérification ?")) {
      const updatedVerifications = verifications.filter((verification) => verification.id !== verificationId)
      saveVerifications(updatedVerifications)
    }
  }

  return (
    <div className="verifications-tab">
      <div className="tab-header">
        <h3>Vérifications Périodiques</h3>
        <button
          className="add-button"
          onClick={() => {
            setEditingVerification(null)
            setShowModal(true)
          }}
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      {verifications.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Installations Techniques</th>
              <th>Sociétés Prestataire</th>
              <th>Date</th>
              <th>Rapport(s)</th>
              <th>En Analyse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifications.map((verification) => (
              <tr key={verification.id}>
                <td>{verification.installation}</td>
                <td>{verification.societe}</td>
                <td>{new Date(verification.date).toLocaleDateString()}</td>
                <td>
                  {verification.rapport && (
                    <div className="rapport-link">
                      <FileText size={16} />
                      <span>{verification.rapport}</span>
                    </div>
                  )}
                </td>
                <td>
                  {verification.enAnalyse === "Oui" ? (
                    <span className="analyse-badge analyse-yes">
                      <AlertCircle size={16} />
                      Oui
                    </span>
                  ) : (
                    <span className="analyse-badge analyse-no">
                      <CheckCircle size={16} />
                      Non
                    </span>
                  )}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="icon-button" onClick={() => handleEditVerification(verification)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-button delete" onClick={() => handleDeleteVerification(verification.id)}>
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
          <p>Aucune vérification périodique enregistrée</p>
        </div>
      )}

      {showModal && (
        <Modal
          title={editingVerification ? "Modifier la vérification" : "Ajouter une vérification"}
          onClose={() => {
            setShowModal(false)
            setEditingVerification(null)
          }}
        >
          <VerificationForm
            initialData={editingVerification}
            onSubmit={editingVerification ? handleUpdateVerification : handleAddVerification}
          />
        </Modal>
      )}

      <style jsx>{`
        .rapport-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1e88e5;
        }
        
        .analyse-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .analyse-yes {
          background-color: #ffeceb;
          color: #e53935;
        }
        
        .analyse-no {
          background-color: #e8f5e9;
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

export default TabVerifications
