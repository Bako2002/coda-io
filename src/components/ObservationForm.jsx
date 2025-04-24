"use client"

import { useState } from "react"
import "./FormStyles.css"

const ObservationForm = ({ initialData = null, onSubmit }) => {
  const defaultFormData = {
    statut: "À faire",
    description: "",
    dateObservation: new Date().toISOString().split("T")[0],
    dateRealisation: null,
    type: "Observation Générale",
    localisation: "",
    priorite: "Normale",
    responsable: "",
    photos: [],
    actions: [],
  }

  const [formData, setFormData] = useState(initialData || defaultFormData)
  const [errors, setErrors] = useState({})

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise"
    }

    if (!formData.dateObservation) {
      newErrors.dateObservation = "La date d'observation est requise"
    }

    if (formData.statut === "Réalisé" && !formData.dateRealisation) {
      newErrors.dateRealisation = "La date de réalisation est requise pour une observation réalisée"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="form-container">
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="statut">Statut</label>
          <select id="statut" value={formData.statut} onChange={(e) => handleChange("statut", e.target.value)} required>
            <option value="À faire">À faire</option>
            <option value="En cours">En cours</option>
            <option value="Réalisé">Réalisé</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="description">
            Description de l'observation <span className="required">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
            rows={4}
            className={errors.description ? "input-error" : ""}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
      </div>

      <div className="form-row two-columns">
        <div className="form-field">
          <label htmlFor="type">Type d'observation</label>
          <select id="type" value={formData.type} onChange={(e) => handleChange("type", e.target.value)}>
            <option value="Observation Générale">Observation Générale</option>
            <option value="Sécurité Incendie">Sécurité Incendie</option>
            <option value="Accessibilité">Accessibilité</option>
            <option value="Technique">Technique</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="localisation">Localisation</label>
          <input
            id="localisation"
            type="text"
            value={formData.localisation}
            onChange={(e) => handleChange("localisation", e.target.value)}
            placeholder="Ex: Hall d'entrée, Niveau -1, etc."
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="dateObservation">
            Date d'observation <span className="required">*</span>
          </label>
          <input
            id="dateObservation"
            type="date"
            value={formData.dateObservation}
            onChange={(e) => handleChange("dateObservation", e.target.value)}
            required
            className={errors.dateObservation ? "input-error" : ""}
          />
          {errors.dateObservation && <div className="error-message">{errors.dateObservation}</div>}
        </div>
      </div>

      <div className="form-row two-columns">
        <div className="form-field">
          <label htmlFor="priorite">Priorité</label>
          <select id="priorite" value={formData.priorite} onChange={(e) => handleChange("priorite", e.target.value)}>
            <option value="Basse">Basse</option>
            <option value="Normale">Normale</option>
            <option value="Haute">Haute</option>
            <option value="Critique">Critique</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="responsable">Responsable</label>
          <input
            id="responsable"
            type="text"
            value={formData.responsable}
            onChange={(e) => handleChange("responsable", e.target.value)}
          />
        </div>
      </div>

      {(formData.statut === "Réalisé" || formData.dateRealisation) && (
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="dateRealisation">
              Date de réalisation {formData.statut === "Réalisé" && <span className="required">*</span>}
            </label>
            <input
              id="dateRealisation"
              type="date"
              value={formData.dateRealisation || ""}
              onChange={(e) => handleChange("dateRealisation", e.target.value)}
              required={formData.statut === "Réalisé"}
              className={errors.dateRealisation ? "input-error" : ""}
            />
            {errors.dateRealisation && <div className="error-message">{errors.dateRealisation}</div>}
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-field">
          <label>Actions recommandées (sélection multiple)</label>
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

      <div className="form-actions">
        <button type="button" className="submit-button" onClick={handleSubmit}>
          {initialData ? "Mettre à jour" : "Ajouter"}
        </button>
      </div>
    </div>
  )
}

export default ObservationForm
