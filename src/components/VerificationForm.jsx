"use client"

import { useState, useRef, useEffect } from "react"
import "./FormStyles.css"

const VerificationForm = ({ initialData = null, onSubmit, responsables }) => {
  const defaultFormData = {
    installation: "",
    societe: "",
    date: new Date().toISOString().split("T")[0],
    rapport: null, // Store the File object
    responsableAnalyse: "",
    periodiciteJours: "",
    dateProchaineVerification: "",
  }

  const [formData, setFormData] = useState(initialData || defaultFormData)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (formData.date && formData.periodiciteJours) {
      calculateNextVerificationDate()
    }
  }, [formData.date, formData.periodiciteJours]) // Recalculate when date or period changes

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    handleChange("rapport", file) // Store the File object directly
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

    if (!formData.periodiciteJours) {
      newErrors.periodiciteJours = "La périodicité est requise"
    }

    if (!formData.dateProchaineVerification) {
      newErrors.dateProchaineVerification = "La date de prochaine vérification est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateNextVerificationDate = () => {
    if (formData.date && formData.periodiciteJours) {
      const dateVerif = new Date(formData.date)
      const periodiciteDays = Number.parseInt(formData.periodiciteJours, 10)

      if (!isNaN(periodiciteDays)) {
        const nextDate = new Date(dateVerif.getTime() + periodiciteDays * 24 * 60 * 60 * 1000)
        handleChange("dateProchaineVerification", nextDate.toISOString().split("T")[0])
      }
    }
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
          <label htmlFor="periodiciteJours">
            Périodicité (jours) <span className="required">*</span>
          </label>
          <input
            id="periodiciteJours"
            type="number"
            value={formData.periodiciteJours}
            onChange={(e) => handleChange("periodiciteJours", e.target.value)}
            required
            className={errors.periodiciteJours ? "input-error" : ""}
          />
          {errors.periodiciteJours && <div className="error-message">{errors.periodiciteJours}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="dateProchaineVerification">
            Date prochaine vérification <span className="required">*</span>
          </label>
          <input
            id="dateProchaineVerification"
            type="date"
            value={formData.dateProchaineVerification}
            onChange={(e) => handleChange("dateProchaineVerification", e.target.value)}
            readOnly // Make it read-only as it's calculated
            required
            className={errors.dateProchaineVerification ? "input-error" : ""}
          />
          {errors.dateProchaineVerification && (
            <div className="error-message">{errors.dateProchaineVerification}</div>
          )}
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
              accept=".pdf,.doc,.docx" //  Restrict to common document types
            />
            <div className="file-input-display">
              <input
                type="text"
                value={formData.rapport ? formData.rapport.name : ""}
                placeholder="Sélectionner un fichier"
                readOnly
              />
              <button type="button" className="file-select-button" onClick={() => fileInputRef.current.click()}>
                Parcourir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="responsableAnalyse">En Analyse (Responsable)</label>
          <select
            id="responsableAnalyse"
            value={formData.responsableAnalyse}
            onChange={(e) => handleChange("responsableAnalyse", e.target.value)}
          >
            <option value="">Sélectionner un responsable</option>
            {responsables &&
              responsables.map((responsable) => (
                <option key={responsable} value={responsable}>
                  {responsable}
                </option>
              ))}
          </select>
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