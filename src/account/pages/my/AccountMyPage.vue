<template>
    <v-container>
        <v-card class="profile-section">
            <v-card-title class="title-section">사용자 정보</v-card-title>
                <div>
                    <img :src="imageSrc" class="profile-image"/>
                </div>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="nickname" readonly label="닉네임"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="email" readonly label="이메일"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="gender" readonly label="성별"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>

        <div class="button-container">
            <v-btn color="red" @click="onClickAccountWithdraw" class="action-button">
                <span class="button-text">회원 탈퇴</span>
            </v-btn>
        </div>
    </v-container>
</template>

<script>
import imageSrc from '@/assets/images/fixed/profile_img.png'
import { mapActions } from 'vuex'

const accountModule = 'accountModule'

export default {
    data () {
        return {
            imageSrc,
            email:'',
            nickname: '',
            gender: '',
        }
    },
    async created () {
        try {
                const nickname = await this.requestNicknameToDjango()
                const email = await this.requestEmailToDjango()
                const gender = await this.requestGenderToDjango()
                this.nickname = nickname
                this.email = email
                this.gender = gender
            } catch (error) {
                console.log('사용자 닉네임 및 이메일 정보 가져오는 과정에서 에러 발생:', error)
            }
    },
    methods: {
        ...mapActions(accountModule, ['requestNicknameToDjango', 'requestEmailToDjango', 'requestGenderToDjango']),
        async onClickAccountWithdraw () {
            this.$router.push({ name: 'AccountWithdrawPage' });
        },
    }
}
</script>

<style scoped>
.profile-section {
    width: 100%;
    max-width: 500px; /* 적절한 크기로 설정 */
    height: auto;
    margin: auto;
    display: block;
    object-fit: cover;
    margin-top: 30px;
}

.title-section {
  padding: 16px;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  background-color: #fafafa;
  border-bottom: 1px solid #eeeeee;
}

.profile-image {
  width: 100%;
  max-width: 300px; /* 적절한 크기로 설정 */
  height: auto;
  margin: auto;
  display: block;
  border-radius: 10px;
  object-fit: cover;
  margin-top: 30px;
}

.button-container{
    text-align: center;
    margin-top: 50px;
    margin-bottom: 50px;
}
</style>