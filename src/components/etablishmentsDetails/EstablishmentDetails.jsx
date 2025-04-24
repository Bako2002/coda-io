"use client"

import { useState } from "react"
import { ArrowLeft, Edit, Trash2, Plus, Check, Clock, AlertTriangle } from "lucide-react"
import Modal from "../modal/Modal"
import DynamicForm from "../newEtablishment/DynamicForm"
import ContactForm from "../ContactForm"
import ActionForm from "../ActionForm"
import VerificationForm from "../VerificationForm"
import PrescriptionForm from "../PrescriptionForm"
import ObservationForm from "../ObservationForm"
import "./EstablishmentDetails.css"

const EstablishmentDetails = ({ establishment, onBack, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [activeTab, setActiveTab] = useState("actions")
  const [showContactForm, setShowContactForm] = useState(false)
  const [showActionForm, setShowActionForm] = useState(false)
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [showObservationForm, setShowObservationForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handleUpdate = (updatedData) => {
    onUpdate({
      ...establishment,
      ...updatedData,
      derniereMaj: new Date().toISOString().split("T")[0],
    })
    setShowEditModal(false)
  }

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")) {
      onDelete(establishment.id)
    }
  }

  const renderHtmlContent = (content) => {
    return { __html: content }
  }

  // Gestion des contacts
  const handleAddContact = (contact) => {
    const newContact = {
      ...contact,
      id: establishment.contacts.length > 0 ? Math.max(...establishment.contacts.map((c) => c.id)) + 1 : 1,
    }
    const updatedEstablishment = {
      ...establishment,
      contacts: [...establishment.contacts, newContact],
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowContactForm(false)
    setEditingItem(null)
  }

  const handleUpdateContact = (updatedContact) => {
    const updatedContacts = establishment.contacts.map((contact) =>
      contact.id === updatedContact.id ? updatedContact : contact,
    )
    const updatedEstablishment = {
      ...establishment,
      contacts: updatedContacts,
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowContactForm(false)
    setEditingItem(null)
  }

  const handleDeleteContact = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      const updatedEstablishment = {
        ...establishment,
        contacts: establishment.contacts.filter((contact) => contact.id !== id),
        derniereMaj: new Date().toISOString().split("T")[0],
      }
      onUpdate(updatedEstablishment)
    }
  }

  const handleEditContact = (contact) => {
    setEditingItem(contact)
    setShowContactForm(true)
  }

  // Gestion des actions
  const handleAddAction = (action) => {
    const newAction = {
      ...action,
      id: establishment.actions.length > 0 ? Math.max(...establishment.actions.map((a) => a.id)) + 1 : 1,
    }
    const updatedEstablishment = {
      ...establishment,
      actions: [...establishment.actions, newAction],
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowActionForm(false)
    setEditingItem(null)
  }

  const handleUpdateAction = (updatedAction) => {
    const updatedActions = establishment.actions.map((action) =>
      action.id === updatedAction.id ? updatedAction : action,
    )
    const updatedEstablishment = {
      ...establishment,
      actions: updatedActions,
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowActionForm(false)
    setEditingItem(null)
  }

  const handleDeleteAction = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette action ?")) {
      const updatedEstablishment = {
        ...establishment,
        actions: establishment.actions.filter((action) => action.id !== id),
        derniereMaj: new Date().toISOString().split("T")[0],
      }
      onUpdate(updatedEstablishment)
    }
  }

  const handleEditAction = (action) => {
    setEditingItem(action)
    setShowActionForm(true)
  }

  // Gestion des vérifications
  const handleAddVerification = (verification) => {
    const newVerification = {
      ...verification,
      id: establishment.verifications.length > 0 ? Math.max(...establishment.verifications.map((v) => v.id)) + 1 : 1,
    }
    const updatedEstablishment = {
      ...establishment,
      verifications: [...establishment.verifications, newVerification],
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowVerificationForm(false)
    setEditingItem(null)
  }

  const handleUpdateVerification = (updatedVerification) => {
    const updatedVerifications = establishment.verifications.map((verification) =>
      verification.id === updatedVerification.id ? updatedVerification : verification,
    )
    const updatedEstablishment = {
      ...establishment,
      verifications: updatedVerifications,
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowVerificationForm(false)
    setEditingItem(null)
  }

  const handleDeleteVerification = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vérification ?")) {
      const updatedEstablishment = {
        ...establishment,
        verifications: establishment.verifications.filter((verification) => verification.id !== id),
        derniereMaj: new Date().toISOString().split("T")[0],
      }
      onUpdate(updatedEstablishment)
    }
  }

  const handleEditVerification = (verification) => {
    setEditingItem(verification)
    setShowVerificationForm(true)
  }

  // Gestion des prescriptions
  const handleAddPrescription = (prescription) => {
    const newPrescription = {
      ...prescription,
      id: establishment.prescriptions.length > 0 ? Math.max(...establishment.prescriptions.map((p) => p.id)) + 1 : 1,
    }
    const updatedEstablishment = {
      ...establishment,
      prescriptions: [...establishment.prescriptions, newPrescription],
      totalPrescriptions: Number.parseInt(establishment.totalPrescriptions || 0) + 1,
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowPrescriptionForm(false)
    setEditingItem(null)
  }

  const handleUpdatePrescription = (updatedPrescription) => {
    const updatedPrescriptions = establishment.prescriptions.map((prescription) =>
      prescription.id === updatedPrescription.id ? updatedPrescription : prescription,
    )
    const updatedEstablishment = {
      ...establishment,
      prescriptions: updatedPrescriptions,
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowPrescriptionForm(false)
    setEditingItem(null)
  }

  const handleDeletePrescription = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette prescription ?")) {
      const updatedEstablishment = {
        ...establishment,
        prescriptions: establishment.prescriptions.filter((prescription) => prescription.id !== id),
        totalPrescriptions: Math.max(0, Number.parseInt(establishment.totalPrescriptions || 0) - 1),
        derniereMaj: new Date().toISOString().split("T")[0],
      }
      onUpdate(updatedEstablishment)
    }
  }

  const handleEditPrescription = (prescription) => {
    setEditingItem(prescription)
    setShowPrescriptionForm(true)
  }

  // Gestion des observations
  const handleAddObservation = (observation) => {
    const newObservation = {
      ...observation,
      id: establishment.observations.length > 0 ? Math.max(...establishment.observations.map((o) => o.id)) + 1 : 1,
    }
    const updatedEstablishment = {
      ...establishment,
      observations: [...establishment.observations, newObservation],
      totalObservations: Number.parseInt(establishment.totalObservations || 0) + 1,
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowObservationForm(false)
    setEditingItem(null)
  }

  const handleUpdateObservation = (updatedObservation) => {
    const updatedObservations = establishment.observations.map((observation) =>
      observation.id === updatedObservation.id ? updatedObservation : observation,
    )
    const updatedEstablishment = {
      ...establishment,
      observations: updatedObservations,
      derniereMaj: new Date().toISOString().split("T")[0],
    }
    onUpdate(updatedEstablishment)
    setShowObservationForm(false)
    setEditingItem(null)
  }

  const handleDeleteObservation = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette observation ?")) {
      const updatedEstablishment = {
        ...establishment,
        observations: establishment.observations.filter((observation) => observation.id !== id),
        totalObservations: Math.max(0, Number.parseInt(establishment.totalObservations || 0) - 1),
        derniereMaj: new Date().toISOString().split("T")[0],
      }
      onUpdate(updatedEstablishment)
    }
  }

  const handleEditObservation = (observation) => {
    setEditingItem(observation)
    setShowObservationForm(true)
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "réalisé":
        return <Check size={16} className="status-icon status-done" />
      case "en cours":
        return <Clock size={16} className="status-icon status-progress" />
      case "à faire":
        return <AlertTriangle size={16} className="status-icon status-todo" />
      default:
        return null
    }
  }

  return (
    <div className="establishment-details">
      <div className="details-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h2>{establishment.nom}</h2>
        <div className="details-actions">
          <button className="edit-button" onClick={() => setShowEditModal(true)}>
            <Edit size={16} />
            <span>Modifier</span>
          </button>
          <button className="delete-button" onClick={handleDelete}>
            <Trash2 size={16} />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      <div className="details-content">
        <div className="details-summary">
          <div className="summary-left">
            <div className="establishment-logo">
              <img
                src={establishment.logoPreview || establishment.logo || "/placeholder.svg?height=80&width=80"}
                alt={establishment.nom}
              />
            </div>
            <div className="summary-info">
              <h3>{establishment.nom}</h3>
              <p>{establishment.adresse}</p>
              <p>
                {establishment.codePostal} {establishment.ville}
              </p>
              <p>
                <strong>Email:</strong> {establishment.email}
              </p>
              <p>
                <strong>Téléphone:</strong> {establishment.telephone}
              </p>
            </div>
          </div>
          <div className="summary-right">
            <div className="summary-badges">
              <div className="badge-item">
                <span className="badge-label">Catégorie</span>
                <span className={`category-badge category-${establishment.categorie?.charAt(0)}`}>
                  {establishment.categorie}
                </span>
              </div>
              <div className="badge-item">
                <span className="badge-label">Type</span>
                <span className="type-badge">
                  {Array.isArray(establishment.types) ? establishment.types.join(", ") : establishment.type}
                </span>
              </div>
              <div className="badge-item">
                <span className="badge-label">Avis</span>
                <span className={`avis-badge avis-${establishment.avis?.toLowerCase()}`}>{establishment.avis}</span>
              </div>
            </div>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">{establishment.totalPrescriptions}</span>
                <span className="stat-label">Prescriptions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{establishment.totalObservations}</span>
                <span className="stat-label">Observations</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{establishment.nombreVisites || 0}</span>
                <span className="stat-label">Visites/an</span>
              </div>
            </div>
          </div>
        </div>

        <div className="details-tabs">
          <button
            className={`tab-button ${activeTab === "actions" ? "active" : ""}`}
            onClick={() => setActiveTab("actions")}
          >
            Actions à réaliser
          </button>
          <button
            className={`tab-button ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            Contacts
          </button>
          <button
            className={`tab-button ${activeTab === "verifications" ? "active" : ""}`}
            onClick={() => setActiveTab("verifications")}
          >
            Vérifications Périodiques
          </button>
          <button
            className={`tab-button ${activeTab === "prescriptions" ? "active" : ""}`}
            onClick={() => setActiveTab("prescriptions")}
          >
            Prescriptions Commission de Sécurité
          </button>
          <button
            className={`tab-button ${activeTab === "observations" ? "active" : ""}`}
            onClick={() => setActiveTab("observations")}
          >
            Observation PRÉVERIS
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "actions" && (
            <div className="actions-tab">
              <div className="tab-header">
                <h3>Actions à réaliser</h3>
                <button
                  className="add-button"
                  onClick={() => {
                    setShowActionForm(true)
                    setEditingItem(null)
                  }}
                >
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
              {establishment.actions && establishment.actions.length > 0 ? (
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
                    {establishment.actions.map((action) => (
                      <tr key={action.id}>
                        <td>
                          <span className={`status-badge status-${action.statut.toLowerCase().replace(/\s+/g, "-")}`}>
                            {getStatusIcon(action.statut)}
                            {action.statut}
                          </span>
                        </td>
                        <td>{action.description}</td>
                        <td>{new Date(action.echeance).toLocaleDateString()}</td>
                        <td>{action.responsable}</td>
                        <td>
                          <span className={`priority-badge priority-${action.priorite.toLowerCase()}`}>
                            {action.priorite}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="table-action-button" onClick={() => handleEditAction(action)}>
                            <Edit size={14} />
                          </button>
                          <button className="table-action-button" onClick={() => handleDeleteAction(action.id)}>
                            <Trash2 size={14} />
                          </button>
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
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="contacts-tab">
              <div className="tab-header">
                <h3>Contacts</h3>
                <button
                  className="add-button"
                  onClick={() => {
                    setShowContactForm(true)
                    setEditingItem(null)
                  }}
                >
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
              {establishment.contacts && establishment.contacts.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Fonction</th>
                      <th>Téléphone</th>
                      <th>Email</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {establishment.contacts.map((contact) => (
                      <tr key={contact.id}>
                        <td>{contact.nom}</td>
                        <td>{contact.fonction}</td>
                        <td>{contact.telephone}</td>
                        <td>{contact.email}</td>
                        <td>{contact.notes}</td>
                        <td className="actions-cell">
                          <button className="table-action-button" onClick={() => handleEditContact(contact)}>
                            <Edit size={14} />
                          </button>
                          <button className="table-action-button" onClick={() => handleDeleteContact(contact.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>Aucun contact enregistré</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "verifications" && (
            <div className="verifications-tab">
              <div className="tab-header">
                <h3>Vérifications Périodiques</h3>
                <button
                  className="add-button"
                  onClick={() => {
                    setShowVerificationForm(true)
                    setEditingItem(null)
                  }}
                >
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
              {establishment.verifications && establishment.verifications.length > 0 ? (
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
                    {establishment.verifications.map((verification) => (
                      <tr key={verification.id}>
                        <td>{verification.installation}</td>
                        <td>{verification.societe}</td>
                        <td>{new Date(verification.date).toLocaleDateString()}</td>
                        <td>
                          {verification.rapport ? (
                            <a href="#" className="rapport-link">
                              {verification.rapport}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{verification.enAnalyse}</td>
                        <td className="actions-cell">
                          <button className="table-action-button" onClick={() => handleEditVerification(verification)}>
                            <Edit size={14} />
                          </button>
                          <button
                            className="table-action-button"
                            onClick={() => handleDeleteVerification(verification.id)}
                          >
                            <Trash2 size={14} />
                          </button>
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
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="prescriptions-tab">
              <div className="tab-header">
                <h3>Prescriptions Commission de Sécurité</h3>
                <button
                  className="add-button"
                  onClick={() => {
                    setShowPrescriptionForm(true)
                    setEditingItem(null)
                  }}
                >
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
              {establishment.prescriptions && establishment.prescriptions.length > 0 ? (
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
                    {establishment.prescriptions.map((prescription) => (
                      <tr key={prescription.id}>
                        <td>
                          <span
                            className={`status-badge status-${prescription.statut.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {getStatusIcon(prescription.statut)}
                            {prescription.statut}
                          </span>
                        </td>
                        <td>{prescription.description}</td>
                        <td>
                          {prescription.dateRealisation
                            ? new Date(prescription.dateRealisation).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="actions-cell">
                          <button className="table-action-button" onClick={() => handleEditPrescription(prescription)}>
                            <Edit size={14} />
                          </button>
                          <button
                            className="table-action-button"
                            onClick={() => handleDeletePrescription(prescription.id)}
                          >
                            <Trash2 size={14} />
                          </button>
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
            </div>
          )}

          {activeTab === "observations" && (
            <div className="observations-tab">
              <div className="tab-header">
                <h3>Observation PRÉVERIS</h3>
                <button
                  className="add-button"
                  onClick={() => {
                    setShowObservationForm(true)
                    setEditingItem(null)
                  }}
                >
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
              {establishment.observations && establishment.observations.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Observations des Visites</th>
                      <th>Date d'observation</th>
                      <th>Date de réalisation</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {establishment.observations.map((observation) => (
                      <tr key={observation.id}>
                        <td>
                          <span
                            className={`status-badge status-${observation.statut.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {getStatusIcon(observation.statut)}
                            {observation.statut}
                          </span>
                        </td>
                        <td>{observation.description}</td>
                        <td>{new Date(observation.dateObservation).toLocaleDateString()}</td>
                        <td>
                          {observation.dateRealisation
                            ? new Date(observation.dateRealisation).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="actions-cell">
                          <button className="table-action-button" onClick={() => handleEditObservation(observation)}>
                            <Edit size={14} />
                          </button>
                          <button
                            className="table-action-button"
                            onClick={() => handleDeleteObservation(observation.id)}
                          >
                            <Trash2 size={14} />
                          </button>
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
            </div>
          )}
        </div>

        {establishment.pointSituation && (
          <div className="situation-notes">
            <h3>Point de Situation - Pense-Bête</h3>
            <div className="notes-content" dangerouslySetInnerHTML={renderHtmlContent(establishment.pointSituation)} />
          </div>
        )}
      </div>

      {showEditModal && (
        <Modal title="Modifier l'établissement" onClose={() => setShowEditModal(false)}>
          <DynamicForm initialData={establishment} onSubmit={handleUpdate} />
        </Modal>
      )}

      {showContactForm && (
        <Modal
          title={editingItem ? "Modifier le contact" : "Ajouter un contact"}
          onClose={() => {
            setShowContactForm(false)
            setEditingItem(null)
          }}
        >
          <ContactForm initialData={editingItem} onSubmit={editingItem ? handleUpdateContact : handleAddContact} />
        </Modal>
      )}

      {showActionForm && (
        <Modal
          title={editingItem ? "Modifier l'action" : "Ajouter une action"}
          onClose={() => {
            setShowActionForm(false)
            setEditingItem(null)
          }}
        >
          <ActionForm
            initialData={editingItem}
            onSubmit={editingItem ? handleUpdateAction : handleAddAction}
            contacts={establishment.contacts}
          />
        </Modal>
      )}

      {showVerificationForm && (
        <Modal
          title={editingItem ? "Modifier la vérification" : "Ajouter une vérification"}
          onClose={() => {
            setShowVerificationForm(false)
            setEditingItem(null)
          }}
        >
          <VerificationForm
            initialData={editingItem}
            onSubmit={editingItem ? handleUpdateVerification : handleAddVerification}
          />
        </Modal>
      )}

      {showPrescriptionForm && (
        <Modal
          title={editingItem ? "Modifier la prescription" : "Ajouter une prescription"}
          onClose={() => {
            setShowPrescriptionForm(false)
            setEditingItem(null)
          }}
        >
          <PrescriptionForm
            initialData={editingItem}
            onSubmit={editingItem ? handleUpdatePrescription : handleAddPrescription}
          />
        </Modal>
      )}

      {showObservationForm && (
        <Modal
          title={editingItem ? "Modifier l'observation" : "Ajouter une observation"}
          onClose={() => {
            setShowObservationForm(false)
            setEditingItem(null)
          }}
        >
          <ObservationForm
            initialData={editingItem}
            onSubmit={editingItem ? handleUpdateObservation : handleAddObservation}
          />
        </Modal>
      )}
    </div>
  )
}

export default EstablishmentDetails
