export const fmtTime = (d) => {
  const date = new Date(d)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const fmtConvTime = (d) => {
  if (!d) return ''
  const date = new Date(d)
  const now  = new Date()
  const diff = now - date
  if (diff < 86400000 && date.getDate() === now.getDate()) return fmtTime(d)
  if (diff < 172800000) return 'Yesterday'
  if (diff < 604800000) return date.toLocaleDateString([], { weekday: 'short' })
  return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export const fmtLastSeen = (d) => {
  if (!d) return ''
  const diff = Date.now() - new Date(d)
  if (diff < 60000)   return 'just now'
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`
  return `${Math.floor(diff/86400000)}d ago`
}

export const fmtDateSep = (d) => {
  const date = new Date(d)
  const now  = new Date()
  const diff = now - date
  if (date.getDate() === now.getDate() && diff < 86400000) return 'Today'
  if (diff < 172800000) return 'Yesterday'
  return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' })
}

export const needsDateSep = (curr, prev) => {
  if (!prev) return true
  const a = new Date(curr), b = new Date(prev)
  return a.getDate() !== b.getDate() || a.getMonth() !== b.getMonth()
}
