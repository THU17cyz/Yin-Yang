// *************************
// 音效管理器脚本
// *************************

cc.Class({
  extends: cc.Component,

  properties: {
    isMute: { // 是否静音
      default: false
    },
    current: { // 当前背景音乐ID
      default: 0,
      type: cc.Integer
    },
    musicVolume: { // 音乐音量
      default: 0,
      type: cc.Float
    },
    effectVolume: { // 音效音量
      default: 0,
      type: cc.Float
    },
    bgm: { // 背景音乐预载
      default: null,
      type: cc.AudioClip
    },
    clickSound: { // 点击音效预载
      default: null,
      type: cc.AudioClip
    }
  },

  onLoad: function () {
    // 设置常驻节点属性
    cc.game.addPersistRootNode(this.node)
    // 初始化音量
    this.musicVolume = 0.8
    this.effectVolume = 0.8
  },

  onDestroy: function () {
    // 解除常驻节点属性
    cc.game.removePersistRootNode(this.node)
  },

  start: function () {
    // *** 播放背景音乐 ***
    this.playMusic(this.bgm)
  },

  playMusic: function (clip) {
    // *** 播放音乐 ***
    // （背景音乐，循环，单例）
    cc.audioEngine.stop(this.current)
    if (this.isMute) { this.current = cc.audioEngine.play(clip, true, 0) } else { this.current = cc.audioEngine.play(clip, true, this.musicVolume) }
  },

  playEffect: function (clip) {
    // *** 播放音效 ***
    // （游戏音效，非循环，非单例）
    if (this.isMute) { cc.audioEngine.play(clip, false, 0) } else { cc.audioEngine.play(clip, false, this.effectVolume) }
  },

  switchMute: function (isMute) {
    // *** 切换静音 ***
    this.isMute = isMute
    if (this.isMute) {
      cc.audioEngine.setVolume(this.current, 0)
    } else {
      cc.audioEngine.setVolume(this.current, this.musicVolume)
    }
  },

  pause: function () {
    // *** 暂停音乐 ***
    cc.audioEngine.pause(this.current)
  },

  resume: function () {
    // *** 恢复音乐 ***
    cc.audioEngine.resume(this.current)
  },

  getMusicVolume: function () {
    // *** 获取音乐音量 ***
    return this.musicVolume
  },

  setMusicVolume: function (volume) {
    // *** 设定音乐音量 ***
    if ((volume < 0) || (volume > 1)) { return }
    this.musicVolume = volume
    if (!this.isMute) { cc.audioEngine.setVolume(this.current, this.musicVolume) }
  },

  getEffectVolume: function () {
    // *** 获取音效音量 ***
    return this.effectVolume
  },

  setEffectVolume: function (volume) {
    // *** 设定音效音量 ***
    if ((volume < 0) || (volume > 1)) { return }
    this.effectVolume = volume
  }
})
