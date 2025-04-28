"use client"

import { useState, useCallback, useEffect } from "react"
import { ChevronDown, ChevronRight, Home, FileText, Users, Calendar, Settings, Building, PanelLeft } from "lucide-react"
import "./Sidebar.css" 


const Sidebar = ({ collapsed, onSwitchView, activeView , onCollapseChange}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(collapsed)
  const [expandedMenus, setExpandedMenus] = useState({
    "suivi-clients": true,
  })

  const toggleMenu = useCallback((menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }, [])
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(!collapsed)
      }
      else{
        setSidebarCollapsed(collapsed)
      }
    }

    // Lancer au chargement
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [collapsed])

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">P</div>
          {!sidebarCollapsed && <span className="logo-text">PRÉVERIS</span>}
        </div>
        <button className="sidebar-toggle" onClick={onCollapseChange}>
          <PanelLeft size={20} />
        </button>
      </div>

      <div className="sidebar-content">
        <ul className="menu">
          <li className="menu-item">
            <a href="#" className="menu-link">
              <Home size={sidebarCollapsed ? 20 : 16} />
              {!sidebarCollapsed && <span>Accueil</span>}
            </a>
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link">
              <FileText size={sidebarCollapsed ? 20 : 16} />
              {!sidebarCollapsed && <span>STAFF MEETING</span>}
            </a>
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link">
              <FileText size={sidebarCollapsed ? 20 : 16} />
              {!sidebarCollapsed && <span>TÂCHES PRÉVERIS</span>}
            </a>
          </li>

          <li className="menu-item">
            <div
              className={`menu-link ${expandedMenus["suivi-clients"] ? "active" : ""}`}
              onClick={() => toggleMenu("suivi-clients")}
            >
              <Users size={sidebarCollapsed ? 20 : 16} />
              {!sidebarCollapsed && (
                <>
                  <span>SUIVI CLIENTS</span>
                  {expandedMenus["suivi-clients"] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </>
              )}
            </div>

            {!sidebarCollapsed && expandedMenus["suivi-clients"] && (
              <ul className="submenu">
                <li className="submenu-item">
                  <a
                    href="#"
                    className={`submenu-link ${activeView === "groupements" || activeView === "groupement-details" ? "active" : ""}`}
                    onClick={() => onSwitchView("groupements")}
                  >
                    <Building size={14} className="submenu-icon" />
                    Suivi Groupements
                  </a>
                </li>
                <li className="submenu-item">
                  <a
                    href="#"
                    className={`submenu-link ${activeView === "establishments" || activeView === "establishment-details" ? "active" : ""}`}
                    onClick={() => onSwitchView("establishments")}
                  >
                    <Users size={14} className="submenu-icon" />
                    Suivi Établissements
                  </a>
                </li>
                <li className="submenu-item">
                  <a href="#" className="submenu-link">
                    Suivi Visites
                  </a>
                </li>
                <li className="submenu-item">
                  <a href="#" className="submenu-link">
                    Calendrier Mensuel
                  </a>
                </li>
                <li className="submenu-item">
                  <a href="#" className="submenu-link">
                    Commission de Sécurité
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link">
              <Calendar size={sidebarCollapsed ? 20 : 16} />
              {!sidebarCollapsed && <span>FORMATION</span>}
            </a>
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link">
              <Users size={sidebarCollapsed ? 20 : 16} />
              {!sidebarCollapsed && <span>RESSOURCES HUMAINES</span>}
            </a>
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link">
              <Settings size={sidebarCollapsed ? 20 : 16} />
              {!sidebarCollapsed && <span>Améliorations CODA</span>}
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
