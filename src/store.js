import axios from 'axios'
import CryptoJS from 'crypto-js'
import { createStore } from 'vuex'
import router from './router'

const baseUrl = process.env.VUE_APP_API_URL
const aesKey = process.env.VUE_APP_AES_KEY
const studentLocalStorageTitle = 'student'

const store = createStore({
    state() {
        return {
            loggedIn: false,
            module: null,
            modules: [],
            multigraph: null,
            student: null,
        }
    },
    getters: {
        getModule: state => state.module,
        getModules: state => state.modules,
        getStudent: state => state.student,
        getMultigraph: state => state.multigraph,
        isLoggedIn: state => state.loggedIn
    },
    mutations: {
        login(state) {
            state.loggedIn = true
        },
        logout(state) {
            state.loggedIn = false
        },
        saveModule(state, data) {
            state.module = data
        },
        saveModules(state, data) {
            state.modules = data
        },
        saveStudent(state, data) {
            state.student = data
        }
    },
    actions: {
        buildLeaderManual({ commit, getters }) {
            const url = `${baseUrl}/module-leader-guide/?student=${getters.getStudent.id}`
            return new Promise((resolve, reject) => axios.get(url)
                .then(response => {
                    let modules = response.data.map(m => ({
                        ...m,
                        questions: m.questions.map(q => ({
                            ...q,
                            has_answers: !!q.answer && !!q.answer.payload
                        }))
                    }))

                    commit('saveModules', modules)
                    resolve(modules)
                })
                .catch(error => errorHandler({ error, reject })))
        },
        buildModule({ commit, dispatch }, moduleId) {
            return new Promise((resolve, reject) => {
                dispatch('fetchModule', moduleId)
                    .then(module => {
                        dispatch('fetchAnswersByModule', module.id).then(answers => {
                            const newModule = {
                                ...module,
                                questions: module.questions.map(q => {
                                    let answer = answers.find(a => a.question === q.id || q.subquestions.find(subq => { a.question === subq.id }))
                                    // add answers to subquestions
                                    answers.find(a => q.subquestions.forEach(subq => {
                                        if (a.question === subq.id) {
                                            subq.answer = a.payload
                                        }
                                    }))
                                    if (answer) return { ...q, answer: answer.payload }
                                    return q
                                })
                            }

                            commit('saveModule', newModule)
                            resolve(newModule)
                        })
                            .catch(error => errorHandler({
                                error,
                                reject,
                                logError: false
                            }))
                    })
                    .catch(error => errorHandler({
                        error,
                        reject,
                        logError: false
                    }))
            })
        },
        checkStorageForStudent({ commit }) {
            return new Promise(resolve => {
                const student = retrieveFromLocalStorage()
                commit('saveStudent', student)
                resolve(student)
            })
        },
        logout({ commit }) {
            localStorage.removeItem(studentLocalStorageTitle);
            commit('logout')
            commit('saveStudent', null)
        },
        /**
         * Endpoint returns an empty array or an array with 1 item
         * when given both question id and student id
         */
        fetchAnswer({ getters }, questionId) {
            const student = getters.getStudent
            const url = `${baseUrl}/answer/?student=${student.id}&question=${questionId}`

            return new Promise((resolve, reject) => axios.get(url)
                .then(response => {
                    const answers = response.data
                    if (answers.length > 0) resolve(answers[0])
                    else resolve(null)
                })
                .catch(error => errorHandler({ error, reject })))
        },
        fetchAnswersByModule({ getters }, moduleId) {
            const student = getters.getStudent
            const url = `${baseUrl}/answer/?student=${student.id}&module=${moduleId}`

            return new Promise((resolve, reject) => axios.get(url)
                .then(response => resolve(response.data))
                .catch(error => errorHandler({ error, reject })))
        },
        fetchCoatOfArms({ getters }) {
            const url = `${baseUrl}/coat-of-arms?student=${getters.getStudent.id}`
            return new Promise((resolve, reject) => axios.get(url)
                .then(response => resolve(response.data))
                .catch(error => errorHandler({ error, reject })))
        },
        fetchLeaderManualAnswers({ getters }, moduleId) {
            const student = getters.getStudent
            const url = `${baseUrl}/leader-guide/?student=${student.id}&module=${moduleId}`

            return new Promise((resolve, reject) => axios.get(url)
                .then(response => resolve(response.data))
                .catch(error => errorHandler({ error, reject })))
        },
        fetchModule({ commit, getters }, id) {
            const student = getters.getStudent
            const url = `${baseUrl}/module/${id}/?student=${student.id}`
            return new Promise((resolve, reject) => axios.get(url)
                .then(response => {
                    const module = response.data
                    commit('saveModule', module)
                    resolve(module)
                })
                .catch(error => errorHandler({ error, reject })))
        },
        fetchModules({ commit, getters }) {
            const student = getters.getStudent
            const url = `${baseUrl}/module/?student=${student.id}`
            return new Promise((resolve, reject) => axios.get(url)
                .then(response => {
                    const modules = response.data
                    commit('saveModules', modules)
                    resolve(modules)
                })
                .catch(error => errorHandler({ error, reject })))
        },
        fetchMultigraph({ getters }) {
            const student = getters.getStudent
            const url = `${baseUrl}/multigraph/?student=${student.id}`
            return new Promise((resolve, reject) => axios.get(url)
                .then(response => resolve(response.data))
                .catch(error => errorHandler({ error, reject })))
        },
        fetchStudent({ commit }, { email, password }) {
            const url = `${baseUrl}/student`
            const model = { email, password }

            return new Promise((resolve, reject) => axios.post(url, model)
                .then(response => {
                    const student = response.data
                    commit('saveStudent', student)
                    saveToLocalStorage(student)
                    resolve(student)
                })
                .catch(error => {
                    errorHandler({ error, reject, displayError: true });
                    router.push({ name: 'ContactAdmin', params: { error: error.response.data.detail ? error.response.data.detail : error.response.data.error } })
                }))
        },
    }
})

const saveToLocalStorage = student => {
    const value = CryptoJS.AES.encrypt(JSON.stringify(student), aesKey)
    localStorage.setItem(studentLocalStorageTitle, value)
}

const retrieveFromLocalStorage = () => {
    const value = localStorage.getItem(studentLocalStorageTitle)
    if (value) {
        const student = CryptoJS.AES.decrypt(value, aesKey)
            .toString(CryptoJS.enc.Utf8)
        return JSON.parse(student)
    }
    return null
}

/**
 *
 * @param {Response} error Http Response Error
 * @param {Promise} reject reject method from promises
 * @param {boolean} displayError display error on page (optional)
 * @param {boolean} logError log error on console (optional)
 */
const errorHandler = ({
    error,
    reject,
    displayError = false,
    logError = true
}) => {
    if (logError) console.error(error)
    if (displayError) reject(error.response.data.detail)
    else reject(error)
}

export default store
