import { EditOutlined, DeleteOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons'
import { App } from 'antd'
import request from '@/utils/request'
import iconModel from '@/models/IconModel'
import { observer } from 'mobx-react-lite'
import copy from 'modern-copy-to-clipboard'

const IconItem = observer(({ icon }) => {
  const { message, modal } = App.useApp()

  return (
    <div className="relative flex flex-col justify-center items-center gap-2 min-w-[160px] max-w-[200px] h-[108px] group rounded-lg overflow-hidden">
      <div
        className="size-12 [&_svg]:w-full [&_svg]:h-full"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />
      <span className="text-sm text-gray-700 text-center">{icon.name}</span>
      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-[120px] h-[96px] grid grid-cols-2 place-items-center">
          <EditOutlined
            onClick={() => {
              iconModel.setEditingIcon(icon)
            }}
            className="text-white! text-2xl cursor-pointer hover:text-blue-500! transition-colors"
          />
          <DeleteOutlined
            onClick={() => {
              modal.confirm({
                title: 'Delete Icon?',
                onOk: () => {
                  request('/api/icon', {
                    method: 'DELETE',
                    body: {
                      name: icon.name,
                    },
                  })
                    .then(() => {
                      iconModel.fetchIcons()
                    })
                    .catch(error => {
                      message.error(error.message)
                    })
                },
              })
            }}
            className="text-white! text-2xl cursor-pointer hover:text-red-500! transition-colors"
          />
          <CopyOutlined
            onClick={() => {
              copy(icon.svg)
              message.success('SVG code copied to clipboard')
            }}
            className="text-white! text-2xl cursor-pointer hover:text-blue-500! transition-colors"
          />
          <DownloadOutlined
            onClick={() => {
              const blob = new Blob([icon.svg], { type: 'image/svg+xml' })
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `${icon.name}.svg`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
              message.success('SVG file downloaded')
            }}
            className="text-white! text-2xl cursor-pointer hover:text-blue-500! transition-colors"
          />
        </div>
      </div>
    </div>
  )
})

export default IconItem
