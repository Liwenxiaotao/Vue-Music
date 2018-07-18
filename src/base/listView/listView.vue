<!-- 歌手列表 -->
<template>
  <scroll class="listview" :data="data" ref = "listView" :listenScroll = "listenScroll" :probeType = "probeType" @scroll = "scroll">
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref = "listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, ind) in group.item"  @click="selectItem(item)"  :key="ind">
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart = "onShortcutTouchStart" @touchmove.stop.prevent = "onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" class="item" :data-index = "index" :class = "{current: currentIndex === index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show = "fixedTitle" ref = "fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show = "!  data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import loading from 'base/loading/loading'
// 每个导航的高度
const ANCHOR_HEIGHT = 18
// 固定标题的高度
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      dafault: []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: 0
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  components: {
    scroll,
    loading
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      })
    },
    scrollY(newY) {
      let listHeight = this.listHeight
      // 当滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (height1 <= (-newY) && height2 > (-newY)) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 在底部且-newY大于height2
      this.currentIndex = this.listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.slice(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  mounted() {},
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let y1 = e.touches[0].pageY
      this.touch.y1 = y1
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY
      let detal = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
      let anchorIndex = parseInt(this.touch.anchorIndex) + detal
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      // 点击div上下的空白
      if (!index && index !== 0) {
        return
      }
      // 滑动到底部和顶部
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectItem(item) {
      this.$emit('select', item)
    }
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
