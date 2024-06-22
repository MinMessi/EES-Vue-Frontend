import { ActionContext } from "vuex"
import { Review, ReviewState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
import { REQUEST_REVIEW_LIST_TO_DJANGO } from "./mutation-types"

export type ReviewActions = {
    requestReviewListToDjango(context: ActionContext<ReviewState, any>): Promise<void>
    requestCreateReviewToDjango(context: ActionContext<ReviewState, unknown>, payload: {
        title: string, writer: string, content: string
    }): Promise<AxiosResponse>
}

const actions: ReviewActions = {
    async requestReviewListToDjango(context: ActionContext<ReviewState, any>): Promise<void> {
        try {
            const res: AxiosResponse<any, any> =
                await axiosInst.djangoAxiosInst.get('/review/list')

            const data: Review[] = res.data
            context.commit(REQUEST_REVIEW_LIST_TO_DJANGO, data)
        } catch (error) {
            console.error('requestReviewListToDjango(): ' + error)
            throw error
        }
    },
    async requestCreateReviewToDjango(context: ActionContext<ReviewState, unknown>, payload: {
        title: string, writer: string, content: string
    }): Promise<AxiosResponse> {        
        console.log('requestCreateReviewToDjango()')

        const { title, writer, content } = payload
        console.log('전송할 데이터:', { title, writer, content })

        try {
            const res: AxiosResponse = await axiosInst.djangoAxiosInst.post(
                '/review/register', { title, writer, content })

            console.log('res:', res.data)
            return res.data
        } catch (error) {
            alert('requestCreateReviewToDjango() 문제 발생!')
            throw error
        }
    }
}

export default actions