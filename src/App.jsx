"use client"

import { useState, useEffect, useCallback } from "react"
import { PanelLeft, Plus, Search } from "lucide-react"
import Modal from "./components/modal/Modal"
import Sidebar from "./components/sidebar/Sidebar"
import DynamicForm from "./components/newEtablishment/DynamicForm"
import EstablishmentList from "./components/etablishmentList/EstablishmentList"
import EstablishmentDetails from "./components/etablishmentsDetails/EstablishmentDetails"
import GroupementList from "./components/groupmentlist/GroupementList"
import GroupementDetails from "./components/groupmentsDetails/GroupementDetails"
import GroupementForm from "./components/GroupementForm"
// Remplacer l'importation SCSS par un fichier CSS standard
import "./App.css"

// Données d'exemple pour les établissements
const initialEstablishments = [
  {
    id: 1,
    nom: "Solidarity Cottages",
    adresse: "123 Rue de la Solidarité",
    codePostal: "75001",
    ville: "Melun",
    email: "contact@solidarity-cottages.fr",
    telephone: "01 23 45 67 89",
    groupements: "Shopping Parc 2",
    categorie: "2ème",
    types: ["ERP"],
    avis: "Favorable",
    prochaineCommission: "January 2025",
    totalPrescriptions: 7,
    totalObservations: 3,
    logo: "/placeholder.svg?height=50&width=50",
    dateCreation: "2023-05-15",
    derniereMaj: "2024-04-01",
    contacts: [
      {
        id: 1,
        nom: "Martin Dupont",
        fonction: "Directeur",
        telephone: "06 12 34 56 78",
        email: "martin.dupont@solidarity-cottages.fr",
        notes: "Contact principal pour les visites de sécurité",
      },
      {
        id: 2,
        nom: "Sophie Lefebvre",
        fonction: "Responsable Sécurité",
        telephone: "06 23 45 67 89",
        email: "sophie.lefebvre@solidarity-cottages.fr",
        notes: "À contacter en priorité pour les questions techniques",
      },
    ],
    actions: [
      {
        id: 1,
        statut: "En cours",
        description: "Mise à jour du registre de sécurité",
        echeance: "2024-06-15",
        responsable: "Martin Dupont",
        priorite: "Haute",
      },
      {
        id: 2,
        statut: "À faire",
        description: "Vérification des issues de secours",
        echeance: "2024-07-01",
        responsable: "Sophie Lefebvre",
        priorite: "Moyenne",
      },
    ],
    verifications: [
      {
        id: 1,
        installation: "Système de désenfumage",
        societe: "AirSafe",
        date: "2024-02-15",
        rapport: "Rapport_Desenfumage_2024.pdf",
        enAnalyse: "Non",
      },
      {
        id: 2,
        installation: "Installations électriques",
        societe: "ElecControl",
        date: "2024-03-10",
        rapport: "Rapport_Electrique_2024.pdf",
        enAnalyse: "Oui",
      },
    ],
    prescriptions: [
      {
        id: 1,
        statut: "Réalisé",
        description: "Installer un système d'alarme incendie dans les zones communes",
        dateRealisation: "2024-01-20",
      },
      {
        id: 2,
        statut: "En cours",
        description: "Remplacer les portes coupe-feu défectueuses au niveau -1",
        dateRealisation: null,
      },
    ],
    observations: [
      {
        id: 1,
        statut: "Réalisé",
        description: "Signalétique d'évacuation à renforcer dans l'aile Est",
        dateObservation: "2024-02-05",
        dateRealisation: "2024-03-15",
      },
      {
        id: 2,
        statut: "À faire",
        description: "Dégagement des issues de secours à améliorer",
        dateObservation: "2024-03-20",
        dateRealisation: null,
      },
    ],
  },
  {
    id: 2,
    nom: "Centre Commercial Grand Place",
    adresse: "45 Avenue du Commerce",
    codePostal: "75002",
    ville: "Paris",
    email: "contact@grandplace.fr",
    telephone: "01 34 56 78 90",
    groupements: "Groupe Commercial France",
    categorie: "1ère",
    types: ["ERP"],
    avis: "Favorable",
    prochaineCommission: "March 2025",
    totalPrescriptions: 12,
    totalObservations: 5,
    logo: "/placeholder.svg?height=50&width=50",
    dateCreation: "2022-11-20",
    derniereMaj: "2024-03-15",
    contacts: [
      {
        id: 1,
        nom: "Jean Moreau",
        fonction: "Directeur Général",
        telephone: "06 34 56 78 90",
        email: "jean.moreau@grandplace.fr",
        notes: "Disponible uniquement les matins",
      },
    ],
    actions: [
      {
        id: 1,
        statut: "À faire",
        description: "Audit complet des systèmes de sécurité",
        echeance: "2024-08-15",
        responsable: "Jean Moreau",
        priorite: "Haute",
      },
    ],
    verifications: [],
    prescriptions: [
      {
        id: 1,
        statut: "À faire",
        description: "Mettre à jour le plan d'évacuation",
        dateRealisation: null,
      },
    ],
    observations: [],
  },
  {
    id: 3,
    nom: "Résidence Les Oliviers",
    adresse: "78 Rue des Oliviers",
    codePostal: "13008",
    ville: "Marseille",
    email: "contact@residence-oliviers.fr",
    telephone: "04 91 23 45 67",
    groupements: "Groupe Habitat Sud",
    categorie: "3ème",
    types: ["Habitation"],
    avis: "Défavorable",
    prochaineCommission: "June 2025",
    totalPrescriptions: 15,
    totalObservations: 8,
    logo: "/placeholder.svg?height=50&width=50",
    dateCreation: "2023-02-10",
    derniereMaj: "2024-02-28",
    contacts: [],
    actions: [],
    verifications: [],
    prescriptions: [],
    observations: [],
  },
]

