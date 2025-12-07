import { makeAutoObservable, runInAction, autorun } from 'mobx'
import request from '@/utils/request'

class IconModel {
  icons = []

  searchText = ''

  editingIcon = null

  addModalOpen = false

  mergeModalOpen = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    autorun(() => {
      this.fetchIcons()
    })
  }

  setSearchText(text) {
    this.searchText = text
  }

  setEditingIcon(icon) {
    this.editingIcon = icon
  }

  clearEditingIcon() {
    this.editingIcon = null
  }

  setAddModalOpen(open) {
    this.addModalOpen = open
  }

  setMergeModalOpen(open) {
    this.mergeModalOpen = open
  }

  get filteredIcons() {
    if (!this.searchText.trim()) {
      return this.icons
    }
    const searchText = this.searchText.toLowerCase().trim()
    return this.icons.filter(icon => {
      const iconName = icon.name.toLowerCase().trim()
      let searchIndex = 0
      Array.from(iconName).forEach(char => {
        if (searchIndex < searchText.length && char === searchText[searchIndex]) {
          searchIndex += 1
        }
      })
      return searchIndex === searchText.length
    })
  }

  async fetchIcons() {
    const icons = await request('/api/icons', {
      method: 'GET'
    })
    runInAction(() => {
      this.icons = icons
    })
  }
}

export default new IconModel()
