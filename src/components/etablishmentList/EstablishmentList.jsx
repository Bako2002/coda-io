"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import "./EstablishmentList.css"

const EstablishmentList = ({ establishments, onViewEstablishment, onDeleteEstablishment, searchTerm = "" }) => {
  const [sortField, setSortField] = useState("nom")
  const [sortDirection, setSortDirection] = useState("asc")
  const [showDropdown, setShowDropdown] = useState(null)
  const [localSearchTerm, setLocalSearchTerm] = useState("")

  // Utiliser le terme de recherche externe s'il est fourni
  const effectiveSearchTerm = searchTerm || localSearchTerm

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const toggleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id)
  }

  // Utilisation de useMemo pour optimiser le filtrage et le tri
  const sortedEstablishments = useMemo(() => {
    return [...establishments]
      .filter((est) => {
        if (!effectiveSearchTerm) return true
        return (
          est.nom.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
          est.ville.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
          (est.groupements && est.groupements.toLowerCase().includes(effectiveSearchTerm.toLowerCase()))
        )
      })
      .sort((a, b) => {
        let comparison = 0
        if (a[sortField] > b[sortField]) {
          comparison = 1
        } else if (a[sortField] < b[sortField]) {
          comparison = -1
        }
        return sortDirection === "desc" ? comparison * -1 : comparison
      })
  }, [establishments, effectiveSearchTerm, sortField, sortDirection])

  return (
    <div className="establishment-list">
      <div className="list-header">
        <div className="search-filter">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un établissement..."
              value={searchTerm || localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="search-input"
              disabled={!!searchTerm} // Désactiver si un terme de recherche externe est fourni
            />
          </div>
          <button className="filter-button">
            <Filter size={16} />
            <span>Filtres</span>
          </button>
        </div>
        <div className="pagination-info">
          <span>
            {sortedEstablishments.length} sur {establishments.length}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="establishments-table">
          <thead>
            <tr>
              <th className="logo-column">Logo</th>
              <th className={`sortable ${sortField === "nom" ? "sorted" : ""}`} onClick={() => handleSort("nom")}>
                Nom
                {sortField === "nom" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th
                className={`sortable ${sortField === "groupements" ? "sorted" : ""}`}
                onClick={() => handleSort("groupements")}
              >
                Groupements
                {sortField === "groupements" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th className={`sortable ${sortField === "ville" ? "sorted" : ""}`} onClick={() => handleSort("ville")}>
                Ville
                {sortField === "ville" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th
                className={`sortable ${sortField === "categorie" ? "sorted" : ""}`}
                onClick={() => handleSort("categorie")}
              >
                Catégorie
                {sortField === "categorie" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th className={`sortable ${sortField === "type" ? "sorted" : ""}`} onClick={() => handleSort("type")}>
                Type(s)
                {sortField === "type" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th className={`sortable ${sortField === "avis" ? "sorted" : ""}`} onClick={() => handleSort("avis")}>
                Avis
                {sortField === "avis" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th
                className={`sortable ${sortField === "prochaineCommission" ? "sorted" : ""}`}
                onClick={() => handleSort("prochaineCommission")}
              >
                Prochaine Commission
                {sortField === "prochaineCommission" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th
                className={`sortable ${sortField === "totalPrescriptions" ? "sorted" : ""}`}
                onClick={() => handleSort("totalPrescriptions")}
              >
                Total Prescriptions
                {sortField === "totalPrescriptions" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th
                className={`sortable ${sortField === "totalObservations" ? "sorted" : ""}`}
                onClick={() => handleSort("totalObservations")}
              >
                Total Observations
                {sortField === "totalObservations" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEstablishments.length > 0 ? (
              sortedEstablishments.map((establishment) => (
                <tr key={establishment.id} onClick={() => onViewEstablishment(establishment)}>
                  <td className="logo-column">
                    <div className="establishment-logo">
                      <img
                        src={establishment.logoPreview || establishment.logo || "/placeholder.svg?height=40&width=40"}
                        alt={establishment.nom}
                      />
                    </div>
                  </td>
                  <td>{establishment.nom}</td>
                  <td>{establishment.groupements}</td>
                  <td>{establishment.ville}</td>
                  <td>
                    <span className={`category-badge category-${establishment.categorie?.charAt(0)}`}>
                      {establishment.categorie}
                    </span>
                  </td>
                  <td>{Array.isArray(establishment.types) ? establishment.types.join(", ") : establishment.type}</td>
                  <td>
                    <span className={`avis-badge avis-${establishment.avis?.toLowerCase()}`}>{establishment.avis}</span>
                  </td>
                  <td>{establishment.prochaineCommission}</td>
                  <td>{establishment.totalPrescriptions}</td>
                  <td>{establishment.totalObservations}</td>
                  <td className="actions-column" onClick={(e) => e.stopPropagation()}>
                    <div className="actions-dropdown">
                      <button className="action-button" onClick={() => toggleDropdown(establishment.id)}>
                        <MoreHorizontal size={16} />
                      </button>
                      {showDropdown === establishment.id && (
                        <div className="dropdown-menu">
                          <button onClick={() => onViewEstablishment(establishment)}>
                            <Eye size={16} />
                            <span>Voir</span>
                          </button>
                          <button onClick={() => onViewEstablishment(establishment)}>
                            <Edit size={16} />
                            <span>Modifier</span>
                          </button>
                          <button onClick={() => onDeleteEstablishment(establishment.id)}>
                            <Trash2 size={16} />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="empty-table">
                  <div className="empty-state">
                    <p>Aucun établissement trouvé</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EstablishmentList
