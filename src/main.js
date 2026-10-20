import { inject } from '@vercel/analytics'
import { createJournal } from './journal/createJournal.js'
import './styles/global.css'

inject()

const root = document.querySelector('#app')

try {
  createJournal(root)
} catch (error) {
  console.error('No se pudo iniciar el diario:', error)
  root.innerHTML = `
    <main class="boot-error" role="alert">
      <h1>No se pudo abrir el diario</h1>
      <p>Recarga la página. Si el problema continúa, revisa los archivos Markdown y la consola del navegador.</p>
    </main>
  `
}
