<template>
  <v-container>
    <h2 class="mb-4 text-center">Community</h2>
    <v-card class="mb-4" elevation="2">
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" class="d-flex justify-center mb-4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="검색"
              single-line
              hide-details
              @input="filterByTitle"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-hover v-for="item in pagedItems" :key="item.communityId" v-slot:default="{ isHovering, props }">
      <v-card class="mb-4" outlined v-bind="props" :class="{ 'hover-effect': isHovering }">
        <v-row no-gutters align="center" @click="readRow(item)">
          <v-col cols="1" class="pa-3">
            <v-avatar color="grey" size="40">
              <v-img :src="item.avatar" v-if="item.avatar"></v-img>
              <span v-else class="white--text headline">{{ item.writer.charAt(0) }}</span>
            </v-avatar>
          </v-col>
          <v-col cols="5" class="pa-3">
            <div class="subtitle-1 font-weight-medium">{{ item.title }}</div>
            <div class="caption text--secondary">{{ item.writer }} · {{ item.register_date }}</div>
          </v-col>
          <v-col cols="2" class="pa-3 text-center">
            <div class="caption">{{ item.jobType || 'N/A' }}</div>
            <div class="caption text--secondary">in {{ item.location || 'N/A' }}</div>
          </v-col>
          <v-col cols="2" class="pa-3 text-center">
            <div class="subtitle-2">{{ item.rate ? `$${item.rate}/hr` : 'N/A' }}</div>
          </v-col>
          <v-col cols="2" class="pa-3 d-flex align-center justify-end">
            <v-chip small :color="getChipColor(item.category)">{{ item.category }}</v-chip>
            <v-btn icon color="amber" class="ml-2">
              <v-icon>mdi-star-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-hover>

    <div class="text-right mb-4">
      <v-btn color="primary" :to="{ name: 'CommunityRegisterPage' }">
        게시물 작성
      </v-btn>
    </div>

    <v-pagination
      v-model="pagination.page"
      :length="Math.ceil(filteredItems.length / perPage)"
      :total-visible="7"
      color="primary"
      @input="updateItems"
    ></v-pagination>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const communityModule = 'communityModule'

export default {
  components: {},
  computed: {
    ...mapState(communityModule, ['communitys']),
    pagedItems() {
      const startIdx = (this.pagination.page - 1) * this.perPage
      const endIdx = startIdx + this.perPage
      return this.filteredItems.slice(startIdx, endIdx)
    },
    filteredItems() {
      return this.communitys.filter(item =>
        item.title.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    startIndex() {
      return (this.pagination.page - 1) * this.perPage + 1
    },
    endIndex() {
      return Math.min(this.startIndex + this.perPage - 1, this.communitys.length)
    }
  },
  mounted() {
    this.requestCommunityListToDjango()
  },
  methods: {
    ...mapActions(communityModule, ['requestCommunityListToDjango']),
    readRow(item) {
      this.$router.push({
        name: 'CommunityReadPage',
        params: { communityId: item.communityId.toString() }
      })
    },
    filterByTitle() {
      this.pagination.page = 1  // 검색 시 페이지를 첫 페이지로 초기화
    },
    getChipColor(category) {
      const colors = {
        'General': 'light-blue lighten-4',
        'Question': 'amber lighten-4',
        'Discussion': 'light-green lighten-4',
        'Announcement': 'pink lighten-4'
      }
      return colors[category] || 'grey lighten-3'
    }
  },
  data() {
    return {
      search: '',
      headerTitle: [
        { text: 'No', value: 'communityId', align: 'start', sortable: true },
        { text: '제목', value: 'title', align: 'start' },
        { text: '작성자', value: 'writer', align: 'start' },
        { text: '작성일자', value: 'register_date', align: 'start' },
        { text: '카테고리', value: 'category', align: 'start' },
        { text: '즐겨찾기', value: 'actions', align: 'center', sortable: false }
      ],
      perPage: 5,
      pagination: {
        page: 1,
      },
      selectedLocation: 'All Locations',
      locationOptions: ['All Locations', 'Seoul', 'Busan', 'Incheon'],
      searchQuery: '',
      sortBy: 'Relevance',
      sortOptions: ['Relevance', 'Date', 'Title']
    }
  }
}
</script>

<style>
.hover-effect {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}
</style>
