"use client"

import { useRef, useState } from "react"
import "./FormStyles.css" //  Ensure you have this CSS file
import { ImageIcon } from "lucide-react"

const ObservationForm = ({ initialData = null, onSubmit }) => {

  const fileInputRef = useRef(null)
  const defaultFormData = {
    typeObservation: "Nouvelle",
    observations: "",
    photos: [],
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

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    const newPhotos = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        newPhotos.push(event.target.result) //  Store the base64 encoded string
        if (newPhotos.length === files.length) {
          handleChange("photos", newPhotos)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.observations.trim()) {
      newErrors.observations = "Les observations sont requises"
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
          <label htmlFor="typeObservation">Type d'observation</label>
          <select
            id="typeObservation"
            value={formData.typeObservation}
            onChange={(e) => handleChange("typeObservation", e.target.value)}
          >
            <option value="Nouvelle">Nouvelle</option>
            <option value="Ancienne">Ancienne</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="observations">
            Observations <span className="required">*</span>
          </label>
          <textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => handleChange("observations", e.target.value)}
            rows={4}
            className={errors.observations ? "input-error" : ""}
          />
          {errors.observations && <div className="error-message">{errors.observations}</div>}
        </div>
      </div>
      <div className="form-image-upload">
        <div className="image-upload">
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <button type="button" className="image-upload-button" onClick={() => fileInputRef.current.click()}>
            <ImageIcon size={16} />
            <span>Ajouter une image</span>
          </button>
          {formData.photos ? (
            formData.photos.map((photo, index) => (
              <img  key={index} src={photo} alt={`Photo ${index + 1}`}/>
            ))
          ) : (
            <div className="image-placeholder">
              <ImageIcon size={48} />
            </div>
          )}
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