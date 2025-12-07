const request = async (url, options = {}) => {
  try {
    const { body, headers, params, ...restOptions } = options

    let finalUrl = url
    if (params) {
      const queryString = new URLSearchParams(params).toString()
      if (queryString) {
        const separator = url.includes('?') ? '&' : '?'
        finalUrl = `${url}${separator}${queryString}`
      }
    }

    const response = await fetch(finalUrl, {
      ...restOptions,
      body: body && JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    if (!response.ok) {
      const error = new Error(`fetch failed, status: ${response.status}`)
      error.status = response.status
      throw error
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }

    throw new Error('Unknown response content type')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Request failed:', error)
    throw error
  }
}

export default request
