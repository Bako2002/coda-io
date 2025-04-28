"use client"

import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { Plus, Bold, Italic, Underline, ImageIcon, Calendar, Trash2, Edit } from "lucide-react"
import "./DynamicForm.css"
import ContactForm from "../ContactForm"
import ActionForm from "../ActionForm"
import VerificationForm from "../VerificationForm"
import PrescriptionForm from "../PrescriptionForm"
import ObservationForm from "../ObservationForm"
import Modal from "../modal/Modal"
import MultiSelect from "../../../components/ui/multipleSelect/multipleSelect"

const DynamicForm = ({ onSubmit, initialData = null }) => {
  const defaultFormData = {
    nom: "",
    adresse: "",
    codePostal: "",
    ville: "",
    email: "",
    telephone: "",
    groupements: "",
    categorie: "",
    types: [],
    avis: "Favorable",
    ge5Affiche: "",
    sogsTransport: "",
    dateDerniereCommission: "",
    prochaineCommission: "",
    periodiciteCommissions: "",
    derniereCommissionGroupement: "",
    prochaineCommissionGroupement: "",
    periodiciteCommissionsAn: "",
    totalPrescriptions: "0",
    totalObservations: "0",
    nombreVisites: "0",
    pointSituation: "",
    logo: null,
    logoPreview: null,
  }

  const [formData, setFormData] = useState(initialData || defaultFormData)
  const [activeTab, setActiveTab] = useState("general")

  // États pour les données supplémentaires
  const [contacts, setContacts] = useState(initialData?.contacts || [])
  const [actions, setActions] = useState(initialData?.actions || [])
  const [verifications, setVerifications] = useState(initialData?.verifications || [])
  const [prescriptions, setPrescriptions] = useState(initialData?.prescriptions || [])
  const [observations, setObservations] = useState(initialData?.observations || [])

  // États pour les modals
  const [showContactForm, setShowContactForm] = useState(false)
  const [showActionForm, setShowActionForm] = useState(false)
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [showObservationForm, setShowObservationForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fileInputRef = useRef(null)

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => {
      let newFormData = { ...prev, [field]: value };
  
      if (field === "groupements") {
        const data = groupementsData[value] || {};
  
        newFormData = {
          ...newFormData,
          derniereCommissionGroupement: data.derniereCommissionGroupement || "",
          prochaineCommissionGroupement: data.prochaineCommissionGroupement || "",
          periodiciteCommissionsAn: data.periodiciteCommissionsAn || "",
        };
      }
  
      return newFormData;
    });
  }, [])

  const groupementsData = {
    "Shopping Parc 2": {
      derniereCommissionGroupement: "2024-03-01",
      prochaineCommissionGroupement: "2025-03-01",
      periodiciteCommissionsAn: "1",
    },
    "Groupe Commercial France": {
      derniereCommissionGroupement: "2023-09-15",
      prochaineCommissionGroupement: "2025-09-15",
      periodiciteCommissionsAn: "2",
    },
    "Groupe Habitat Sud": {
      derniereCommissionGroupement: "2022-12-10",
      prochaineCommissionGroupement: "2025-12-10",
      periodiciteCommissionsAn: "3",
    },
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          logo: file,
          logoPreview: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const applyTextFormat = useCallback(
    (field, format) => {
      const textarea = document.getElementById(`field-${field}`)
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = formData[field].substring(start, end)

      if (start === end) return // No text selected

      let formattedText = ""
      switch (format) {
        case "bold":
          formattedText = `<strong>${selectedText}</strong>`
          break
        case "italic":
          formattedText = `<em>${selectedText}</em>`
          break
        case "underline":
          formattedText = `<u>${selectedText}</u>`
          break
        default:
          return
      }

      const newValue = formData[field].substring(0, start) + formattedText + formData[field].substring(end)
      handleChange(field, newValue)
    },
    [formData, handleChange],
  )

  // Gestion des contacts
  const handleAddContact = useCallback((contact) => {
    setContacts((prev) => {
      const newContact = {
        ...contact,
        id: prev.length > 0 ? Math.max(...prev.map((c) => c.id)) + 1 : 1,
      }
      return [...prev, newContact]
    })
    setShowContactForm(false)
    setEditingItem(null)
  }, [])

  const handleUpdateContact = useCallback((updatedContact) => {
    setContacts((prev) => prev.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)))
    setShowContactForm(false)
    setEditingItem(null)
  }, [])

  const handleDeleteContact = useCallback((id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      setContacts((prev) => prev.filter((contact) => contact.id !== id))
    }
  }, [])

  const handleEditContact = useCallback((contact) => {
    setEditingItem(contact)
    setShowContactForm(true)
  }, [])

  // Gestion des actions
  const handleAddAction = useCallback((action) => {
    setActions((prev) => {
      const newAction = {
        ...action,
        id: prev.length > 0 ? Math.max(...prev.map((a) => a.id)) + 1 : 1,
      }
      return [...prev, newAction]
    })
    setShowActionForm(false)
    setEditingItem(null)
  }, [])

  const handleUpdateAction = useCallback((updatedAction) => {
    setActions((prev) => prev.map((action) => (action.id === updatedAction.id ? updatedAction : action)))
    setShowActionForm(false)
    setEditingItem(null)
  }, [])

  const handleDeleteAction = useCallback((id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette action ?")) {
      setActions((prev) => prev.filter((action) => action.id !== id))
    }
  }, [])

  const handleEditAction = useCallback((action) => {
    setEditingItem(action)
    setShowActionForm(true)
  }, [])

  // Gestion des vérifications
  const handleAddVerification = useCallback((verification) => {
    setVerifications((prev) => {
      const newVerification = {
        ...verification,
        id: prev.length > 0 ? Math.max(...prev.map((v) => v.id)) + 1 : 1,
      }
      return [...prev, newVerification]
    })
    setShowVerificationForm(false)
    setEditingItem(null)
  }, [])

  const handleUpdateVerification = useCallback((updatedVerification) => {
    setVerifications((prev) =>
      prev.map((verification) => (verification.id === updatedVerification.id ? updatedVerification : verification)),
    )
    setShowVerificationForm(false)
    setEditingItem(null)
  }, [])

  const handleDeleteVerification = useCallback((id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vérification ?")) {
      setVerifications((prev) => prev.filter((verification) => verification.id !== id))
    }
  }, [])

  const handleEditVerification = useCallback((verification) => {
    setEditingItem(verification)
    setShowVerificationForm(true)
  }, [])

  // Gestion des prescriptions
  const handleAddPrescription = useCallback((prescription) => {
    setPrescriptions((prev) => {
      const newPrescription = {
        ...prescription,
        id: prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1,
      }
      return [...prev, newPrescription]
    })
    setFormData((prev) => ({
      ...prev,
      totalPrescriptions: (Number.parseInt(prev.totalPrescriptions) + 1).toString(),
    }))
    setShowPrescriptionForm(false)
    setEditingItem(null)
  }, [])

  const handleUpdatePrescription = useCallback((updatedPrescription) => {
    setPrescriptions((prev) =>
      prev.map((prescription) => (prescription.id === updatedPrescription.id ? updatedPrescription : prescription)),
    )
    setShowPrescriptionForm(false)
    setEditingItem(null)
  }, [])

  const handleDeletePrescription = useCallback((id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette prescription ?")) {
      setPrescriptions((prev) => prev.filter((prescription) => prescription.id !== id))
      setFormData((prev) => ({
        ...prev,
        totalPrescriptions: Math.max(0, Number.parseInt(prev.totalPrescriptions) - 1).toString(),
      }))
    }
  }, [])

  const handleEditPrescription = useCallback((prescription) => {
    setEditingItem(prescription)
    setShowPrescriptionForm(true)
  }, [])

  // Gestion des observations
  const handleAddObservation = useCallback((observation) => {
    setObservations((prev) => {
      const newObservation = {
        ...observation,
        id: prev.length > 0 ? Math.max(...prev.map((o) => o.id)) + 1 : 1,
      }
      return [...prev, newObservation]
    })
    setFormData((prev) => ({
      ...prev,
      totalObservations: (Number.parseInt(prev.totalObservations) + 1).toString(),
    }))
    setShowObservationForm(false)
    setEditingItem(null)
  }, [])

  const handleUpdateObservation = useCallback((updatedObservation) => {
    setObservations((prev) =>
      prev.map((observation) => (observation.id === updatedObservation.id ? updatedObservation : observation)),
    )
    setShowObservationForm(false)
    setEditingItem(null)
  }, [])

  const handleDeleteObservation = useCallback((id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette observation ?")) {
      setObservations((prev) => prev.filter((observation) => observation.id !== id))
      setFormData((prev) => ({
        ...prev,
        totalObservations: Math.max(0, Number.parseInt(prev.totalObservations) - 1).toString(),
      }))
    }
  }, [])

  const handleEditObservation = useCallback((observation) => {
    setEditingItem(observation)
    setShowObservationForm(true)
  }, [])

  const getStatusIcon = useCallback((status) => {
    switch (status.toLowerCase()) {
      case "réalisé":
        return <span className="status-icon status-done">✓</span>
      case "en cours":
        return <span className="status-icon status-progress">⟳</span>
      case "à faire":
        return <span className="status-icon status-todo">⚠</span>
      default:
        return null
    }
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      console.log("Form submitted with data:", contacts)
      // Combine all data
      const completeFormData = {
        ...formData,
        contacts,
        actions,
        verifications,
        prescriptions,
        observations,
      }

      onSubmit(completeFormData)
    },
    [formData, contacts, actions, verifications, prescriptions, observations, onSubmit],
  )

  // Mémoriser les données des onglets pour éviter des re-rendus inutiles
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "contacts":
        return (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Contacts</h3>
              <button
                type="button"
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
            {contacts && contacts.length > 0 ? (
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
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.nom}</td>
                      <td>{contact.fonction}</td>
                      <td>{contact.telephone}</td>
                      <td>{contact.email}</td>
                      <td>{contact.notes}</td>
                      <td className="actions-cell">
                        <button
                          type="button"
                          className="table-action-button"
                          onClick={() => handleEditContact(contact)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          className="table-action-button"
                          onClick={() => handleDeleteContact(contact.id)}
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
                <p>Aucun contact enregistré</p>
              </div>
            )}
          </div>
        )
      case "actions":
        return (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Actions à réaliser</h3>
              <button
                type="button"
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
            {actions && actions.length > 0 ? (
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
                        <button type="button" className="table-action-button" onClick={() => handleEditAction(action)}>
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          className="table-action-button"
                          onClick={() => handleDeleteAction(action.id)}
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
                <p>Aucune action à réaliser</p>
              </div>
            )}
          </div>
        )
      
      case "verifications":
        return (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Vérifications Périodiques</h3>
              <button
                type="button"
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
            {verifications && verifications.length > 0 ? (
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
        )
      case "prescriptions":
        return (
          <div className="tab-content">
            <div className="tab-header">
                <h3>Prescriptions Commission de Sécurité</h3>
                <button
                  type="button"
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
              {prescriptions && prescriptions.length > 0 ? (
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
        )
      case "observations":
        return (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Observation PRÉVERIS</h3>
              <button
                type="button"
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
            {observations && observations.length > 0 ? (
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
                  {observations.map((observation) => (
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
        )
      // Autres onglets similaires...
      default:
        return null
    }
  }, [
    activeTab,
    contacts,
    actions,
    handleEditContact,
    handleDeleteContact,
    getStatusIcon,
    handleEditAction,
    handleDeleteAction,
  ])
  
  useEffect(() => {
    if (formData.dateDerniereCommission && formData.periodiciteCommissions) {
      const date = new Date(formData.dateDerniereCommission);
      date.setFullYear(date.getFullYear() + parseInt(formData.periodiciteCommissions));
      handleChange("prochaineCommission", date.toISOString().split("T")[0]); // format 'YYYY-MM-DD'
    }
  }, [formData.dateDerniereCommission, formData.periodiciteCommissions]);

  return (
    <>
      <form className="dynamic-form" onSubmit={handleSubmit}>
        <div className="form-tabs">
          <button
            type="button"
            className={`tab-button ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            Informations générales
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            Contacts
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === "actions" ? "active" : ""}`}
            onClick={() => setActiveTab("actions")}
          >
            Actions à réaliser
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === "verifications" ? "active" : ""}`}
            onClick={() => setActiveTab("verifications")}
          >
            Vérifications périodiques
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === "prescriptions" ? "active" : ""}`}
            onClick={() => setActiveTab("prescriptions")}
          >
            Prescriptions
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === "observations" ? "active" : ""}`}
            onClick={() => setActiveTab("observations")}
          >
            Observations
          </button>
        </div>

        {/* Contenu des onglets... */}
        {activeTab === "general" && (
          <div className="form-grid">
            {/* Contenu de l'onglet général... */}
            <div className="form-image-upload">
              <div className="image-upload">
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <button type="button" className="image-upload-button" onClick={() => fileInputRef.current.click()}>
                  <ImageIcon size={16} />
                  <span>Ajouter une image</span>
                </button>
                {formData.logoPreview ? (
                  <div className="image-preview">
                    <img src={formData.logoPreview || "/placeholder.svg"} alt="Logo" />
                  </div>
                ) : (
                  <div className="image-placeholder">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
            </div>

            <div className="form-fields">
              <h3>Nom</h3>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="field-nom">Nom</label>
                  <input
                    id="field-nom"
                    type="text"
                    value={formData.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="field-adresse">Adresse</label>
                  <input
                    id="field-adresse"
                    type="text"
                    value={formData.adresse}
                    onChange={(e) => handleChange("adresse", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row two-columns">
                <div className="form-field">
                  <label htmlFor="field-codePostal">Code Postal</label>
                  <input
                    id="field-codePostal"
                    type="text"
                    value={formData.codePostal}
                    onChange={(e) => handleChange("codePostal", e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="field-ville">Ville</label>
                  <input
                    id="field-ville"
                    type="text"
                    value={formData.ville}
                    onChange={(e) => handleChange("ville", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="field-groupements">Groupements</label>
                  <select
                    id="field-groupements"
                    value={formData.groupements}
                    onChange={(e) => handleChange("groupements", e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Shopping Parc 2">Shopping Parc 2</option>
                    <option value="Groupe Commercial France">Groupe Commercial France</option>
                    <option value="Groupe Habitat Sud">Groupe Habitat Sud</option>
                  </select>
                </div>
              </div>

              <div className="form-row two-columns">
                <div className="form-field">
                  <label htmlFor="field-email">Email</label>
                  <input
                    id="field-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="field-telephone">Téléphone</label>
                  <input
                    id="field-telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleChange("telephone", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row two-columns">
                <MultiSelect
                  label="Type(s)"
                  options={["ERP", "IGH", "ERT", "Habitation"]}
                  value={formData.types}
                  onChange={(val) => handleChange("types", val)}
                />

                <div className="form-field">
                  <label htmlFor="field-categorie">Catégorie</label>
                  <select
                    id="field-categorie"
                    value={formData.categorie}
                    onChange={(e) => handleChange("categorie", e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="1ère">1ère</option>
                    <option value="2ème">2ème</option>
                    <option value="3ème">3ème</option>
                    <option value="4ème">4ème</option>
                    <option value="5ème">5ème</option>
                  </select>
                </div>
              </div>

              <div className="form-row two-columns">
                <div className="form-field">
                  <label htmlFor="field-avis">Avis</label>
                  <select id="field-avis" value={formData.avis} onChange={(e) => handleChange("avis", e.target.value)}>
                    <option value="Favorable">Favorable</option>
                    <option value="Défavorable">Défavorable</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="field-ge5Affiche">GE 5 Affiché</label>
                  <select
                    id="field-ge5Affiche"
                    value={formData.ge5Affiche}
                    onChange={(e) => handleChange("ge5Affiche", e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </div>
              </div>

              <div className="form-row two-columns">
                <div className="form-field">
                  <label htmlFor="field-sogsTransport">SOGS Transport</label>
                  <select
                    id="field-sogsTransport"
                    value={formData.sogsTransport}
                    onChange={(e) => handleChange("sogsTransport", e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="field-nombreVisites">Nombre de visites (par an)</label>
                  <input
                    id="field-nombreVisites"
                    type="number"
                    min="0"
                    value={formData.nombreVisites}
                    onChange={(e) => handleChange("nombreVisites", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row two-columns">
                <div className="form-field">
                  <label htmlFor="field-dateDerniereCommission">Date dernière commission Établissement</label>
                  <div className="date-input-container">
                    <input
                      id="field-dateDerniereCommission"
                      type="date"
                      value={formData.dateDerniereCommission}
                      onChange={(e) => handleChange("dateDerniereCommission", e.target.value)}
                    />
                    <Calendar size={16} className="date-icon" />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="field-prochaineCommission">Prochaine Commission</label>
                  <div className="date-input-container">
                    <input
                      id="field-prochaineCommission"
                      type="date"
                      value={formData.prochaineCommission}
                      onChange={(e) => handleChange("prochaineCommission", e.target.value)}
                      disabled={true}
                    />
                    <Calendar size={16} className="date-icon" />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="field-periodiciteCommissions">Périodicité des commissions (an)</label>
                  <div className="date-input-container">
                    <input
                      id="field-periodiciteCommissions"
                      type="number"
                      value={formData.periodiciteCommissions}
                      onChange={(e) => handleChange("periodiciteCommissions", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row two-columns">
                <div className="form-field">
                  <label htmlFor="field-derniereCommissionGroupement">Dernière Commission Groupement</label>
                  <div className="date-input-container">
                    <input
                      id="field-derniereCommissionGroupement"
                      type="date"
                      value={formData.derniereCommissionGroupement}
                      onChange={(e) => handleChange("derniereCommissionGroupement", e.target.value)}
                      disabled={true}
                    />
                    <Calendar size={16} className="date-icon" />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="field-prochaineCommissionGroupement">Prochaine Commission Groupement</label>
                  <div className="date-input-container">
                    <input
                      id="field-prochaineCommissionGroupement"
                      type="date"
                      value={formData.prochaineCommissionGroupement}
                      onChange={(e) => handleChange("prochaineCommissionGroupement", e.target.value)}
                      disabled={true}
                    />
                    <Calendar size={16} className="date-icon" />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="field-periodiciteCommissionsAn">Périodicité des Commissions (an)</label>
                  <div className="date-input-container">
                    <input
                      id="field-periodiciteCommissionsAn"
                      type="number"
                      value={formData.periodiciteCommissionsAn}
                      onChange={(e) => handleChange("periodiciteCommissionsAn", e.target.value)}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="field-pointSituation">Point de Situation - Pense-Bête</label>
                  <div className="textarea-container">
                    <div className="text-formatting">
                      <button type="button" onClick={() => applyTextFormat("pointSituation", "bold")}>
                        <Bold size={16} />
                      </button>
                      <button type="button" onClick={() => applyTextFormat("pointSituation", "italic")}>
                        <Italic size={16} />
                      </button>
                      <button type="button" onClick={() => applyTextFormat("pointSituation", "underline")}>
                        <Underline size={16} />
                      </button>
                    </div>
                    <textarea
                      id="field-pointSituation"
                      value={formData.pointSituation}
                      onChange={(e) => handleChange("pointSituation", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "general" && tabContent}

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Enregistrer
          </button>
        </div>
      </form>

      {/* Déplacer les modals en dehors du formulaire principal */}
      {showContactForm && (
        <Modal
          title={editingItem ? "Modifier le contact" : "Ajouter un contact"}
          onClose={() => {
            setShowContactForm(false)
            setEditingItem(null)
          }}
        >
          <div className="form-wrapper">
            <ContactForm initialData={editingItem} onSubmit={editingItem ? handleUpdateContact : handleAddContact} />
          </div>
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
              contacts={contacts}
            />
          </div>
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
          <div className="form-wrapper">
            <VerificationForm
              initialData={editingItem}
              onSubmit={editingItem ? handleUpdateVerification : handleAddVerification}
            />
          </div>
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
          <div className="form-wrapper">
            <PrescriptionForm
              initialData={editingItem}
              onSubmit={editingItem ? handleUpdatePrescription : handleAddPrescription}
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
    </>
  )
}

export default DynamicForm
