import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { ErrorBoundary } from './components/feedback/ErrorBoundary'

import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
        {/* <Toaster /> */}
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
