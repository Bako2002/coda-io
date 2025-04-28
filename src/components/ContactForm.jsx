"use client"

import { useState } from "react"
import "./FormStyles.css" //  Ensure you have this CSS file

const ContactForm = ({ initialData = null, onSubmit }) => {
    const defaultFormData = {
        civilite: "",
        fonction: "",
        societe: "",
        adressePostale: "",
        telephone1: "",
        email1: "",
        groupements: "",
        relationCommerciale: "",
        telephone2: "",
        email2: "",
        notes: "",
        etablissements: "",
        nom: "",
        prenom: "",
        roles: [],
        disponibilite: "",
        priorite: "Normale",
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

    const handleRoleChange = (role) => {
        const currentRoles = [...formData.roles]
        if (currentRoles.includes(role)) {
            handleChange(
                "roles",
                currentRoles.filter((r) => r !== role),
            )
        } else {
            handleChange("roles", [...currentRoles, role])
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nom.trim()) {
            newErrors.nom = "Le nom est requis"
        }

        if (formData.email1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email1)) {
            newErrors.email1 = "Format d'email 1 invalide"
        }

        if (formData.email2 && formData.email2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email2)) {
            newErrors.email2 = "Format d'email 2 invalide"
        }

        if (formData.telephone1 && !/^[0-9\s+()-]{10,15}$/.test(formData.telephone1.replace(/\s/g, ""))) {
            newErrors.telephone1 = "Format de téléphone 1 invalide"
        }

        if (formData.telephone2 && formData.telephone2 && !/^[0-9\s+()-]{10,15}$/.test(formData.telephone2.replace(/\s/g, ""))) {
            newErrors.telephone2 = "Format de téléphone 2 invalide"
        }

        if (!formData.civilite) {
            newErrors.civilite = "La civilité est requise"
        }
        if (!formData.societe) {
            newErrors.societe = "La société est requise"
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
            <div className="form-row two-columns">
                <div className="form-field">
                    <label htmlFor="civilite">Civilité <span className="required">*</span></label>
                    <select id="civilite" value={formData.civilite} onChange={(e) => handleChange("civilite", e.target.value)} className={errors.civilite ? "input-error" : ""}>
                        <option value="">Sélectionner</option>
                        <option value="M.">M.</option>
                        <option value="Mme.">Mme.</option>
                        <option value="Mlle.">Mlle.</option>
                    </select>
                    {errors.civilite && <div className="error-message">{errors.civilite}</div>}
                </div>
                <div className="form-field">
                    <label htmlFor="societe">Société <span className="required">*</span></label>
                    <input
                        type="text"
                        id="societe"
                        value={formData.societe}
                        onChange={(e) => handleChange("societe", e.target.value)}
                        className={errors.societe ? "input-error" : ""}
                    />
                    {errors.societe && <div className="error-message">{errors.societe}</div>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="adressePostale">Adresse Postale</label>
                    <input
                        type="text"
                        id="adressePostale"
                        value={formData.adressePostale}
                        onChange={(e) => handleChange("adressePostale", e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-field">
                <label htmlFor="telephone1">Téléphone 1</label>
                <input
                    type="tel"
                    id="telephone1"
                    value={formData.telephone1}
                    onChange={(e) => handleChange("telephone1", e.target.value)}
                    className={errors.telephone1 ? "input-error" : ""}
                />
                {errors.telephone1 && <div className="error-message">{errors.telephone1}</div>}
              </div>
              <div className="form-field">
                <label htmlFor="telephone2">Téléphone 2</label>
                <input
                    type="tel"
                    id="telephone2"
                    value={formData.telephone2}
                    onChange={(e) => handleChange("telephone2", e.target.value)}
                    className={errors.telephone2 ? "input-error" : ""}
                />
                {errors.telephone2 && <div className="error-message">{errors.telephone2}</div>}
              </div>
            </div>

            <div className="form-row two-columns">
                <div className="form-field">
                    <label htmlFor="email1">Email 1</label>
                    <input
                        type="email"
                        id="email1"
                        value={formData.email1}
                        onChange={(e) => handleChange("email1", e.target.value)}
                        className={errors.email1 ? "input-error" : ""}
                    />
                    {errors.email1 && <div className="error-message">{errors.email1}</div>}
                </div>
                <div className="form-field">
                    <label htmlFor="email2">Email 2</label>
                    <input
                        type="email"
                        id="email2"
                        value={formData.email2}
                        onChange={(e) => handleChange("email2", e.target.value)}
                        className={errors.email2 ? "input-error" : ""}
                    />
                    {errors.email2 && <div className="error-message">{errors.email2}</div>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="groupements">Groupements</label>
                    <input
                        type="text"
                        id="groupements"
                        value={formData.groupements}
                        onChange={(e) => handleChange("groupements", e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="relationCommerciale">Relation Commerciale</label>
                    <select id="relationCommerciale" value={formData.relationCommerciale} onChange={(e) => handleChange("relationCommerciale", e.target.value)}>
                        <option value="">Sélectionner</option>
                        <option value="Client">Client</option>
                        <option value="Prospect">Prospect</option>
                        <option value="Fournisseur">Fournisseur</option>

                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="etablissements">Etablissements</label>
                    <textarea
                        id="etablissements"
                        value={formData.etablissements}
                        onChange={(e) => handleChange("etablissements", e.target.value)}
                        rows={3}
                    />
                </div>
            </div>

            <div className="form-row two-columns">
                <div className="form-field">
                    <label htmlFor="nom">
                        Nom <span className="required">*</span>
                    </label>
                    <input
                        id="nom"
                        type="text"
                        value={formData.nom}
                        onChange={(e) => handleChange("nom", e.target.value)}
                        required
                        className={errors.nom ? "input-error" : ""}
                    />
                    {errors.nom && <div className="error-message">{errors.nom}</div>}
                </div>
                <div className="form-field">
                    <label htmlFor="prenom">Prénom</label>
                    <input
                        id="prenom"
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => handleChange("prenom", e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row two-columns">
                <div className="form-field">
                    <label htmlFor="fonction">Fonction</label>
                    <select id="fonction" value={formData.fonction} onChange={(e) => handleChange("fonction", e.target.value)}>
                        <option value="">Sélectionner</option>
                        <option value="Directeur">Directeur</option>
                        <option value="Responsable Sécurité">Responsable Sécurité</option>
                        <option value="Responsable Technique">Responsable Technique</option>
                        <option value="Responsable Maintenance">Responsable Maintenance</option>
                        <option value="Agent de Sécurité">Agent de Sécurité</option>
                        <option value="Administratif">Administratif</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="service">Service</label>
                    <select id="service" value={formData.service} onChange={(e) => handleChange("service", e.target.value)}>
                        <option value="">Sélectionner</option>
                        <option value="Direction">Direction</option>
                        <option value="Sécurité">Sécurité</option>
                        <option value="Technique">Technique</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Administration">Administration</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>
            </div>

            <div className="form-row two-columns">
                <div className="form-field">
                    <label htmlFor="telephone">Téléphone fixe</label>
                    <input
                        id="telephone"
                        type="tel"
                        value={formData.telephone1}
                        onChange={(e) => handleChange("telephone", e.target.value)}
                        className={errors.telephone ? "input-error" : ""}
                    />
                    {errors.telephone && <div className="error-message">{errors.telephone}</div>}
                </div>
                <div className="form-field">
                    <label htmlFor="telephoneMobile">Téléphone mobile</label>
                    <input
                        id="telephoneMobile"
                        type="tel"
                        value={formData.telephoneMobile}
                        onChange={(e) => handleChange("telephoneMobile", e.target.value)}
                        className={errors.telephoneMobile ? "input-error" : ""}
                    />
                    {errors.telephoneMobile && <div className="error-message">{errors.telephoneMobile}</div>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label>Rôles (sélection multiple)</label>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="role-commission"
                                checked={formData.roles.includes("Commission de Sécurité")}
                                onChange={() => handleRoleChange("Commission de Sécurité")}
                            />
                            <label htmlFor="role-commission">Commission de Sécurité</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="role-visites"
                                checked={formData.roles.includes("Visites PREVERIS")}
                                onChange={() => handleRoleChange("Visites PREVERIS")}
                            />
                            <label htmlFor="role-visites">Visites PREVERIS</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="role-verifications"
                                checked={formData.roles.includes("Vérifications Périodiques")}
                                onChange={() => handleRoleChange("Vérifications Périodiques")}
                            />
                            <label htmlFor="role-verifications">Vérifications Périodiques</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="role-urgence"
                                checked={formData.roles.includes("Contact d'Urgence")}
                                onChange={() => handleRoleChange("Contact d'Urgence")}
                            />
                            <label htmlFor="role-urgence">Contact d'Urgence</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-row two-columns">
                <div className="form-field">
                    <label htmlFor="disponibilite">Disponibilité</label>
                    <select
                        id="disponibilite"
                        value={formData.disponibilite}
                        onChange={(e) => handleChange("disponibilite", e.target.value)}
                    >
                        <option value="">Sélectionner</option>
                        <option value="Tous les jours">Tous les jours</option>
                        <option value="Jours ouvrés">Jours ouvrés</option>
                        <option value="Matin uniquement">Matin uniquement</option>
                        <option value="Après-midi uniquement">Après-midi uniquement</option>
                        <option value="Sur rendez-vous">Sur rendez-vous</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="priorite">Priorité de contact</label>
                    <select id="priorite" value={formData.priorite} onChange={(e) => handleChange("priorite", e.target.value)}>
                        <option value="Haute">Haute</option>
                        <option value="Normale">Normale</option>
                        <option value="Basse">Basse</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
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

export default ContactForm