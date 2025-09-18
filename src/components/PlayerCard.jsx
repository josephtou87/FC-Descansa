import React from 'react'

export default function PlayerCard({ player }) {
  return (
    <div className="flex items-center gap-3 p-2 border rounded">
      <img src={player.photoURL || 'https://via.placeholder.com/48'} className="w-12 h-12 rounded-full" alt={player.fullName} />
      <div>
        <div className="font-semibold">{player.fullName}</div>
        <div className="text-sm text-gray-600">#{player.number || '-'} {player.nickname ? `• ${player.nickname}` : ''}</div>
      </div>
    </div>
  )
}
