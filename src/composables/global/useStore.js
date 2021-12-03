import { reactive, computed } from "vue";
import ThreadService from "../../service";

// State
const state = reactive({
  userToken: "a1f92781-cfdc-5b25-8ec6-a3d3de095863",
  userThreads: [],
  threads: [],
  isLoggedIn: true,
  channels: [
    {
      title: "Welcome to class of 2020",
      thread_count: 30,
      comment_count: 200,
      default: 2779817052,
      recent: 2582008951,
      activity: 387093808,
      starred: 124871588,
    },
    {
      title: "Welcome to class of 2021",
      thread_count: 31,
      comment_count: 201,
      default: 128551075,
      recent: 1697155068,
      activity: 2025152521,
      starred: 3801509991,
    },
    {
      title: "Welcome to class of 2022",
      thread_count: 32,
      comment_count: 202,
      default: 1551023846,
      recent: 1351983415,
      activity: 2525005117,
      starred: 3109163349,
    },
    {
      title: "Welcome to class of 2023",
      thread_count: 33,
      comment_count: 203,
      default: 2208239383,
      recent: 3375613238,
      activity: 3142602647,
      starred: 3747635225,
    },
    {
      title: "Welcome to class of 2024",
      thread_count: 34,
      comment_count: 204,
      default: 3071002700,
      recent: 2152951500,
      activity: 3719873575,
      starred: 3802866063,
    },
    {
      title: "Welcome to class of 2025",
      thread_count: 35,
      comment_count: 205,
      default: 781973711,
      recent: 3853834273,
      activity: 3372264154,
      starred: 225894405,
    },
    {
      title: "Welcome to class of 2026",
      thread_count: 36,
      comment_count: 206,
      default: 2348051841,
      recent: 2692956217,
      activity: 3398801065,
      starred: 3677327739,
    },
    {
      title: "Welcome to class of 2027",
      thread_count: 37,
      comment_count: 200,
      default: 927708861,
      recent: 373695995,
      activity: 2253005417,
      starred: 2451447193,
    },
    {
      title: "Welcome to class of 2028",
      thread_count: 38,
      comment_count: 201,
      default: 1726103645,
      recent: 2737319526,
      activity: 85925660,
      starred: 1193941846,
    },
    {
      title: "Welcome to class of 2029",
      thread_count: 32,
      comment_count: 202,
      default: 1253593808,
      recent: 545924845,
      activity: 2819089280,
      starred: 432566409,
    },
    {
      title: "Welcome to class of 2030",
      thread_count: 33,
      comment_count: 203,
      default: 4148581615,
      recent: 3812450412,
      activity: 779242980,
      starred: 1406911881,
    },
    {
      title: "Welcome to class of 2031",
      thread_count: 34,
      comment_count: 204,
      default: 3119860264,
      recent: 2942130256,
      activity: 216806946,
      starred: 3773060241,
    },
    {
      title: "Welcome to class of 2032",
      thread_count: 35,
      comment_count: 205,
      default: 3177989128,
      recent: 3231920577,
      activity: 2326292745,
      starred: 3725111015,
    },
    {
      title: "Welcome to class of 2033",
      thread_count: 36,
      comment_count: 206,
      default: 2090496495,
      recent: 3805358221,
      activity: 2717599085,
      starred: 186808705,
    },
  ],
});

// Mutations
function setUserToken(token) {
  state.value.userToken = token;
}

function setUserThreads(userThreads) {
  state.value.userThreads = userThreads;
}

function setThreads(threads) {
  state.value.threads = threads;
}

// Actions
async function loadThreads() {
  const threads = await ThreadService.getThreads();
  setThreads(threads);
}

async function loadUserThreads() {
  const userThreads = await ThreadService.getThreads();
  setUserThreads(userThreads);
}

function updateUserToken(token) {
  setUserToken(token);
}

// Getters
const getUserThreads = computed(() => state.userThreads);
const getThreads = computed(() => state.threads);
const getUserToken = computed(() => state.userToken);
const getChannels = computed(() => state.channels);
const getLoggedInStatus = computed(() => state.isLoggedIn);

export default {
  loadThreads,
  loadUserThreads,
  updateUserToken,
  getUserThreads,
  getThreads,
  getUserToken,
  getChannels,
  getLoggedInStatus,
};
