import { defineStore } from 'pinia';
import { io } from 'socket.io-client';

export const useSocketStore = defineStore('socket', {
    state: () => ({
        socket: null,
        playerName: '',
        quizId: '',
        questions: [],
        currentQuestionIndex: 0,
        selectedAnswer: null,
        score: 0,
        players: [],
        quizFinished: false,
        readyPlayers: [],
    }),
    actions: {
        connect() {
            if (!this.socket) {
                const config = useRuntimeConfig();
                const serverUrl = config.public.serverUrl;

                this.socket = io(`${serverUrl}`, {
                    withCredentials: true,
                });

                this.socket.on('connect', () => {
                    console.log('Connected to the server with socket id: ', this.socket.id);
                });

                this.socket.on('disconnect', () => {
                    console.log('Disconnected from server');
                });
                
                this.socket.on('answerSubmitted', (data) => {
                    console.log('Answer submitted by another user:', data);
                });

                this.socket.on('updateReadyPlayers', (data) => {
                    console.log('Updated ready players: ', data.readyPlayers);
                    this.readyPlayers = data.readyPlayers;
                });

                this.socket.on('allPlayersFinished', ({ players, questionIndex }) => {
                    console.log('All players finished question', questionIndex);
                    this.players = players; // Update players state with the list of players and their scores
                });

            }
        },
        disconnect() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
            }
        },
        setPlayerName(name) {
            this.playerName = name;
        },
        setQuizId(id) {
            this.quizId = id;
        },
        setQuestions(questions) {
            this.questions = questions;
        },
        submitAnswer() {
            const answerData = {
                playerName: this.playerName,
                quizId: this.quizId,
                questionIndex: this.currentQuestionIndex,
                selectedAnswer: this.selectedAnswer,
                correctAnswer: this.currentQuestion?.correctAnswer,
            };
            this.socket.emit('submitAnswer', answerData);

            if (this.selectedAnswer === this.currentQuestion?.correctAnswer) {
                this.score += 1;
            }
            this.selectedAnswer = null;
        },
    },
    getters: {
        currentQuestion(state) {
            return state.questions[state.currentQuestionIndex] || null;
        },
    },
});
