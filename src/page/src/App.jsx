import { observer } from 'mobx-react-lite'
import { Input, Button } from 'antd'
import iconModel from '@/models/IconModel'
import EditModal from '@/components/EditModal'
import AddModal from '@/components/AddModal'
import IconItem from '@/components/IconItem'
import MergeModal from '@/components/MergeModal'

const App = observer(() => {
  const { searchText, filteredIcons } = iconModel

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="min-w-[600px] max-w-[1200px] w-full bg-white p-8">
        <div className="flex gap-2 mb-8">
          <Input
            placeholder="Search icons"
            value={searchText}
            onChange={e => {
              iconModel.setSearchText(e.target.value)
            }}
            className="flex-1"
            allowClear
          />
          <Button
            type="primary"
            onClick={() => {
              iconModel.setAddModalOpen(true)
            }}
          >
            Add Icon
          </Button>
          <Button
            type="primary"
            onClick={() => {
              iconModel.setMergeModalOpen(true)
            }}
          >
            Merge IconifyJSON
          </Button>
        </div>

        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          }}
        >
          {filteredIcons.map(icon => (
            <IconItem key={icon.name} icon={icon} />
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-12 text-gray-500">No icons found</div>
        )}
      </div>

      <EditModal />
      <AddModal />
      <MergeModal />
    </div>
  )
})

export default App
