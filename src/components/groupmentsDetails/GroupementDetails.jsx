"use client"

import { useState, useCallback } from "react"
import { ArrowLeft, Edit, Trash2, Plus, Check, Clock, AlertTriangle, Building } from "lucide-react"
import Modal from "../modal/Modal"
import GroupementForm from "../GroupementForm"
import ActionForm from "../ActionForm"
import ObservationForm from "../ObservationForm"
import "./GroupementDetails.css"

const GroupementDetails = ({ groupement, onBack, onUpdate, onDelete, onViewEstablishment }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [activeTab, setActiveTab] = useState("etablissements")
  const [showActionForm, setShowActionForm] = useState(false)
  const [showObservationForm, setShowObservationForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handleUpdate = useCallback(
    (updatedData) => {
      onUpdate({
        ...groupement,
        ...updatedData,
        derniereMaj: new Date().toISOString().split("T")[0],
      })
      setShowEditModal(false)
    },
    [groupement, onUpdate],
  )

  const handleDelete = useCallback(() => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce groupement ?")) {
      onDelete(groupement.id)
    }
  }, [groupement.id, onDelete])

  const renderHtmlContent = useCallback((content) => {
    return { __html: content }
  }, [])

  // Gestion des actions
  const handleAddAction = useCallback(
    (action) => {
      const newAction = {
        ...action,
        id: groupement.actions.length > 0 ? Math.max(...groupement.actions.map((a) => a.id)) + 1 : 1,
      }
      const updatedGroupement = {
        ...groupement,
        actions: [...groupement.actions, newAction],
        totalActions: Number.parseInt(groupement.totalActions || 0) + 1,
        derniereMaj: new Date().toISOString().split("T")[0],
      }
      onUpdate(updatedGroupement)
      setShowActionForm(false)
      setEditingItem(null)
    },
    [groupement, onUpdate],
  )

  const handleUpdateAction = useCallback(
    (updatedAction) => {
      const updatedActions = groupement.actions.map((action) =>
        action.id === updatedAction.id ? updatedAction : action,
      )
      const updatedGroupement = {
        ...groupement,
        actions: updatedActions,
        derniereMaj: new Date().toISOString().split("T")[0],
      }
      onUpdate(updatedGroupement)
      setShowActionForm(false)
      setEditingItem(null)
    },
    [groupement, onUpdate],
  )

  const handleDeleteAction = useCallback(
    (id) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette action ?")) {
        const updatedGroupement = {
          ...groupement,
          actions: groupement.actions.filter((action) => action.id !== id),
          totalActions: Math.max(0, Number.parseInt(groupement.totalActions || 0) - 1),
          derniereMaj: new Date().toISOString().split("T")[0],
        }
        onUpdate(updatedGroupement)
      }
    },
    [groupement, onUpdate],
  )

  const handleEditAction = useCallback((action) => {
    setEditingItem(action)
    setShowActionForm(true)
  }, [])

  // Gestion des observations
  const handleAddObservation = useCallback(
    (observation) => {
      const newObservation = {
        ...observation,
        id: groupement.observations.length > 0 ? Math.max(...groupement.observations.map((o) => o.id)) + 1 : 1,
      }
      const updatedGroupement = {
        ...groupement,
        observations: [...groupement.observations, newObservation],
        totalObservations: Number.parseInt(groupement.totalObservations || 0) + 1,
        derniereMaj: new Date().toISOString().split("T")[0],
      }
      onUpdate(updatedGroupement)
      setShowObservationForm(false)
      setEditingItem(null)
    },
    [groupement, onUpdate],
  )

  const handleUpdateObservation = useCallback(
    (updatedObservation) => {
      const updatedObservations = groupement.observations.map((observation) =>
        observation.id === updatedObservation.id ? updatedObservation : observation,
      )
      const updatedGroupement = {
        ...groupement,
        observations: updatedObservations,
        derniereMaj: new Date().toISOString().split("T")[0],
      }
      onUpdate(updatedGroupement)
      setShowObservationForm(false)
      setEditingItem(null)
    },
    [groupement, onUpdate],
  )

  const handleDeleteObservation = useCallback(
    (id) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette observation ?")) {
        const updatedGroupement = {
          ...groupement,
          observations: groupement.observations.filter((observation) => observation.id !== id),
          totalObservations: Math.max(0, Number.parseInt(groupement.totalObservations || 0) - 1),
          derniereMaj: new Date().toISOString().split("T")[0],
        }
        onUpdate(updatedGroupement)
      }
    },
    [groupement, onUpdate],
  )

  const handleEditObservation = useCallback((observation) => {
    setEditingItem(observation)
    setShowObservationForm(true)
  }, [])

  const getStatusIcon = useCallback((status) => {
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
  }, [])

  return (
    <div className="groupement-details">
      <div className="details-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h2>{groupement.nom}</h2>
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
            <div className="groupement-logo">
              <img
                src={groupement.logoPreview || groupement.logo || "/placeholder.svg?height=80&width=80"}
                alt={groupement.nom}
              />
            </div>
            <div className="summary-info">
              <h3>{groupement.nom}</h3>
              <p>{groupement.adresse}</p>
              <p>
                {groupement.codePostal} {groupement.ville}
              </p>
              <p>
                <strong>Email:</strong> {groupement.email}
              </p>
              <p>
                <strong>Téléphone:</strong> {groupement.telephone}
              </p>
            </div>
          </div>
          <div className="summary-right">
            <div className="summary-badges">
              <div className="badge-item">
                <span className="badge-label">Type</span>
                <span className="type-badge">{groupement.type}</span>
              </div>
            </div>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">{groupement.nombreEtablissements || 0}</span>
                <span className="stat-label">Établissements</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{groupement.totalActions || 0}</span>
                <span className="stat-label">Actions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{groupement.totalObservations || 0}</span>
                <span className="stat-label">Observations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="details-tabs">
          <button
            className={`tab-button ${activeTab === "etablissements" ? "active" : ""}`}
            onClick={() => setActiveTab("etablissements")}
          >
            Établissements
          </button>
          <button
            className={`tab-button ${activeTab === "actions" ? "active" : ""}`}
            onClick={() => setActiveTab("actions")}
          >
            Actions à réaliser
          </button>
          <button
            className={`tab-button ${activeTab === "commissions" ? "active" : ""}`}
            onClick={() => setActiveTab("commissions")}
          >
            Commissions de Sécurité
          </button>
          <button
            className={`tab-button ${activeTab === "observations" ? "active" : ""}`}
            onClick={() => setActiveTab("observations")}
          >
            Observation PRÉVERIS
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "etablissements" && (
            <div className="etablissements-tab">
              <div className="tab-header">
                <h3>Établissements du groupement</h3>
              </div>
              {groupement.etablissements && groupement.etablissements.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Ville</th>
                      <th>Catégorie</th>
                      <th>Type(s)</th>
                      <th>Avis</th>
                      <th>Prochaine Commission</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupement.etablissements.map((etablissement) => (
                      <tr key={etablissement.id} onClick={() => onViewEstablishment(etablissement)}>
                        <td>{etablissement.nom}</td>
                        <td>{etablissement.ville}</td>
                        <td>
                          <span className={`category-badge category-${etablissement.categorie?.charAt(0)}`}>
                            {etablissement.categorie}
                          </span>
                        </td>
                        <td>
                          {Array.isArray(etablissement.types) ? etablissement.types.join(", ") : etablissement.type}
                        </td>
                        <td>
                          <span className={`avis-badge avis-${etablissement.avis?.toLowerCase()}`}>
                            {etablissement.avis}
                          </span>
                        </td>
                        <td>{etablissement.prochaineCommission}</td>
                        <td>
                          <button className="view-button" onClick={() => onViewEstablishment(etablissement)}>
                            <Building size={16} />
                            <span>Voir</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>Aucun établissement dans ce groupement</p>
                </div>
              )}
            </div>
          )}

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
              {groupement.actions && groupement.actions.length > 0 ? (
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
                    {groupement.actions.map((action) => (
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

          {activeTab === "commissions" && (
            <div className="commissions-tab">
              <div className="tab-header">
                <h3>Commissions de Sécurité</h3>
              </div>
              <div className="commission-info">
                <div className="commission-item">
                  <span className="commission-label">Dernière Commission</span>
                  <span className="commission-value">
                    {groupement.derniereCommission
                      ? new Date(groupement.derniereCommission).toLocaleDateString()
                      : "Non définie"}
                  </span>
                </div>
                <div className="commission-item">
                  <span className="commission-label">Prochaine Commission</span>
                  <span className="commission-value">
                    {groupement.prochaineCommission
                      ? new Date(groupement.prochaineCommission).toLocaleDateString()
                      : "Non définie"}
                  </span>
                </div>
                <div className="commission-item">
                  <span className="commission-label">Périodicité</span>
                  <span className="commission-value">{groupement.periodiciteCommissions || "Non définie"}</span>
                </div>
              </div>
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
              {groupement.observations && groupement.observations.length > 0 ? (
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
                    {groupement.observations.map((observation) => (
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

        {groupement.notes && (
          <div className="notes-section">
            <h3>Notes</h3>
            <div className="notes-content" dangerouslySetInnerHTML={renderHtmlContent(groupement.notes)} />
          </div>
        )}
      </div>

      {showEditModal && (
        <Modal title="Modifier le groupement" onClose={() => setShowEditModal(false)}>
          <GroupementForm initialData={groupement} onSubmit={handleUpdate} />
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
          <div className="form-wrapper">
            <ActionForm
              initialData={editingItem}
              onSubmit={editingItem ? handleUpdateAction : handleAddAction}
              contacts={groupement.contacts || []}
            />
          </div>
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
          <div className="form-wrapper">
            <ObservationForm
              initialData={editingItem}
              onSubmit={editingItem ? handleUpdateObservation : handleAddObservation}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default GroupementDetails
