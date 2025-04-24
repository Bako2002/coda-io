"use client"

import { useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import Modal from "./Modal"
import ContactForm from "./ContactForm"

const TabContacts = ({ establishmentId, onUpdate }) => {
  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem(`contacts_${establishmentId}`)
    return savedContacts ? JSON.parse(savedContacts) : []
  })
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)

  const saveContacts = (updatedContacts) => {
    setContacts(updatedContacts)
    localStorage.setItem(`contacts_${establishmentId}`, JSON.stringify(updatedContacts))

    // Mettre à jour le nombre total de contacts dans l'établissement
    onUpdate({ totalContacts: updatedContacts.length })
  }

  const handleAddContact = (contactData) => {
    const newContact = {
      ...contactData,
      id: Date.now(),
      dateCreation: new Date().toISOString().split("T")[0],
    }

    const updatedContacts = [...contacts, newContact]
    saveContacts(updatedContacts)
    setShowModal(false)
  }

  const handleEditContact = (contact) => {
    setEditingContact(contact)
    setShowModal(true)
  }

  const handleUpdateContact = (updatedContactData) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === editingContact.id ? { ...contact, ...updatedContactData } : contact,
    )

    saveContacts(updatedContacts)
    setShowModal(false)
    setEditingContact(null)
  }

  const handleDeleteContact = (contactId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      const updatedContacts = contacts.filter((contact) => contact.id !== contactId)
      saveContacts(updatedContacts)
    }
  }

  return (
    <div className="contacts-tab">
      <div className="tab-header">
        <h3>Contacts</h3>
        <button
          className="add-button"
          onClick={() => {
            setEditingContact(null)
            setShowModal(true)
          }}
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      {contacts.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Fonction</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.nom}</td>
                <td>{contact.fonction}</td>
                <td>{contact.telephone}</td>
                <td>{contact.email}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-button" onClick={() => handleEditContact(contact)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-button delete" onClick={() => handleDeleteContact(contact.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>Aucun contact enregistré</p>
        </div>
      )}

      {showModal && (
        <Modal
          title={editingContact ? "Modifier le contact" : "Ajouter un contact"}
          onClose={() => {
            setShowModal(false)
            setEditingContact(null)
          }}
        >
          <ContactForm
            initialData={editingContact}
            onSubmit={editingContact ? handleUpdateContact : handleAddContact}
          />
        </Modal>
      )}
    </div>
  )
}

export default TabContacts
