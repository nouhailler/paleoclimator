import React from 'react'

// Emplacement d'illustration. Remplace le composant <image-slot> du prototype
// (spécifique au proto). En prod : brancher de vraies illustrations.
// Permet de déposer/choisir une image locale pour prévisualiser une fiche.
export default class ImageSlot extends React.Component {
  state = { url: null }

  onFiles = (files) => {
    const f = files && files[0]
    if (!f || !f.type.startsWith('image/')) return
    const url = URL.createObjectURL(f)
    this.setState((s) => {
      if (s.url) URL.revokeObjectURL(s.url)
      return { url }
    })
  }

  onDrop = (e) => {
    e.preventDefault()
    this.setState({ over: false })
    this.onFiles(e.dataTransfer?.files)
  }

  componentWillUnmount() {
    if (this.state.url) URL.revokeObjectURL(this.state.url)
  }

  render() {
    const { color = '#5c7d8e', ph = 'Illustration', height = 130, radius = 12 } = this.props
    const { url, over } = this.state
    const stripe = `repeating-linear-gradient(135deg,${color}22,${color}22 10px,${color}12 10px,${color}12 20px)`
    return (
      <label
        onDragOver={(e) => { e.preventDefault(); if (!over) this.setState({ over: true }) }}
        onDragLeave={() => this.setState({ over: false })}
        onDrop={this.onDrop}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          height,
          borderRadius: radius,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          background: url ? '#000' : stripe,
          border: '1px solid ' + (over ? color : '#dbe7ec'),
          padding: url ? 0 : 10,
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => this.onFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        {url ? (
          <img src={url} alt={ph} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div
            style={{
              fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 9.5,
              color: '#5c7d8e',
              background: 'rgba(255,255,255,0.75)',
              padding: '4px 7px',
              borderRadius: 5,
            }}
          >
            {ph}
          </div>
        )}
      </label>
    )
  }
}
