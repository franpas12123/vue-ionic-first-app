<template>
  <base-layout pageTitle="" showLogo="true">
    <div class="">
      <div class="plm-top-container">
        <ion-img
          :src="require('../assets/logo.png')"
          class="plm-logo ion-margin-start ion-margin-top ion-margin-end"
        ></ion-img>
        <ion-buttons slot="end">
          <ion-button color="secondary">
            <ion-icon
              :icon="logOutOutline"
              slot="end"
              class="logoIcon"
              @click="logout"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </div>
      <div class="cover ion-margin-start ion-margin-end">
        <ion-text>
          <h1 class="content-title">
            <strong>{{ title }}</strong>
          </h1>
          <h4 class="content-subtitle">{{ name }}</h4>
        </ion-text>
        <!-- <ion-img :src="require('@/assets/plm template.png')"></ion-img> -->
        <ion-img :src="require('@/assets/plm template white bg.png')"></ion-img>
      </div>
      <ion-list>
        <ion-item v-for="module in modules" :key="`module-${module.id}`">
          <ion-label class="ion-text-wrap">
            <ion-text color="primary">
              <h1>
                <strong>{{ module.title }}</strong>
              </h1>
              <template
                v-for="question in module.questions"
                :key="`question-${question.id}`"
              >
                <template v-if="question.show_in_leader_guide">
                  <p>
                    <strong>{{ question.title }}</strong>
                  </p>

                  <div class="wheel" v-if="question.section_type === SectionTypes.Wheel">
                    <ion-img :src="question.content[0].content" :alt="question.title">
                    </ion-img>
                  </div>

                  <!-- Add Behavior Section -->

                  <template v-else-if="question.answer">
                    <ion-text>
                      <!-- Text Short -->
                      <p v-if="question.type === QuestionTypes.TextShort">
                        <em v-if="!isEmpty(question.answer.edited_payload)">
                          {{ question.answer.edited_payload }}
                        </em>
                        <em v-else>{{ question.answer.payload }}</em>
                      </p>

                      <!-- Text Paragraph and Text box -->
                      <template
                        v-else-if="
                          question.type === QuestionTypes.TextParagraph ||
                            question.type === QuestionTypes.TextBox
                        "
                      >
                        <template v-if="!isEmpty(question.answer.edited_payload)">
                          <div
                            v-if="
                              formatParagraphs(question.answer.edited_payload).length > 0
                            "
                            class="paragraphs"
                          >
                            <p
                              v-for="(s, si) in formatParagraphs(
                                question.answer.edited_payload
                              )"
                              :key="`s${si}`"
                            >
                              {{ s }}
                            </p>
                          </div>
                          <em class="text-light-gray" v-else>No Answer</em>
                        </template>

                        <template v-else-if="!isEmpty(question.answer.payload)">
                          <div
                            v-if="formatParagraphs(question.answer.payload).length > 0"
                            class="paragraphs"
                          >
                            <p
                              v-for="(s, si) in formatParagraphs(question.answer.payload)"
                              :key="`s${si}`"
                            >
                              {{ s }}
                            </p>
                          </div>
                          <em class="text-light-gray" v-else>No Answer</em>
                        </template>
                      </template>
                    </ion-text>
                  </template>

                  <ion-note class="secodary">
                    {{ question.answer }}
                  </ion-note>
                  <br />
                </template>
              </template>
            </ion-text>
          </ion-label>
        </ion-item>

        <!-- Multigraph -->
        <ion-list>
          <template
            v-for="(mgraph, mgraphkey) in sortedMultigraph"
            :key="`content${mgraphkey}`"
          >
            <!-- Disc Chart -->
            <template v-if="Object.keys(mgraph) == sortedKeys[0]">
              <div class="discChart-layout">
                <DiscChart
                  v-for="(d, dIndex) in mgraph[sortedKeys[mgraphkey]]"
                  :key="`content${dIndex}`"
                  :discChart="d"
                  :number="dIndex + 1"
                />
              </div>
            </template>
            <!-- Wheel and Dimensional Balance -->
            <template
              v-if="
                Object.keys(mgraph) == sortedKeys[1] ||
                  Object.keys(mgraph) == sortedKeys[4]
              "
            >
              <ion-img
                class="graph"
                v-for="(d, dIndex) in mgraph[sortedKeys[mgraphkey]]"
                :key="`content${dIndex}`"
                :src="d.content"
                :height="d.metadata.height"
                :width="d.metadata.width"
              />
            </template>
            <!-- Driving forces norms and comparison (areas for awareness), Driving forces graph, Competencies by mean (dev indicator) -->
            <template
              v-if="
                Object.keys(mgraph) == sortedKeys[2] ||
                  Object.keys(mgraph) == sortedKeys[3] ||
                  Object.keys(mgraph) == sortedKeys[5]
              "
            >
              <ion-img
                class="graph"
                :src="mgraph[sortedKeys[mgraphkey]].content"
                :alt="mgraph[sortedKeys[mgraphkey]].name"
              />
            </template>
          </template>
        </ion-list>
      </ion-list>
    </div>
  </base-layout>
