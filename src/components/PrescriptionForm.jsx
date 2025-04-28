"use client"

import { useState } from "react"
import "./FormStyles.css"

const SimplifiedPrescriptionForm = ({ initialData = null, onSubmit }) => {
    const defaultFormData = {
        statut: "À faire",
        description: "",
        conseilsPreveris: "",
        traitement: "",
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

    const validateForm = () => {
        const newErrors = {}

        if (!formData.description.trim()) {
            newErrors.description = "La description est requise"
        }

        if (!formData.conseilsPreveris.trim()) {
            newErrors.conseilsPreveris = "Les conseils de PREVERIS sont requis"
        }

        if (!formData.traitement.trim()) {
            newErrors.traitement = "Le traitement est requis"
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

            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="conseilsPreveris">
                        Conseils de PREVERIS <span className="required">*</span>
                    </label>
                    <textarea
                        id="conseilsPreveris"
                        value={formData.conseilsPreveris}
                        onChange={(e) => handleChange("conseilsPreveris", e.target.value)}
                        required
                        rows={4}
                        className={errors.conseilsPreveris ? "input-error" : ""}
                    />
                    {errors.conseilsPreveris && <div className="error-message">{errors.conseilsPreveris}</div>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="traitement">
                        Traitement <span className="required">*</span>
                    </label>
                    <textarea
                        id="traitement"
                        value={formData.traitement}
                        onChange={(e) => handleChange("traitement", e.target.value)}
                        required
                        rows={4}
                        className={errors.traitement ? "input-error" : ""}
                    />
                    {errors.traitement && <div className="error-message">{errors.traitement}</div>}
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

export default SimplifiedPrescriptionForm