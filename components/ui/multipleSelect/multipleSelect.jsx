import "./multipleSelect.css"

import { useState, useEffect } from "react"

export default function MultiSelect({ label, options = [], value = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  const isAllSelected = options.length > 0 && value.length === options.length

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([])
    } else {
      onChange([...options])
    }
  }

  const handleClickOutside = (e) => {
    if (!e.target.closest(".custom-select-wrapper")) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="form-field">
      {label && <label>{label}</label>}

      <div
        className="custom-select-wrapper"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="custom-select-display">
          {value.map((val) => (
            <span key={val} className="tag" onClick={(e) => e.stopPropagation()}>
              {val}
              <button onClick={(e) => {
                e.stopPropagation()
                onChange(value.filter((v) => v !== val))
              }}>
                &times;
              </button>
            </span>
          ))}
          <span className="caret">▾</span>
        </div>

        {isOpen && (
          <div className="custom-select-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-option select-all" onClick={handleSelectAll}>
              {isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
            </div>

            {options
              .filter((opt) => !value.includes(opt))
              .map((opt) => (
                <div
                  key={opt}
                  className="dropdown-option"
                  onClick={() => toggleOption(opt)}
                >
                  {opt}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}


