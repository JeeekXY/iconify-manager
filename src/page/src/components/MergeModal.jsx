import { Modal, Form, Input, Upload, App } from 'antd'
import request from '@/utils/request'
import iconModel from '@/models/IconModel'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import readFile from '@/utils/readFile'
import { InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload

const MergeModal = observer(() => {
  const { message } = App.useApp()

  const [form] = Form.useForm()
  const { mergeModalOpen } = iconModel

  useEffect(() => {
    if (mergeModalOpen) {
      form.resetFields()
    }
  }, [mergeModalOpen, form])

  return (
    <Modal
      title="Merge IconifyJSON"
      open={mergeModalOpen}
      onCancel={() => {
        iconModel.setMergeModalOpen(false)
      }}
      onOk={() => {
        form.validateFields().then(({ iconifyJSON }) => {
          request('/api/icon/merge', {
            method: 'POST',
            body: {
              iconifyJSON,
            },
          })
            .then(() => {
              iconModel.fetchIcons()
              iconModel.setMergeModalOpen(false)
            })
            .catch(error => {
              message.error(error.message)
            })
        })
      }}
      width={600}
    >
      <div className="flex flex-col items-center py-6 gap-6">
        <Dragger
          className="w-full"
          accept=".json"
          beforeUpload={async file => {
            const { type, name } = file
            if (type === 'application/json' && name.endsWith('.json')) {
              try {
                const content = await readFile(file)
                form.setFieldsValue({
                  iconifyJSON: content,
                })
              } catch (error) {
                message.error('Failed to read file')
              }
            } else {
              message.error('Please upload .json file')
            }
            return Upload.LIST_IGNORE
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag IconifyJSON file to this area</p>
        </Dragger>
        <Form className="w-full" form={form}>
          <Form.Item
            name="iconifyJSON"
            label="IconifyJSON"
            layout="vertical"
            rules={[
              {
                validator: (_, value) => {
                  try {
                    JSON.parse(value)
                  } catch (error) {
                    return Promise.reject(new Error('Invalid IconifyJSON'))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 10, maxRows: 10 }} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
})

export default MergeModal
