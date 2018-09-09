<template>
  <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" :beforescroll="beforescroll" @beforeScoll="listScroll" ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import {getMusic} from 'api/music'
import NoResult from 'base/no-result/no-result'

const SINGER_TYPE = 'singer'
const PERPAGE = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforescroll: true
    }
  },
  methods: {
    search() {
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    searchMore() {
      console.log(this.hasMore)
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          const result = this._normalizeSongs(res.data.song.list)
          setTimeout(() => {
            this.result = this.result.concat(result)
          }, 1000)
          this._checkMore(res.data)
        }
      })
    },
    getIconCls(item) {
      if (item.type && item.type === SINGER_TYPE) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type && item.type === SINGER_TYPE) {
        return item.singerName
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    selectItem(item) {
      if (item.type === SINGER_TYPE) {
        const singer = new Singer({
          id: item.singerMID,
          name: item.singerName
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    listScroll() {
      this.$emit('listScroll')
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * PERPAGE) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = []
      if (data.song) {
        ret = this._normalizeSongs(data.song.list)
      }
      if (data.zhida && data.zhida.zhida_singer && data.zhida.zhida_singer.singerID) {
        ret.unshift({...data.zhida.zhida_singer, ...{type: SINGER_TYPE}})
      }
      return ret
    },
    _normalizeSongs(list) {
      const ret = []
      list.forEach((item, index) => {
        let musicData = item
        if (musicData.songid && musicData.albummid) {
          getMusic(musicData.songmid).then((res) => {
            if (res.code === ERR_OK) {
              const songVKey = res.data.items[0].vkey
              musicData.songVKey = songVKey
              ret.push(createSong(musicData))
            }
          })
        }
      })
      console.log(ret)
      return ret
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
