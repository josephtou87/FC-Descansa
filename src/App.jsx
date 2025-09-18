import React, { useEffect, useState } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import Countdown from './components/Countdown'
import PlayerCard from './components/PlayerCard'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'

export default function App() {
  const [logoUrl] = useState('/logo-fc-descansda.png')
  const [nextMatch, setNextMatch] = useState({
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    stadium: 'Estadio La Siesta',
    opponent: 'Club Rival'
  })
  const [news] = useState([{ id:1, title:'Entreno intenso esta semana', date:'2025-09-10' }])
  const [results] = useState([{ id:1, opponent:'Azul FC', score:'2 - 1', date:'2025-09-01' }])

  const [currentUser, setCurrentUser] = useState(null)
  const [players, setPlayers] = useState([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) setCurrentUser(user)
      else setCurrentUser(null)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'players'), orderBy('number'))
    const unsub = onSnapshot(q, snap => {
      const arr = []
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }))
      setPlayers(arr)
    })
    return () => unsub()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logoUrl} alt="logo" className="w-16 h-16 rounded-md object-cover" />
          <div>
            <h1 className="text-2xl font-bold">FC DESCANSDA</h1>
            <p className="text-sm text-gray-600">Sitio oficial</p>
          </div>
        </div>
        <div>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <img src={currentUser.photoURL || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full" alt="profile" />
              <span>{currentUser.displayName || currentUser.email}</span>
            </div>
          ) : <div className="text-sm text-gray-600">No has iniciado sesión</div>}
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Próximo Partido</h2>
          <div className="border rounded p-3">
            <p className="font-medium">vs {nextMatch.opponent}</p>
            <p className="text-sm">Cancha: {nextMatch.stadium}</p>
            <p className="text-sm">Fecha: {new Date(nextMatch.date).toLocaleString()}</p>
            <div className="mt-3 text-center">
              <Countdown date={nextMatch.date} />
            </div>
          </div>

          <h3 className="mt-4 font-semibold">Noticias</h3>
          <ul className="mt-2 space-y-2">
            {news.map(n => <li key={n.id} className="p-2 border rounded"><div className="font-medium">{n.title}</div><div className="text-xs text-gray-500">{n.date}</div></li>)}
          </ul>
        </section>

        <section className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Once Titular</h2>
          <div className="bg-green-700 rounded-lg p-6 text-white">
            <div className="w-full h-64 relative rounded-lg overflow-hidden bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60')" }}>
              {players.slice(0,4).map((p, idx) => (
                <div key={p.id} className="absolute text-black text-xs bg-white/90 p-1 rounded flex items-center gap-2" style={{ left: `${12 + idx * 20}%`, top: `${30 + (idx%2)*10}%`, transform: 'translate(-50%, -50%)' }}>
                  <img src={p.photoURL || 'https://via.placeholder.com/40'} alt={p.fullName} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{(p.fullName||'Jugador').split(' ')[0]}</div>
                    <div className="text-[10px]">#{p.number}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="mt-6 font-semibold">Estadísticas del Equipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="p-3 border rounded"><div className="text-2xl font-bold">{results.length}</div><div className="text-sm text-gray-500">Partidos jugados</div></div>
            <div className="p-3 border rounded"><div className="text-2xl font-bold">{players.reduce((s,r)=>s+(r.stats?.goals||0),0)}</div><div className="text-sm text-gray-500">Goles totales</div></div>
            <div className="p-3 border rounded"><div className="text-2xl font-bold">{players.length}</div><div className="text-sm text-gray-500">Jugadores en plantilla</div></div>
          </div>

          <h3 className="mt-6 font-semibold">Resultados recientes</h3>
          <ul className="mt-2 space-y-2">
            {results.map(r => <li key={r.id} className="p-2 border rounded flex justify-between"><div>{r.date} — {r.opponent}</div><div className="font-bold">{r.score}</div></li>)}
          </ul>
        </section>

        <section className="lg:col-span-1 bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Multimedia</h3>
          <div className="mt-2 space-y-2">
            <div className="border rounded p-2">Galería de fotos (placeholder)</div>
            <div className="border rounded p-2">Videos (placeholder)</div>
          </div>

          <h3 className="mt-4 font-semibold">Registro de Jugadores</h3>
          <RegisterForm />

          <div className="mt-4">
            <h4 className="font-semibold">Iniciar sesión (jugadores)</h4>
            <LoginForm />
          </div>
        </section>

        <section className="lg:col-span-3 bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Plantilla ordenada por posición</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Portero','Defensa','Medio','Delantero','Director Técnico'].map(group=>(
              <div key={group} className="p-3 border rounded">
                <div className="font-bold mb-2">{group}</div>
                <ul className="space-y-2">
                  {players.filter(p=>p.pos===group).map(p=><li key={p.id} className="flex items-center gap-2"><img src={p.photoURL||'https://via.placeholder.com/48'} className="w-10 h-10 rounded-full" /><div><div className="font-semibold">{p.fullName}</div><div className="text-xs">#{p.number||'-'} {p.nickname?`• ${p.nickname}`:''}</div></div></li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mt-6 font-semibold">Resultados - Competiciones internacionales (muestra)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="p-3 border rounded">Champions League - ejemplo: Real 2 - 1 Azul</div>
            <div className="p-3 border rounded">Liga MX - ejemplo: Tigres 1 - 0 Pumas</div>
          </div>
        </section>

      </main>

      <footer className="max-w-6xl mx-auto mt-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} FC DESCANSDA — Demo Firebase-ready.</footer>
    </div>
  )
}
