import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage } from '../firebase'

export default function RegisterForm() {
  const [form, setForm] = useState({ fullName:'', email:'', whatsapp:'', number:'', nickname:'', photoFile:null, password:'' })
  const [msg, setMsg] = useState('')

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const validateWhats = (w) => /^\+?\d{7,15}$/.test(w)

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!form.fullName || !validateEmail(form.email) || !validateWhats(form.whatsapp) || form.password.length < 6) {
      setMsg('Completa los campos correctamente')
      return
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const uid = cred.user.uid
      let photoURL = ''
      if (form.photoFile) {
        const r = ref(storage, `players/${uid}/profile.jpg`)
        await uploadBytes(r, form.photoFile)
        photoURL = await getDownloadURL(r)
        await updateProfile(cred.user, { displayName: form.fullName, photoURL })
      }
      await setDoc(doc(db, 'players', uid), {
        fullName: form.fullName,
        email: form.email,
        whatsapp: form.whatsapp,
        number: Number(form.number) || null,
        nickname: form.nickname || '',
        photoURL,
        stats: { goals: 0, apps: 0 },
        pos: 'Sin asignar',
        createdAt: new Date()
      })
      // call cloud function to register contact (optional)
      setMsg('Registro exitoso. Revisa tu correo.')
      setForm({ fullName:'', email:'', whatsapp:'', number:'', nickname:'', photoFile:null, password:'' })
    } catch (err) {
      console.error(err)
      setMsg('Error: ' + (err.message || ''))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input className="w-full p-2 border rounded" placeholder="Nombre completo" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} />
      <input className="w-full p-2 border rounded" placeholder="Correo" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="w-full p-2 border rounded" placeholder="WhatsApp (+521...)" value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})} />
      <input className="w-full p-2 border rounded" placeholder="Número de camiseta" value={form.number} onChange={e=>setForm({...form, number:e.target.value})} />
      <input className="w-full p-2 border rounded" placeholder="Apodo (opcional)" value={form.nickname} onChange={e=>setForm({...form, nickname:e.target.value})} />
      <div>
        <label className="text-sm">Foto (opcional)</label>
        <input type="file" accept="image/*" onChange={e=>setForm({...form, photoFile: e.target.files?.[0]||null})} />
      </div>
      <input className="w-full p-2 border rounded" placeholder="Contraseña" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
      <button className="w-full bg-green-600 text-white p-2 rounded">Registrar</button>
      {msg && <div className="text-sm mt-1 text-yellow-700">{msg}</div>}
    </form>
  )
}
