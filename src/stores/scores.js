import { defineStore } from 'pinia'

export const useScoresStore = defineStore('scores', {
  state: () => ({
    userScore: 0,
    optimalScore: 0,
  }),
  actions: {
    setScores(user, optimal) {
      this.userScore = user
      this.optimalScore = optimal
    },
  },
})
