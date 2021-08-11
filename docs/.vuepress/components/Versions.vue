<template>
  <span class="nav-item" v-if="options && options.length > 0">
    Version:
    <select v-model="selected" @change="onChange">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </span>
</template>

<script>
// https://github.com/bcgov/NotifyBC/blob/main/docs/.vuepress/components/versions.vue
import Axios from 'axios';

export default {
  name: 'Versions',

  data() {
    return {
      selected: undefined,
      options: [],
      versionPath: 'version',
    };
  },

  computed: {
    basePath() {
      return this.$site && this.$site.base;
    },
    repo() {
      return this.$site.themeConfig.repo;
    },
    githubToken() {
      return this.$site.themeConfig.githubToken;
    },
  },

  created: async function () {
    try {
      let data = await this.githubRequest(`https://api.github.com/repos/${this.repo}/git/trees/gh-pages`);
      const versionNode = data.tree.find((e) => e.path.toLowerCase() === 'version');
      data = await this.githubRequest(versionNode.url);
      this.setOptions(data);
      const path = window.location.pathname.toLowerCase();
      const versionPath = `${this.basePath}${this.versionPath}/`;
      if (path.startsWith(versionPath)) {
        const start = versionPath.length;
        const end = path.indexOf('/', start);
        this.selected = path.substring(start, end);
      } else {
        this.selected = 'main';
      }
    } catch (ex) {}
  },

  methods: {
    githubRequest(url) {
      const axiosConfig = {
        responseType: 'json',
        headers: {
          accept: 'application/vnd.github.v3+json',
        },
      };

      // if (this.githubToken) {
      //   axiosConfig.headers.authorization = `Bearer ${this.githubToken}`;
      // }
      return Axios.get(url, axiosConfig).then((res) => res.data);
    },

    onChange() {
      const targetVersionPath = this.selected === 'main' ? '' : `/${this.versionPath}/${this.selected}`;
      const currentPathName = window.location.pathname;
      const path = currentPathName.toLowerCase();
      const basePath = this.basePath.slice(0, -1);
      let startIdx = basePath.length;
      const version = `/${this.versionPath}/`;
      const versionIdx = path.indexOf(version);
      if (versionIdx >= 0) {
        startIdx = versionIdx + version.length;
      }
      const endIdx = path.indexOf('/', startIdx);
      const newPathName =
        currentPathName.substring(0, basePath.length) + targetVersionPath + currentPathName.substring(endIdx);
      window.location.pathname = newPathName;
    },

    setOptions(versionNodeData) {
      this.options = versionNodeData.tree
        .map((e) => ({ value: e.path, text: e.path }))
        .sort((e1, e2) => {
          const e1Arr = e1.text.split('.');
          const e2Arr = e2.text.split('.');
          for (let i = 0; i < e1Arr.length && i < e2Arr.length; i++) {
            const e1V = parseInt(e1Arr[i]);
            const e2V = parseInt(e2Arr[i]);
            if (e1V !== e2V) return e2V - e1V;
            if (e1Arr[i] !== e2Arr[i]) return e2Arr[i] - e1Arr[i];
          }
          return e1.text === e2.text ? 0 : e2.text < e1.text ? -1 : 1;
        });
      this.options.unshift({ value: 'main', text: 'main' });
    },
  },
};
</script>
