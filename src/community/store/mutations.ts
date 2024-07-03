import { MutationTree } from "vuex";
import { CommunityState, Community } from "./states";
import {
    REQUEST_COMMUNITY_TO_DJANGO,
    REQUEST_COMMUNITY_LIST_TO_DJANGO
} from "./mutation-types";

export interface CommunityMutations extends MutationTree<CommunityState> {
    [REQUEST_COMMUNITY_TO_DJANGO](state: CommunityState, receivedData: Community): void
    [REQUEST_COMMUNITY_LIST_TO_DJANGO](state: CommunityState, receivedData: Community[]): void
}

const mutations: MutationTree<CommunityState> = {
    [REQUEST_COMMUNITY_TO_DJANGO](state: CommunityState, receivedData: Community): void {
        state.community = receivedData
    },
    [REQUEST_COMMUNITY_LIST_TO_DJANGO](state: CommunityState, receivedData: Community[]): void {
        state.communitys = receivedData
    }
}

export default mutations as CommunityMutations