"use client"

import { useState } from "react"
import "./FormStyles.css"

const ActionForm = ({ initialData = null, onSubmit, contacts = [] }) => {
  const defaultFormData = {
    statut: "À faire",
    tache: "",
    responsable: [],
    deadline: new Date().toISOString().split("T")[0],
  }

  const [formData, setFormData] = useState(initialData || defaultFormData)
  const [errors, setErrors] = useState({})

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

  const handleResponsableChange = (responsable) => {
    const currentResponsables = [...formData.responsable]
    if (currentResponsables.includes(responsable)) {
      handleChange(
        "responsable",
        currentResponsables.filter((r) => r !== responsable),
      )
    } else {
      handleChange("responsable", [...currentResponsables, responsable])
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.tache.trim()) {
      newErrors.tache = "La tâche est requise"
    }

    if (!formData.deadline) {
      newErrors.deadline = "La deadline est requise"
    }

    if (formData.responsable.length === 0) {
      newErrors.responsable = "Au moins un responsable doit être sélectionné"
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
            <option value="Fait">Fait</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="tache">
            Tâche <span className="required">*</span>
          </label>
          <textarea
            id="tache"
            value={formData.tache}
            onChange={(e) => handleChange("tache", e.target.value)}
            required
            rows={3}
            className={errors.tache ? "input-error" : ""}
          />
          {errors.tache && <div className="error-message">{errors.tache}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="responsable">Responsable(s) <span className="required">*</span></label>
          <select
            id="responsable"
            multiple
            value={formData.responsable}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value)
              handleChange("responsable", selectedOptions)
            }}
            required
          >
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.nom}>
                {contact.nom} {contact.prenom ? `- ${contact.prenom}` : ""}{" "}
                {contact.fonction ? `(${contact.fonction})` : ""}
              </option>
            ))}
          </select>
          {errors.responsable && <div className="error-message">{errors.responsable}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="deadline">
            Deadline <span className="required">*</span>
          </label>
          <input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
            required
            className={errors.deadline ? "input-error" : ""}
          />
          {errors.deadline && <div className="error-message">{errors.deadline}</div>}
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