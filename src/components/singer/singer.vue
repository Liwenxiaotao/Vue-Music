<template>
  <div class="singer" ref='singer'>
    <listview :data="singerList" @select='selectSinger' ref='list'></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import listview from 'base/listView/listView'
import { mapMutations } from 'vuex'
import {playingMixin} from 'common/js/mixin'
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
export default {
  mixins: [playingMixin],
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  components: {
    listview
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = res.data.list
          this.singerList = (this.normalizeSinger(this.singerList))
        }
      })
    },
    normalizeSinger() {
      let map = {
        hot: {
          title: HOT_NAME,
          item: []
        }
      }
      this.singerList.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.item.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        let key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            item: []
          }
        }
        map[key].item.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      let hot = []
      let rest = []
      for (let key in map) {
        if (map[key].title === HOT_NAME) {
          hot.push(map[key])
        } else if (/[a-zA-Z]/.test(map[key].title)) {
          rest.push(map[key])
        }
      }
      rest.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(rest)
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
