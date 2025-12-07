import { InboxOutlined } from '@ant-design/icons'
import { App, Form, Switch, Upload, Input } from 'antd'
import readFile from '@/utils/readFile'

const { Dragger } = Upload

const IconForm = ({ form }) => {
  const { message } = App.useApp()

  return (
    <div className="flex flex-col items-center py-6 gap-6">
      <Dragger
        className="w-full"
        accept=".svg"
        beforeUpload={async file => {
          const { type, name } = file
          if (type === 'image/svg+xml' && name.endsWith('.svg')) {
            try {
              const content = await readFile(file)
              form.setFieldsValue({
                svg: content,
                name: name.slice(0, -4),
              })
            } catch (error) {
              message.error('Failed to read file')
            }
          } else {
            message.error('Please upload .svg file')
          }
          return Upload.LIST_IGNORE
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag SVG file to this area</p>
      </Dragger>
      <Form className="w-full" form={form}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter icon name' }]}
          required={false}
        >
          <Input />
        </Form.Item>
        {/* eslint-disable-next-line react/jsx-boolean-value */}
        <Form.Item name="keepColor" label="Keep Color" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item
          name="svg"
          label="SVG Code"
          layout="vertical"
          rules={[{ required: true, message: 'Please enter SVG code' }]}
          required={false}
        >
          <Input.TextArea autoSize={{ minRows: 10, maxRows: 10 }} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default IconForm
