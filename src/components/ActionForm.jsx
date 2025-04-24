"use client"

import { useState } from "react"
import "./FormStyles.css"

const ActionForm = ({ initialData = null, onSubmit, contacts = [] }) => {
  const defaultFormData = {
    statut: "À faire",
    description: "",
    echeance: new Date().toISOString().split("T")[0],
    responsable: "",
    responsableAutre: "",
    priorite: "Moyenne",
    type: "",
    categorie: [],
    documents: [],
    suivi: "",
    dateCreation: new Date().toISOString().split("T")[0],
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

  const handleCategorieChange = (categorie) => {
    const currentCategories = [...formData.categorie]
    if (currentCategories.includes(categorie)) {
      handleChange(
        "categorie",
        currentCategories.filter((c) => c !== categorie),
      )
    } else {
      handleChange("categorie", [...currentCategories, categorie])
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

    if (!formData.echeance) {
      newErrors.echeance = "La date d'échéance est requise"
    }

    if (formData.responsable === "Autre" && !formData.responsableAutre.trim()) {
      newErrors.responsableAutre = "Le nom du responsable est requis"
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
            <option value="Reporté">Reporté</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
            rows={3}
            className={errors.description ? "input-error" : ""}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="type">Type d'action</label>
          <select id="type" value={formData.type} onChange={(e) => handleChange("type", e.target.value)}>
            <option value="">Sélectionner</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Sécurité">Sécurité</option>
            <option value="Conformité">Conformité</option>
            <option value="Amélioration">Amélioration</option>
            <option value="Administratif">Administratif</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Catégories (sélection multiple)</label>
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="categorie-commission"
                checked={formData.categorie.includes("Commission de Sécurité")}
                onChange={() => handleCategorieChange("Commission de Sécurité")}
              />
              <label htmlFor="categorie-commission">Commission de Sécurité</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="categorie-verification"
                checked={formData.categorie.includes("Vérification Périodique")}
                onChange={() => handleCategorieChange("Vérification Périodique")}
              />
              <label htmlFor="categorie-verification">Vérification Périodique</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="categorie-observation"
                checked={formData.categorie.includes("Observation PREVERIS")}
                onChange={() => handleCategorieChange("Observation PREVERIS")}
              />
              <label htmlFor="categorie-observation">Observation PREVERIS</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="categorie-prescription"
                checked={formData.categorie.includes("Prescription")}
                onChange={() => handleCategorieChange("Prescription")}
              />
              <label htmlFor="categorie-prescription">Prescription</label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-row two-columns">
        <div className="form-field">
          <label htmlFor="echeance">
            Échéance <span className="required">*</span>
          </label>
          <input
            id="echeance"
            type="date"
            value={formData.echeance}
            onChange={(e) => handleChange("echeance", e.target.value)}
            required
            className={errors.echeance ? "input-error" : ""}
          />
          {errors.echeance && <div className="error-message">{errors.echeance}</div>}
        </div>
        <div className="form-field">
          <label htmlFor="priorite">Priorité</label>
          <select
            id="priorite"
            value={formData.priorite}
            onChange={(e) => handleChange("priorite", e.target.value)}
            required
          >
            <option value="Basse">Basse</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Haute">Haute</option>
            <option value="Critique">Critique</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="responsable">Responsable</label>
          <select
            id="responsable"
            value={formData.responsable}
            onChange={(e) => handleChange("responsable", e.target.value)}
          >
            <option value="">Sélectionner un responsable</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.nom}>
                {contact.nom} {contact.prenom ? `- ${contact.prenom}` : ""}{" "}
                {contact.fonction ? `(${contact.fonction})` : ""}
              </option>
            ))}
            <option value="Autre">Autre</option>
          </select>
          {formData.responsable === "Autre" && (
            <input
              type="text"
              placeholder="Nom du responsable"
              className={`mt-2 ${errors.responsableAutre ? "input-error" : ""}`}
              value={formData.responsableAutre || ""}
              onChange={(e) => handleChange("responsableAutre", e.target.value)}
            />
          )}
          {errors.responsableAutre && <div className="error-message">{errors.responsableAutre}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Documents associés (sélection multiple)</label>
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="doc-rapport"
                checked={formData.documents.includes("Rapport de vérification")}
                onChange={() => handleDocumentChange("Rapport de vérification")}
              />
              <label htmlFor="doc-rapport">Rapport de vérification</label>
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
                id="doc-plan"
                checked={formData.documents.includes("Plan d'action")}
                onChange={() => handleDocumentChange("Plan d'action")}
              />
              <label htmlFor="doc-plan">Plan d'action</label>
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
          <label htmlFor="suivi">Suivi / Commentaires</label>
          <textarea
            id="suivi"
            value={formData.suivi}
            onChange={(e) => handleChange("suivi", e.target.value)}
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

export default ActionForm
