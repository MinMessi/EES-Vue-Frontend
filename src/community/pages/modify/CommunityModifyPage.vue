<template>
    <v-container>
        <h2>Commutity</h2>
        <v-card v-if="community">
            <v-card-title>게시물 정보</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="title" label="제목" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="community.writer" readonly label="작성자" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-textarea v-model="content" label="내용" auto-grow />
                        </v-col>
                    </v-row>
                    <v-row justify="end">
                        <v-col cols="auto">
                            <v-btn color="primary" @click="onModify">수정 완료</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <router-link :to="{ name: 'CommunityReadPage' }">
                                <v-btn color="secondary">돌아가기</v-btn>
                            </router-link>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const communityModule = 'communityModule'

export default {
    props: {
        communityId: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            title: '',
            writer: '',
            content: '',
        }
    },
    computed: {
        ...mapState(communityModule, ['community'])
    },
    methods: {
        ...mapActions(communityModule, ['requestCommunityToDjango', 'requestModifyCommunityToDjango']),
        async onModify() {
            const payload = {
                title: this.title,
                content: this.content,
                communityId: this.communityId,
            }

            await this.requestModifyCommunityToDjango(payload)
            await this.$router.push({
                name: 'CommunityReadPage',
                params: { communityId: this.communityId }
            })
        },
    },
    created() {
        this.requestCommunityToDjango(this.communityId).then(() => {
            this.title = this.community.title
            this.writer = this.community.writer
            this.content = this.community.content
        })
    },
}
</script>