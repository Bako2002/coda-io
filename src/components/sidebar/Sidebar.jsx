"use client"

import { useState, useCallback } from "react"
import { ChevronDown, ChevronRight, Home, FileText, Users, Calendar, Settings, Building } from "lucide-react"

const Sidebar = ({ collapsed, onSwitchView, activeView }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    "suivi-clients": true,
  })

  const toggleMenu = useCallback((menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }, [])

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">P</div>
          {!collapsed && <span className="logo-text">Doc PRÉVERIS</span>}
        </div>
      </div>

      <div className="sidebar-content">
        <ul className="menu">
          <li className="menu-item">
            <a href="#" className="menu-link">
              <Home size={collapsed ? 20 : 16} />
              {!collapsed && <span>Accueil</span>}
            </a>
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link">
              <FileText size={collapsed ? 20 : 16} />
              {!collapsed && <span>STAFF MEETING</span>}
            </a>
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link">
              <FileText size={collapsed ? 20 : 16} />
              {!collapsed && <span>TÂCHES PRÉVERIS</span>}
            </a>
          </li>

          <li className="menu-item">
            <div
              className={`menu-link ${expandedMenus["suivi-clients"] ? "active" : ""}`}
              onClick={() => toggleMenu("suivi-clients")}
            >
              <Users size={collapsed ? 20 : 16} />
              {!collapsed && (
                <>
                  <span>SUIVI CLIENTS</span>
                  {expandedMenus["suivi-clients"] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </>
              )}
            </div>

            {!collapsed && expandedMenus["suivi-clients"] && (
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
              <Calendar size={collapsed ? 20 : 16} />
              {!collapsed && <span>FORMATION</span>}
            </a>
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link">
              <Users size={collapsed ? 20 : 16} />
              {!collapsed && <span>RESSOURCES HUMAINES</span>}
            </a>
          </li>

          <li className="menu-item">
            <a href="#" className="menu-link">
              <Settings size={collapsed ? 20 : 16} />
              {!collapsed && <span>Améliorations CODA</span>}
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
