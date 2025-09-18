import React, { useState } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'

export default function LoginForm() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [msg, setMsg] = useState('')

  const login = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      setMsg('Sesión iniciada')
    } catch (err) {
      console.error(err)
      setMsg('Credenciales inválidas')
    }
  }

  const reset = async () => {
    if (!form.email) return setMsg('Ingresa tu correo')
    try {
      await sendPasswordResetEmail(auth, form.email)
      setMsg('Si existe, recibirás un email para restablecer la contraseña')
    } catch (err) {
      console.error(err)
      setMsg('Error al solicitar restablecimiento')
    }
  }

  return (
    <div>
      <form onSubmit={login} className="space-y-2">
        <input className="w-full p-2 border rounded" placeholder="Correo" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Contraseña" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="w-full bg-blue-700 text-white p-2 rounded">Iniciar sesión</button>
      </form>
      <div className="text-sm mt-2">
        <button className="underline" onClick={reset}>¿Olvidaste tu contraseña?</button>
      </div>
      {msg && <div className="mt-2 text-sm text-yellow-700">{msg}</div>}
    </div>
  )
}
