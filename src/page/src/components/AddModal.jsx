import { Modal, Form, App } from 'antd'
import request from '@/utils/request'
import iconModel from '@/models/IconModel'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import IconForm from './IconForm'

const AddModal = observer(() => {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { addModalOpen } = iconModel

  useEffect(() => {
    if (addModalOpen) {
      form.resetFields()
    }
  }, [addModalOpen, form])

  return (
    <Modal
      title="Add Icon"
      open={addModalOpen}
      onCancel={() => {
        iconModel.setAddModalOpen(false)
      }}
      onOk={() => {
        form.validateFields().then(({ name, keepColor, svg }) => {
          request('/api/icon', {
            method: 'POST',
            body: {
              name,
              keepColor,
              svg,
            },
          })
            .then(() => {
              iconModel.fetchIcons()
              iconModel.setAddModalOpen(false)
            })
            .catch(error => {
              message.error(error.message)
            })
        })
      }}
      width={600}
    >
      <IconForm form={form} />
    </Modal>
  )
})

export default AddModal
