"use client"

import { useState, useRef } from "react"
import "./FormStyles.css"

const VerificationForm = ({ initialData = null, onSubmit }) => {
  const defaultFormData = {
    installation: "",
    typeInstallation: "",
    societe: "",
    date: new Date().toISOString().split("T")[0],
    dateProchaine: "",
    periodicite: "",
    rapport: "",
    enAnalyse: "Non",
    observations: "",
    statut: "Conforme",
    actions: [],
  }

  const [formData, setFormData] = useState(initialData || defaultFormData)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      })
    }
  }

  const handleActionChange = (action) => {
    const currentActions = [...formData.actions]
    if (currentActions.includes(action)) {
      handleChange(
        "actions",
        currentActions.filter((a) => a !== action),
      )
    } else {
      handleChange("actions", [...currentActions, action])
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleChange("rapport", file.name)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.installation.trim()) {
      newErrors.installation = "L'installation est requise"
    }

    if (!formData.societe.trim()) {
      newErrors.societe = "La société prestataire est requise"
    }

    if (!formData.date) {
      newErrors.date = "La date est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Calculer automatiquement la date de prochaine vérification si la périodicité est définie
      const updatedData = { ...formData }

      if (formData.periodicite && formData.date) {
        const dateVerif = new Date(formData.date)
        const periodiciteMonths = Number.parseInt(formData.periodicite)

        if (!isNaN(periodiciteMonths)) {
          dateVerif.setMonth(dateVerif.getMonth() + periodiciteMonths)
          updatedData.dateProchaine = dateVerif.toISOString().split("T")[0]
        }
      }

      onSubmit(updatedData)
    }
  }

  return (
    <div className="form-container">
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="installation">
            Installations Techniques <span className="required">*</span>
          </label>
          <input
            id="installation"
            type="text"
            value={formData.installation}
            onChange={(e) => handleChange("installation", e.target.value)}
            required
            className={errors.installation ? "input-error" : ""}
          />
          {errors.installation && <div className="error-message">{errors.installation}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="typeInstallation">Type d'installation</label>
          <select
            id="typeInstallation"
            value={formData.typeInstallation}
            onChange={(e) => handleChange("typeInstallation", e.target.value)}
          >
            <option value="">Sélectionner</option>
            <option value="Électrique">Électrique</option>
            <option value="Désenfumage">Désenfumage</option>
            <option value="Incendie">Incendie</option>
            <option value="Ascenseur">Ascenseur</option>
            <option value="Chauffage">Chauffage</option>
            <option value="Climatisation">Climatisation</option>
            <option value="Gaz">Gaz</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="societe">
            Société Prestataire <span className="required">*</span>
          </label>
          <input
            id="societe"
            type="text"
            value={formData.societe}
            onChange={(e) => handleChange("societe", e.target.value)}
            required
            className={errors.societe ? "input-error" : ""}
          />
          {errors.societe && <div className="error-message">{errors.societe}</div>}
        </div>
      </div>

      <div className="form-row two-columns">
        <div className="form-field">
          <label htmlFor="date">
            Date de vérification <span className="required">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
            className={errors.date ? "input-error" : ""}
          />
          {errors.date && <div className="error-message">{errors.date}</div>}
        </div>
        <div className="form-field">
          <label htmlFor="periodicite">Périodicité (mois)</label>
          <select
            id="periodicite"
            value={formData.periodicite}
            onChange={(e) => handleChange("periodicite", e.target.value)}
          >
            <option value="">Sélectionner</option>
            <option value="1">1 mois</option>
            <option value="3">3 mois</option>
            <option value="6">6 mois</option>
            <option value="12">12 mois</option>
            <option value="24">24 mois</option>
            <option value="36">36 mois</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="dateProchaine">Date prochaine vérification</label>
          <input
            id="dateProchaine"
            type="date"
            value={formData.dateProchaine}
            onChange={(e) => handleChange("dateProchaine", e.target.value)}
          />
          <div className="field-hint">Se calcule automatiquement selon la périodicité</div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="rapport">Rapport</label>
          <div className="file-input-container">
            <input
              type="file"
              id="rapport"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="file-input-display">
              <input type="text" value={formData.rapport} placeholder="Sélectionner un fichier" readOnly />
              <button type="button" className="file-select-button" onClick={() => fileInputRef.current.click()}>
                Parcourir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="form-row two-columns">
        <div className="form-field">
          <label htmlFor="statut">Statut</label>
          <select id="statut" value={formData.statut} onChange={(e) => handleChange("statut", e.target.value)}>
            <option value="Conforme">Conforme</option>
            <option value="Non-conforme">Non-conforme</option>
            <option value="Conforme avec réserves">Conforme avec réserves</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="enAnalyse">En Analyse</label>
          <select
            id="enAnalyse"
            value={formData.enAnalyse}
            onChange={(e) => handleChange("enAnalyse", e.target.value)}
            required
          >
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Actions requises (sélection multiple)</label>
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="action-correction"
                checked={formData.actions.includes("Correction immédiate")}
                onChange={() => handleActionChange("Correction immédiate")}
              />
              <label htmlFor="action-correction">Correction immédiate</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="action-planification"
                checked={formData.actions.includes("Planification travaux")}
                onChange={() => handleActionChange("Planification travaux")}
              />
              <label htmlFor="action-planification">Planification travaux</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="action-devis"
                checked={formData.actions.includes("Demande de devis")}
                onChange={() => handleActionChange("Demande de devis")}
              />
              <label htmlFor="action-devis">Demande de devis</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="action-suivi"
                checked={formData.actions.includes("Suivi PREVERIS")}
                onChange={() => handleActionChange("Suivi PREVERIS")}
              />
              <label htmlFor="action-suivi">Suivi PREVERIS</label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="observations">Observations</label>
          <textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => handleChange("observations", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="submit-button" onClick={handleSubmit}>
          {initialData ? "Mettre à jour" : "Ajouter"}
        </button>
      </div>
    </div>
  )
}

export default VerificationForm
