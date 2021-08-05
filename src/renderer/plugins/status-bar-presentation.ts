import store from '@fe/support/store'
import { Plugin } from '@fe/context/plugin'
import { Escape, getKeysLabel } from '@fe/context/shortcut'

export default {
  name: 'status-bar-presentation',
  register: ctx => {
    const present = (flag: boolean) => {
      if (flag) {
        ctx.ui.useToast().show('info', '按下 Esc 键退出演示模式')
      }
      store.commit('setPresentation', flag)
    }

    const enterPresentation = ctx.action.registerAction({
      name: 'status-bar.enter-presentation',
      handler: () => present(true),
      keys: ['F5']
    })

    ctx.action.registerAction({
      name: 'status-bar.exit-presentation',
      handler: () => present(false),
      keys: [Escape],
      when: () => {
        const el = window.document.activeElement
        return store.state.presentation &&
          el?.tagName !== 'INPUT' &&
          el?.tagName !== 'TEXTAREA' &&
          [...document.body.children] // 判断页面是否有浮层遮住
            .filter(x => x.tagName === 'DIV' && x.clientWidth > 10 && x.clientHeight > 10)
            .length < 2
      }
    })

    ctx.statusBar.tapMenus(menus => {
      menus['status-bar-presentation'] = {
        id: 'status-bar-presentation',
        position: 'right',
        tips: `预览 (${getKeysLabel(enterPresentation.name)})`,
        icon: 'presentation',
        onClick: () => present(true)
      }
    })
  }
} as Plugin