// Données d'exemple pour les groupements
const initialGroupements = [
  {
    id: 1,
    nom: "Shopping Parc 2",
    adresse: "45 Avenue du Commerce",
    codePostal: "75002",
    ville: "Paris",
    email: "contact@shopping-parc2.fr",
    telephone: "01 34 56 78 90",
    type: "Commercial",
    derniereCommission: "2023-11-15",
    prochaineCommission: "2024-11-15",
    periodiciteCommissions: "12",
    nombreEtablissements: 5,
    totalActions: 8,
    totalObservations: 3,
    logo: "/placeholder.svg?height=50&width=50",
    dateCreation: "2022-05-10",
    derniereMaj: "2024-03-15",
    contacts: [
      {
        id: 1,
        nom: "Pierre Martin",
        fonction: "Directeur du groupement",
        telephone: "06 12 34 56 78",
        email: "pierre.martin@shopping-parc2.fr",
        notes: "Contact principal pour les commissions de sécurité",
      },
    ],
    actions: [
      {
        id: 1,
        statut: "En cours",
        description: "Mise à jour des procédures d'évacuation communes",
        echeance: "2024-07-15",
        responsable: "Pierre Martin",
        priorite: "Haute",
      },
    ],
    observations: [
      {
        id: 1,
        statut: "À faire",
        description: "Harmonisation de la signalétique de sécurité dans les parties communes",
        dateObservation: "2024-02-10",
        dateRealisation: null,
      },
    ],
    etablissements: [
      {
        id: 1,
        nom: "Solidarity Cottages",
        ville: "Melun",
        categorie: "2ème",
        types: ["ERP"],
        avis: "Favorable",
        prochaineCommission: "January 2025",
      },
      {
        id: 2,
        nom: "Centre Commercial Grand Place",
        ville: "Paris",
        categorie: "1ère",
        types: ["ERP"],
        avis: "Favorable",
        prochaineCommission: "March 2025",
      },
    ],
  },
  {
    id: 2,
    nom: "Groupe Commercial France",
    adresse: "12 Boulevard Haussmann",
    codePostal: "75009",
    ville: "Paris",
    email: "contact@gcf.fr",
    telephone: "01 45 67 89 10",
    type: "Commercial",
    derniereCommission: "2023-09-20",
    prochaineCommission: "2024-09-20",
    periodiciteCommissions: "12",
    nombreEtablissements: 8,
    totalActions: 12,
    totalObservations: 7,
    logo: "/placeholder.svg?height=50&width=50",
    dateCreation: "2021-03-15",
    derniereMaj: "2024-02-10",
    contacts: [],
    actions: [],
    observations: [],
    etablissements: [],
  },
  {
    id: 3,
    nom: "Groupe Habitat Sud",
    adresse: "23 Avenue de la Méditerranée",
    codePostal: "13008",
    ville: "Marseille",
    email: "contact@habitat-sud.fr",
    telephone: "04 91 23 45 67",
    type: "Résidentiel",
    derniereCommission: "2023-10-05",
    prochaineCommission: "2024-10-05",
    periodiciteCommissions: "12",
    nombreEtablissements: 12,
    totalActions: 15,
    totalObservations: 9,
    logo: "/placeholder.svg?height=50&width=50",
    dateCreation: "2020-06-22",
    derniereMaj: "2024-01-18",
    contacts: [],
    actions: [],
    observations: [],
    etablissements: [
      {
        id: 3,
        nom: "Résidence Les Oliviers",
        ville: "Marseille",
        categorie: "3ème",
        types: ["Habitation"],
        avis: "Défavorable",
        prochaineCommission: "June 2025",
      },
    ],
  },
]

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [establishments, setEstablishments] = useState(initialEstablishments)
  const [groupements, setGroupements] = useState(initialGroupements)
  const [selectedEstablishment, setSelectedEstablishment] = useState(null)
  const [selectedGroupement, setSelectedGroupement] = useState(null)
  const [view, setView] = useState("establishments") // "establishments", "establishment-details", "groupements", "groupement-details"
  const [searchQuery, setSearchQuery] = useState("")

  // Charger les données depuis le localStorage au démarrage
  useEffect(() => {
    const savedEstablishments = localStorage.getItem("establishments")
    if (savedEstablishments) {
      setEstablishments(JSON.parse(savedEstablishments))
    }

    const savedGroupements = localStorage.getItem("groupements")
    if (savedGroupements) {
      setGroupements(JSON.parse(savedGroupements))
    }
  }, [])

  // Sauvegarder les données dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("establishments", JSON.stringify(establishments))
  }, [establishments])

  useEffect(() => {
    localStorage.setItem("groupements", JSON.stringify(groupements))
  }, [groupements])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const handleAddEstablishment = useCallback((newEstablishment) => {
    setEstablishments((prevEstablishments) => {
      const establishmentWithId = {
        ...newEstablishment,
        id: prevEstablishments.length > 0 ? Math.max(...prevEstablishments.map((e) => e.id)) + 1 : 1,
        dateCreation: new Date().toISOString().split("T")[0],
        derniereMaj: new Date().toISOString().split("T")[0],
        contacts: [],
        actions: [],
        verifications: [],
        prescriptions: [],
        observations: [],
      }
      return [...prevEstablishments, establishmentWithId]
    })
    setShowModal(false)
  }, [])

  const handleAddGroupement = useCallback((newGroupement) => {
    setGroupements((prevGroupements) => {
      const groupementWithId = {
        ...newGroupement,
        id: prevGroupements.length > 0 ? Math.max(...prevGroupements.map((g) => g.id)) + 1 : 1,
        dateCreation: new Date().toISOString().split("T")[0],
        derniereMaj: new Date().toISOString().split("T")[0],
        contacts: [],
        actions: [],
        observations: [],
        etablissements: [],
      }
      return [...prevGroupements, groupementWithId]
    })
    setShowModal(false)
  }, [])

  const handleViewEstablishment = useCallback((establishment) => {
    setSelectedEstablishment(establishment)
    setView("establishment-details")
  }, [])

  const handleViewGroupement = useCallback((groupement) => {
    setSelectedGroupement(groupement)
    setView("groupement-details")
  }, [])

  const handleBackToList = useCallback(() => {
    if (view === "establishment-details") {
      setView("establishments")
      setSelectedEstablishment(null)
    } else if (view === "groupement-details") {
      setView("groupements")
      setSelectedGroupement(null)
    }
  }, [view])

  const handleUpdateEstablishment = useCallback((updatedEstablishment) => {
    setEstablishments((prevEstablishments) =>
      prevEstablishments.map((est) => (est.id === updatedEstablishment.id ? updatedEstablishment : est)),
    )
    setSelectedEstablishment(updatedEstablishment)
  }, [])

  const handleUpdateGroupement = useCallback((updatedGroupement) => {
    setGroupements((prevGroupements) =>
      prevGroupements.map((grp) => (grp.id === updatedGroupement.id ? updatedGroupement : grp)),
    )
    setSelectedGroupement(updatedGroupement)
  }, [])

  const handleDeleteEstablishment = useCallback((id) => {
    setEstablishments((prevEstablishments) => prevEstablishments.filter((est) => est.id !== id))
    setSelectedEstablishment((prev) => {
      if (prev && prev.id === id) {
        setView("establishments")
        return null
      }
      return prev
    })
  }, [])

  const handleDeleteGroupement = useCallback((id) => {
    setGroupements((prevGroupements) => prevGroupements.filter((grp) => grp.id !== id))
    setSelectedGroupement((prev) => {
      if (prev && prev.id === id) {
        setView("groupements")
        return null
      }
      return prev
    })
  }, [])

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleSwitchView = useCallback((newView) => {
    setView(newView)
    setSearchQuery("")
  }, [])

  return (
    <div className="app">
      <Sidebar collapsed={sidebarCollapsed} onSwitchView={handleSwitchView} activeView={view} />

      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <header className="header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <PanelLeft size={20} />
          </button>
          <h1>Dashboard PRÉVERIS</h1>
          <div className="header-actions">
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="user-profile">
              <div className="avatar">P</div>
            </div>
          </div>
        </header>

        <main className="content">
          {view === "establishments" && (
            <>
              <div className="page-header">
                <h2>Suivi Établissements</h2>
                <button className="primary-button" onClick={() => setShowModal("establishment")}>
                  <Plus size={16} /> Nouvel Établissement
                </button>
              </div>

              <EstablishmentList
                establishments={establishments}
                onViewEstablishment={handleViewEstablishment}
                onDeleteEstablishment={handleDeleteEstablishment}
                searchTerm={searchQuery}
              />
            </>
          )}

          {view === "groupements" && (
            <>
              <div className="page-header">
                <h2>Suivi Groupements</h2>
                <button className="primary-button" onClick={() => setShowModal("groupement")}>
                  <Plus size={16} /> Nouveau Groupement
                </button>
              </div>

              <GroupementList
                groupements={groupements}
                onViewGroupement={handleViewGroupement}
                onDeleteGroupement={handleDeleteGroupement}
                searchTerm={searchQuery}
              />
            </>
          )}

          {view === "establishment-details" && selectedEstablishment && (
            <EstablishmentDetails
              establishment={selectedEstablishment}
              onBack={handleBackToList}
              onUpdate={handleUpdateEstablishment}
              onDelete={handleDeleteEstablishment}
            />
          )}

          {view === "groupement-details" && selectedGroupement && (
            <GroupementDetails
              groupement={selectedGroupement}
              onBack={handleBackToList}
              onUpdate={handleUpdateGroupement}
              onDelete={handleDeleteGroupement}
              onViewEstablishment={handleViewEstablishment}
            />
          )}
        </main>
      </div>

      {showModal === "establishment" && (
        <Modal title="Nouvel Établissement" onClose={() => setShowModal(false)}>
          <DynamicForm onSubmit={handleAddEstablishment} />
        </Modal>
      )}

      {showModal === "groupement" && (
        <Modal title="Nouveau Groupement" onClose={() => setShowModal(false)}>
          <GroupementForm onSubmit={handleAddGroupement} />
        </Modal>
      )}
    </div>
  )
}

export default App
