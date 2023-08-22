import React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ReactQueryDevtools } from 'react-query/devtools'
import Layout from './components/Layout'
import Home from './Home/Home'
import About from './Pages/About'
import ViewPost from './components/ViewPost'
import NotFound from './Pages/NotFound'

const App = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='view-post/:userId' element={<ViewPost />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
        <ReactQueryDevtools />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
