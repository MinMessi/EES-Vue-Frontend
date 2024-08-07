<template>
    <v-container class="container">
        <div class="login-wrapper">
            <div>
                <div :style="{ marginBottom: login_flag ? '20px' : '10px', textAlign: 'center'}">
                        LOGIN
                </div>

                <div v-if="login_flag == false" class="login-error-box">
                    {{ email }}의 비밀번호가 올바르지 않습니다.
                    <br />
                    비밀번호를 재설정하거나,
                    <br />
                    카카오 간편로그인을  시도해 보세요.
                </div>

                <v-responsive class="mx-auto" min-width="300">
                    <v-form v-model="form" @submit.prevent="onSubmit">
                        <v-text-field
                            label="이메일 주소"
                            variant="solo"
                            v-model="email"
                            color="#fff"
                            bg-color="rgba(0, 0, 0, 0.6)"
                            clearable
                            :rules="[emailRequired]"
                        />

                        <v-text-field
                            label="비밀번호"
                            variant="solo"
                            v-model="password"
                            color="#fff"
                            bg-color="rgba(0, 0, 0, 0.6)"
                            :rules="[passwordRequired]"
                            :append-inner-icon="
                                visible ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="visible ? 'text' : 'password'"
                            @click:append-inner="visible = !visible"
                        />

                        <v-btn
                            width="100%"
                            color="white"
                            :loading="loading"
                            type="submit"
                            variant="elevated"
                            block
                            style="font-size: 13px;"
                        >
                            로그인
                        </v-btn>
                    </v-form>
                </v-responsive>
                <v-btn color="purple darken-2" class="black--text mt-2" block @click="goToNomalAccountRegisterPage" style="font-size: 13px;">
                    <router-link :to="{ name: 'NomalAccountRegisterPage' }" class="custom-link">
                            <span class="option-text"> 회원가입 </span>
                    </router-link>
                </v-btn>

                <v-divider :thickness="3" style="margin-top: 20px; margin-bottom: 20px;"></v-divider>
                

                <v-btn color="#FEE500" class="black--text mt-2 kakao-login-btn" block @click="goToKakaoLogin">
                </v-btn>
            </div>
        </div>
    </v-container>
</template>

<script>
import router from "@/router";
import { useStore } from "vuex";

export default {
    data: () => ({
        form: false,
        email: null,
        password: null,
        visible: false,
        loading: false,
        login_flag: true,
    }),

    setup() {
        const store = useStore();

        const goToKakaoLogin = async () => {
            await store.dispatch(
                "authenticationModule/requestKakaoOauthRedirectionToDjango"
            );
        };

        return {
            goToKakaoLogin,
        };
    },

    methods: {
        goToHome() {
            router.push("/");
        },

        goToSignUp() {
            router.push("/account/register");
        },

        onSubmit() {
            if (!this.form) return;

            this.loading = true;

            setTimeout(
                () => ((this.loading = false), (this.login_flag = true)),
                2000
            );

            setTimeout(
                () => ((this.loading = false), (this.login_flag = false)),
                2000
            );
        },

        emailRequired(v) {
            return !!v || "정확한 이메일 주소를 입력하세요.";
        },

        passwordRequired(v) {
            return !!v || "비밀번호는 4~60자 사이여야 합니다.";
        },
    },
};
</script>



<style scoped>
.container {
    margin: 0;
    width: 100%;
    max-width: 100vw;
    height: 100%;
    padding: 20px 40px 20px 40px;
    background: linear-gradient(
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0)
        ),
        url("@/assets/images/fixed/login1.png");
    background-size: cover;
}


:deep(.v-img__img--contain) {
    object-fit: fill !important;
}

.login-wrapper {
    position: relative;
    z-index: 1;    
    color: white;
    min-width: 100px;
    min-height: 500px;
    padding: 20px;
    padding-top: 10%;
    border-top-width: 50px;    
    border-radius: 20px;
}

.login-wrapper > div {    
    background-color: rgba(0, 0, 0, 0.6);
    position: relative;
    z-index: 1;    
    color: white;
    width:400px;
    min-height: 500px;
    padding: 20px;
    border-top-width: 150px;    
    border-radius: 20px;
    margin: auto;
}
.custom-link {
  color: white;
  text-decoration: none;
}
.login-wrapper > div > div:first-child {
    color: #fff;
    font-size: 25px;
    font-weight: bold;
    padding: 5px;
    margin: auto;
}
.login-wrapper > div > .login-error-box {
    background-color: rgba(39, 54, 108, 1);
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 10px;
    color: #fff;
}
.login-wrapper > div > .v-divider {
    margin-top: 8px;
    margin-bottom: 8px;
}
.login-wrapper > div > div:nth-last-child(3) {
    font-size: 12px;
    margin-bottom: 8px;
}

.login-wrapper > div > div:nth-last-child(2) {
    display: flex;
    justify-content: space-around;
}

.login-wrapper > div > div > div {
    width: 38px;
    height: 38px;
    cursor: pointer;
}

.login-wrapper > div > div:last-child {
    display: flex;
    margin-top: 16px;
}

.login-wrapper > div > div:last-child > p:first-child {
    color: rgba(255, 255, 255, 0.5);
    margin-right: 6px;
}

.login-wrapper > div > div:last-child > p:last-child {
    color: rgba(255, 255, 255, 0.7);
}

.login-wrapper > div > div:last-child > p:last-child:hover {
    cursor: pointer;
    text-decoration: underline;
}

.v-form .v-text-field {
    margin-bottom: 8px;
}

.kakao-login-btn {
    background-image: url("@/assets/images/fixed/kakao_login.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.v-label.v-field-label) {
    color: rgba(255, 255, 255, 0.8) !important;
}

:deep(.v-text-field input) {
    color: #fff;
}

:deep(.mdi-eye::before) {
    color: rgba(255, 255, 255, 0.8) !important;
}

:deep(.mdi-eye-off::before) {
    color: rgba(255, 255, 255, 0.8) !important;
}
</style>