</template>

<script>
import { defineComponent } from 'vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import lodash from 'lodash';
import { mapActions } from 'vuex';
import { QuestionTypes, SectionTypes } from '@/models';
import store from '@/store';
import { logOutOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'LeaderManual',
  components: {
    BaseLayout,
  },
  data() {
    return {
      modules: [],
      hasAnswers: false,
      loading: true,
      QuestionTypes: QuestionTypes,
      SectionTypes: SectionTypes,
      multigraph: {},
      sortedKeys: [],
      sortedMultigraph: [],
      title: 'Personalized Leader Manual',
      logOutOutline,
    };
  },
  methods: {
    ...mapActions(['buildLeaderManual', 'patchAnswer', 'fetchMultigraph', 'getStudent']),
    formatParagraphs(longString) {
      // string copy to prevent infinite loop issues for some reason
      const split = `${longString}`.split('\n\n');
      if (split[0].length > 0) return split;
      return [];
    },
    formatEditedAnswer(editedAnswer) {
      let isArray = Array.isArray(editedAnswer);
      // string copy to prevent infinite loop issues for some reason
      const split = isArray ? editedAnswer : `${editedAnswer}`.split('\n');
      if (split[0].length > 0) return split;
      return [];
    },
    /**
     * Type 1: hide from Web
     * Type 2: hide from print
     */
    hideModule(module, type = 1) {
      if (module.questions) {
        let answers = module.questions.filter((q) => {
          if (type === 1) return q.has_answers;
          else if (type === 2) return q.show_in_leader_guide && q.has_answers;
        });
        return answers.length < 1;
      }
      return true;
    },
    isEmpty(obj) {
      return obj === null || lodash.isEmpty(obj);
    },
    updateAnswer(event, prevAnswer, questionType) {
      let payload = event.srcElement.innerText;
      if (questionType === QuestionTypes.SelectionMultiple) {
        payload = payload.split('\n');
      }

      // check if payload changed
      // fails for answer payloads with sets of only one '\n'
      if (payload === prevAnswer.payload || payload === prevAnswer.edited_payload) {
        return;
      }

      const model = {
        answerId: prevAnswer.id,
        payload,
      };

      this.patchAnswer(model);
    },
    sortMultigraph() {
      const mgraph = this.multigraph;
      const mgraphArr = this.sortedMultigraph;
      const key = this.sortedKeys;

      // Order
      // 1 disc graph
      mgraphArr.push({ disc_chart: mgraph[key[0]] });
      // 2. disc wheel
      mgraphArr.push({ wheel: mgraph[key[1]] });
      // 3. driving forces graph
      mgraphArr.push({ driving_forces: mgraph[key[2]] });
      // 4. driving forces norms and comparison (areas for awareness)
      mgraphArr.push({ areas: mgraph[key[3]] });
      // 5. dimensional balance
      mgraphArr.push({ dimensional_balance: mgraph[key[4]] });
      // 6. competencies by mean (dev indicator)
      mgraphArr.push({ development_indicator: mgraph[key[5]] });
    },
    logout() {
      console.log('heey');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.buildLeaderManual().then((modules) => {
      this.loading = false;
      this.modules = modules;

      modules.forEach((m) =>
        m.questions.forEach((q) => {
          if (q.show_in_leader_guide && q.answer) this.hasAnswers = true;
        })
      );
    });
    this.fetchMultigraph().then((multigraph) => {
      this.multigraph = multigraph;
      this.sortedKeys = [
        'disc_chart',
        'wheel',
        'driving_forces',
        'areas',
        'dimensional_balance',
        'development_indicator',
      ];
      this.sortMultigraph();
    });
    store
      .dispatch('checkStorageForStudent')
      .then((student) => {
        const isAuthenticated = !!student;
        if (isAuthenticated) this.name = student.name;
        else console.log('unauthorized');
      })
      .catch(() => console.log('err'));
  },
});
</script>

<style scoped>
.cover {
  height: 100vh;
  /* background: rgb(222, 229, 227);
  background: linear-gradient(
    260deg,
    rgba(222, 229, 227, 1) 0%,
    rgba(222, 229, 227, 1) 35%,
    rgba(255, 255, 255, 1) 100%
  ); */
}

.cover ion-img {
  position: absolute;
  bottom: 0px;
  right: -5%;
  width: 80%;
  /* width: 90%; */
  /* margin-top: 50%; */
}

.plm-logo {
  width: 50vw;
}

.plm-top-container {
  display: flex;
  justify-content: space-between;
}
/* #container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
} */
</style>
