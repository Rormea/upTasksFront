import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import { Login, SingUp, RecoveryPassword, PasswordNew, ConfirmAccount, Projects } from './pages'

import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './layouts/ProtectedRoute'



function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        // Areas de acceso Público
          <Route path='/' element={<AuthLayout />} >

            <Route index element={<Login />} />
            <Route path='sign-up' element={<SingUp />} />
            <Route path='new-password' element={<PasswordNew />} />
            <Route path='recovery-password' element={<RecoveryPassword />} />
            <Route path='recovery-password/:token' element={<PasswordNew />} />
            <Route path='confirm-account/:id' element={<ConfirmAccount />} />

          </Route>


        // Areas Privada con Auth
          <Route path='/projects' element={<ProtectedRoute />}>
            <Route index element={<Projects />} />

          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
