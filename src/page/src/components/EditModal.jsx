import { Modal, Form, App } from 'antd'
import { useEffect } from 'react'
import request from '@/utils/request'
import iconModel from '@/models/IconModel'
import { observer } from 'mobx-react-lite'
import IconForm from './IconForm'

const EditModal = observer(() => {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { editingIcon } = iconModel

  useEffect(() => {
    if (editingIcon) {
      form.resetFields()
      form.setFieldsValue({
        name: editingIcon.name,
        svg: editingIcon.svg,
      })
    }
  }, [editingIcon, form])

  return (
    <Modal
      title="Edit Icon"
      open={!!editingIcon}
      onCancel={() => {
        iconModel.clearEditingIcon()
      }}
      onOk={() => {
        form.validateFields().then(({ name, keepColor, svg }) => {
          request('/api/icon', {
            method: 'PUT',
            body: {
              originalName: editingIcon.name,
              name,
              keepColor,
              svg,
            },
          })
            .then(() => {
              iconModel.fetchIcons()
              iconModel.clearEditingIcon()
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

export default EditModal
