"use client"

import { useEffect, useRef, useCallback } from "react"
import { X } from "lucide-react"

const Modal = ({ title, children, onClose }) => {
  const modalRef = useRef(null)

  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose],
  )

  const handleClickOutside = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)

    // Disable body scroll
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)

      // Re-enable body scroll
      document.body.style.overflow = "auto"
    }
  }, [handleEscape, handleClickOutside])

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}

export default Modal
