"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import "./GroupementList.css"

const GroupementList = ({ groupements, onViewGroupement, onDeleteGroupement, searchTerm = "" }) => {
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
  const sortedGroupements = useMemo(() => {
    return [...groupements]
      .filter((grp) => {
        if (!effectiveSearchTerm) return true
        return (
          grp.nom.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
          grp.ville?.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
          grp.type?.toLowerCase().includes(effectiveSearchTerm.toLowerCase())
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
  }, [groupements, effectiveSearchTerm, sortField, sortDirection])

  return (
    <div className="groupement-list">
      <div className="list-header">
        <div className="search-filter">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un groupement..."
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
            {sortedGroupements.length} sur {groupements.length}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="groupements-table">
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
              <th className={`sortable ${sortField === "type" ? "sorted" : ""}`} onClick={() => handleSort("type")}>
                Type
                {sortField === "type" && (
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
                className={`sortable ${sortField === "nombreEtablissements" ? "sorted" : ""}`}
                onClick={() => handleSort("nombreEtablissements")}
              >
                Établissements
                {sortField === "nombreEtablissements" && (
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
                className={`sortable ${sortField === "totalActions" ? "sorted" : ""}`}
                onClick={() => handleSort("totalActions")}
              >
                Actions
                {sortField === "totalActions" && (
                  <span className="sort-icon">
                    {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </th>
              <th
                className={`sortable ${sortField === "totalObservations" ? "sorted" : ""}`}
                onClick={() => handleSort("totalObservations")}
              >
                Observations
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
            {sortedGroupements.length > 0 ? (
              sortedGroupements.map((groupement) => (
                <tr key={groupement.id} onClick={() => onViewGroupement(groupement)}>
                  <td className="logo-column">
                    <div className="groupement-logo">
                      <img
                        src={groupement.logoPreview || groupement.logo || "/placeholder.svg?height=40&width=40"}
                        alt={groupement.nom}
                      />
                    </div>
                  </td>
                  <td>{groupement.nom}</td>
                  <td>{groupement.type}</td>
                  <td>{groupement.ville}</td>
                  <td>{groupement.nombreEtablissements}</td>
                  <td>{groupement.prochaineCommission}</td>
                  <td>{groupement.totalActions}</td>
                  <td>{groupement.totalObservations}</td>
                  <td className="actions-column" onClick={(e) => e.stopPropagation()}>
                    <div className="actions-dropdown">
                      <button className="action-button" onClick={() => toggleDropdown(groupement.id)}>
                        <MoreHorizontal size={16} />
                      </button>
                      {showDropdown === groupement.id && (
                        <div className="dropdown-menu">
                          <button onClick={() => onViewGroupement(groupement)}>
                            <Eye size={16} />
                            <span>Voir</span>
                          </button>
                          <button onClick={() => onViewGroupement(groupement)}>
                            <Edit size={16} />
                            <span>Modifier</span>
                          </button>
                          <button onClick={() => onDeleteGroupement(groupement.id)}>
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
                <td colSpan="9" className="empty-table">
                  <div className="empty-state">
                    <p>Aucun groupement trouvé</p>
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

export default GroupementList
