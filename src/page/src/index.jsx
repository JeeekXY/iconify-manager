import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App as AppProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import App from './App'
import './index.css'

const root = createRoot(document.querySelector('#root'))

root.render(
  <StrictMode>
    <ConfigProvider locale={enUS}>
      <AppProvider>
        <App />
      </AppProvider>
    </ConfigProvider>
  </StrictMode>,
)
