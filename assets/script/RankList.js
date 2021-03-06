// *************************
// 排行榜脚本
// *************************

var DataManager = require('DataManager')

cc.Class({
  extends: cc.Component,

  properties: {
    rankSprite: { // 精灵组件引用
      default: null,
      type: cc.Sprite
    },
    data: { // 全局数据引用
      default: null,
      type: DataManager
    }
  },

  onLoad: function () {
    // 设置常驻节点属性
    cc.game.addPersistRootNode(this.node)
    // 精灵组件引用
    this.rankSprite = this.node.getComponent(cc.Sprite)
    // 全局数据引用
    this.data = cc.find('DataManager').getComponent('DataManager')
  },

  onDestroy: function () {
    // 解除常驻节点属性
    cc.game.removePersistRootNode(this.node)
  },

  start: function () {
    // 控件位置适配
    this.node.x = this.data.screenWidth / 2
    this.node.y = this.data.screenHeight / 2
  },

  init: function () {
    // *** 初始化 ***
    // * 画布初始化 *
    if (!this.sharedCanvas) {
      const openDataContext = wx.getOpenDataContext()
      this.sharedCanvas = openDataContext.canvas
      this.sharedCanvas.width = 600
      this.sharedCanvas.height = 1000
    }
    // * 纹理初始化 *
    if (!this.texture) {
      this.texture = new cc.Texture2D()
    }
  },

  openRankingList: function () {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) return
    // *** 打开排行榜 ***
    // *** （对外接口） ***
    console.log('Main: call openRankingList()')
    this.isShow = true
    // * 初始化 *
    this.init()
    // * 向子域发送更新信息 *
    wx.getOpenDataContext().postMessage({ action: 'UpdateRankingList' })
    // * 开始刷新排行榜 *
    // 多次间隔刷新
    this.refreshTime = 8
    this.refreshTimer = 0.6
    this.refreshInterval = 0.6
  },

  closeRankingList: function () {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) return
    // *** 关闭排行榜 ***
    // *** （对外接口） ***
    this.isShow = false
    console.log('Main: call closeRankingList()')
    // * 开始隐藏排行榜 *
    this.hide()
  },

  uploadRankingData: function (username, score) {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) return
    // *** 上传玩家数据 ***
    // *** （对外接口） ***
    console.log('Main: call uploadRankingData()')
    wx.setUserCloudStorage({
      KVDataList: [{
        key: 'username',
        value: username
      }, {
        key: 'tempScore',
        value: score
      }],
      success: function (res) {
        console.log(`Main: Upload Success`)
        // 向子域发送更新信息
        wx.getOpenDataContext().postMessage({ action: 'UpdateRankingData' })
      },
      fail: function (res) {
        console.log(`Main: Upload Fail`)
      }
    })
  },

  clearRankingData: function () {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) return
    // *** 清除玩家数据 ***
    // *** （对外接口） ***
    console.log('Main: call clearRankingData()')
    wx.getOpenDataContext().postMessage({ action: 'ClearRankingData' })
  },

  update: function (dt) {
    if ((this.isShow) && (this.refreshTime > 0)) {
      this.refreshTimer += dt
      if (this.refreshTimer > this.refreshInterval) {
        this.refreshTimer -= this.refreshInterval
        this.refreshTime--
        this.show()
      }
    }
  },

  show: function () {
    // * 展示画布 *
    if (this.spriteFrame) {
      this.spriteFrame.clearTexture()
    }
    if (this.texture) {
      this.texture.initWithElement(this.sharedCanvas)
      this.texture.handleLoadedTexture()
      this.spriteFrame = new cc.SpriteFrame(this.texture)
      this.rankSprite.spriteFrame = this.spriteFrame
    }
    // * 激活精灵节点 *
    this.node.getComponent(cc.Sprite).enabled = true
  },

  hide: function () {
    // * 销毁画布 *
    if (this.spriteFrame) {
      this.spriteFrame.clearTexture()
      this.spriteFrame = null
    }
    if (this.texture) {
      this.texture.destroy()
      this.texture = null
    }
    // * 关闭精灵节点 *
    this.node.getComponent(cc.Sprite).enabled = false
  }
})
