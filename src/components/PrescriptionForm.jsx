"use client"

import { useState } from "react"
import "./FormStyles.css"

const PrescriptionForm = ({ initialData = null, onSubmit }) => {
  const defaultFormData = {
    statut: "À faire",
    description: "",
    dateRealisation: null,
    reference: "",
    origine: "Commission de Sécurité",
    dateCommission: "",
    priorite: "Normale",
    responsable: "",
    observations: "",
    documents: [],
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

  const handleDocumentChange = (document) => {
    const currentDocuments = [...formData.documents]
    if (currentDocuments.includes(document)) {
      handleChange(
        "documents",
        currentDocuments.filter((d) => d !== document),
      )
    } else {
      handleChange("documents", [...currentDocuments, document])
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise"
    }

    if (formData.statut === "Réalisé" && !formData.dateRealisation) {
      newErrors.dateRealisation = "La date de réalisation est requise pour une prescription réalisée"
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
            Description de la prescription <span className="required">*</span>
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
          <label htmlFor="reference">Référence</label>
          <input
            id="reference"
            type="text"
            value={formData.reference}
            onChange={(e) => handleChange("reference", e.target.value)}
            placeholder="Ex: Article MS 52"
          />
        </div>
        <div className="form-field">
          <label htmlFor="origine">Origine</label>
          <select id="origine" value={formData.origine} onChange={(e) => handleChange("origine", e.target.value)}>
            <option value="Commission de Sécurité">Commission de Sécurité</option>
            <option value="Visite Technique">Visite Technique</option>
            <option value="Rapport de Vérification">Rapport de Vérification</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>

      <div className="form-row two-columns">
        <div className="form-field">
          <label htmlFor="dateCommission">Date de la commission</label>
          <input
            id="dateCommission"
            type="date"
            value={formData.dateCommission}
            onChange={(e) => handleChange("dateCommission", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="priorite">Priorité</label>
          <select id="priorite" value={formData.priorite} onChange={(e) => handleChange("priorite", e.target.value)}>
            <option value="Basse">Basse</option>
            <option value="Normale">Normale</option>
            <option value="Haute">Haute</option>
            <option value="Critique">Critique</option>
          </select>
        </div>
      </div>

      <div className="form-row">
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
          <label>Documents associés (sélection multiple)</label>
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="doc-pv"
                checked={formData.documents.includes("PV Commission")}
                onChange={() => handleDocumentChange("PV Commission")}
              />
              <label htmlFor="doc-pv">PV Commission</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="doc-rapport"
                checked={formData.documents.includes("Rapport")}
                onChange={() => handleDocumentChange("Rapport")}
              />
              <label htmlFor="doc-rapport">Rapport</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="doc-devis"
                checked={formData.documents.includes("Devis")}
                onChange={() => handleDocumentChange("Devis")}
              />
              <label htmlFor="doc-devis">Devis</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="doc-photo"
                checked={formData.documents.includes("Photos")}
                onChange={() => handleDocumentChange("Photos")}
              />
              <label htmlFor="doc-photo">Photos</label>
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
            rows={2}
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

export default PrescriptionForm
