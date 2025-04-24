"use client"

import { useState, useRef, useCallback } from "react"
import { Bold, Italic, Underline, ImageIcon, Calendar } from "lucide-react"
import "./FormStyles.css"

const GroupementForm = ({ onSubmit, initialData = null }) => {
  const defaultFormData = {
    nom: "",
    adresse: "",
    codePostal: "",
    ville: "",
    email: "",
    telephone: "",
    type: "",
    derniereCommission: "",
    prochaineCommission: "",
    periodiciteCommissions: "",
    nombreEtablissements: "0",
    totalActions: "0",
    totalObservations: "0",
    notes: "",
    logo: null,
    logoPreview: null,
  }

  const [formData, setFormData] = useState(initialData || defaultFormData)
  const fileInputRef = useRef(null)

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

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

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      onSubmit(formData)
    },
    [formData, onSubmit],
  )

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      <div className="form-grid">
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
          <h3>Informations générales</h3>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="field-nom">Nom du groupement</label>
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

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="field-type">Type de groupement</label>
              <select id="field-type" value={formData.type} onChange={(e) => handleChange("type", e.target.value)}>
                <option value="">Sélectionner</option>
                <option value="Commercial">Commercial</option>
                <option value="Résidentiel">Résidentiel</option>
                <option value="Mixte">Mixte</option>
                <option value="Industriel">Industriel</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <h3>Commissions de sécurité</h3>
          <div className="form-row two-columns">
            <div className="form-field">
              <label htmlFor="field-derniereCommission">Dernière Commission</label>
              <div className="date-input-container">
                <input
                  id="field-derniereCommission"
                  type="date"
                  value={formData.derniereCommission}
                  onChange={(e) => handleChange("derniereCommission", e.target.value)}
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
                />
                <Calendar size={16} className="date-icon" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="field-periodiciteCommissions">Périodicité des commissions (mois)</label>
              <input
                id="field-periodiciteCommissions"
                type="number"
                min="0"
                value={formData.periodiciteCommissions}
                onChange={(e) => handleChange("periodiciteCommissions", e.target.value)}
              />
            </div>
          </div>

          <h3>Notes</h3>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="field-notes">Notes</label>
              <div className="textarea-container">
                <div className="text-formatting">
                  <button type="button" onClick={() => applyTextFormat("notes", "bold")}>
                    <Bold size={16} />
                  </button>
                  <button type="button" onClick={() => applyTextFormat("notes", "italic")}>
                    <Italic size={16} />
                  </button>
                  <button type="button" onClick={() => applyTextFormat("notes", "underline")}>
                    <Underline size={16} />
                  </button>
                </div>
                <textarea
                  id="field-notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {initialData ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </form>
  )
}

export default GroupementForm
