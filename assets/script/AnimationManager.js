// *************************
// 动画管理器脚本
// *************************
//var DataManager = require("DataManager");
cc.Class({
    extends: cc.Component,

    properties: {
        elementBaseLineY: {
            default: 0,
            type: cc.Integer,
            tooltip: '元素基准线相对于背景中心锚点的Y坐标'
        },
        isLeftMoving: {
            default: false,
            tooltip: '左元素是否在移动'
        },
        isRightMoving: {
            default: false,
            tooltip: '右元素是否在移动'
        },
        shiftDuration: {
            default: 0,
            type: cc.Float,
            tooltip: '移动动画时长'
        },
        spinDuration: {
            default: 0,
            type: cc.Float,
            tooltip: '旋转动画周期'
        }
    },

    setShiftAction: function(posX) {  
        // 移动动画      
        var shift = cc.moveTo(this.shiftDuration, cc.v2(posX, this.elementBaseLineY));
        return shift;
    },

    setSpinAction: function() {
        // 旋转动画
        var rotate = cc.rotateBy(this.spinDuration, -180);
        return cc.repeatForever(rotate);
    },

    setBlinkAction: function(duration) {
        var blink = cc.sequence(cc.fadeTo(duration, 0), cc.fadeTo(duration, 255));
        return blink;
    },

    playShift: function(node, posX, isLeftNode) {
        // 单元素移动动画播放
        var started = cc.callFunc(function() {
            if(isLeftNode) {
                this.isLeftMoving = true;
            }
            else {
                this.isRightMoving = true;
            }
        }, this);
        var finished = cc.callFunc(function() {
            if(isLeftNode) {
                this.isLeftMoving = false;
            }
            else {
                this.isRightMoving = false;
            }
        }, this);
        node.runAction(cc.sequence(started, this.setShiftAction(posX), finished));          
    },

    playSwitch: function(node1, node2, posX1, posX2) {
        // 两元素交换动画播放
        var started = cc.callFunc(function() {
                this.isLeftMoving = true;
                this.isRightMoving = true;
        }, this);
        var finished = cc.callFunc(function() {
                this.isLeftMoving = false;
                this.isRightMoving = false;
        }, this);
        node1.runAction(cc.sequence(started, this.setShiftAction(posX1), finished));
        node1.runAction(this.setBlinkAction(0.5 * this.shiftDuration));
        node2.runAction(this.setShiftAction(posX2));
        node2.runAction(this.setBlinkAction(0.5 * this.shiftDuration));
    },

    playSpin: function(node) {
        // 旋转动画播放        
        node.runAction(this.setSpinAction());
    },

    onLoad: function () {
        // 设置常驻节点属性
        cc.game.addPersistRootNode(this.node);
    },

    onDestroy: function() {
        // 解除常驻节点属性
        cc.game.removePersistRootNode(this.node);
    },

    start: function () {

    },

    update: function (dt) {

    },

    TODO: function () {
        // *** ??? ***
    },

});