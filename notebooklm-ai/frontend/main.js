const BASE_URL = "http://localhost:3001/api";
axios.defaults.baseURL = BASE_URL;

// Sidebar component
const Sidebar = {
  template: `
    <div class="sidebar">
      <div class="panel-title">Documents</div>
      <div class="row" style="margin-bottom:12px;">
        <input type="file" ref="file"/>
        <button class="btn" @click="uploadDocument">上传</button>
      </div>
      <div>
        <div v-for="doc in documents" :key="doc.id" :class="['doc-item', selectedDoc?.id===doc.id?'active':'']" @click="$emit('select-document', doc)">
          <div style="font-weight:600;">{{ doc.title }}</div>
          <div style="font-size:12px;color:var(--color-text-secondary)">#{{ doc.id }} • {{ doc.type }}</div>
        </div>
      </div>
    </div>
  `,
  props: ["documents", "selectedDoc"],
  methods: {
    async uploadDocument() {
      const file = this.$el.querySelector('input[type=file]').files[0];
      if (!file) return alert('请选择文件');
      const fd = new FormData();
      fd.append('file', file);
      try {
        const { data } = await axios.post('/docs/upload', fd);
        if (data.success) {
          this.$emit('uploaded');
          alert('上传成功，doc_id=' + data.doc_id);
        } else {
          alert('上传失败: ' + data.message);
        }
      } catch (e) {
        alert('上传异常: ' + e.message);
      }
    },
  },
};

// DocumentViewer component
const DocumentViewer = {
  template: `
    <div class="viewer" v-if="document">
      <div class="panel-title">{{ document.title }}</div>
      <div class="actions">
        <button class="btn" @click="gen('summary')">摘要</button>
        <button class="btn" @click="gen('audio')">音频</button>
        <button class="btn" @click="gen('video')">视频脚本</button>
        <button class="btn" @click="gen('mindmap')">思维导图</button>
        <button class="btn" @click="gen('flashcards')">闪卡</button>
        <button class="btn" @click="gen('quiz')">测验</button>
        <button class="btn" @click="gen('ppt')">PPT</button>
        <button class="btn secondary" @click="embed()">向量化</button>
      </div>
      <div class="content">{{ document.content }}</div>

      <div style="margin-top:12px;" v-if="result">
        <div v-if="result.summary"><h4>摘要</h4><div class="content">{{ result.summary }}</div></div>
        <div v-if="result.audioBase64"><h4>音频</h4><audio :src="'data:audio/mpeg;base64,'+result.audioBase64" controls></audio></div>
        <div v-if="result.video"><h4>视频脚本</h4><pre class="pre">{{ JSON.stringify(result.video, null, 2) }}</pre></div>
        <div v-if="result.mindmap"><h4>思维导图</h4><pre class="pre">{{ JSON.stringify(result.mindmap, null, 2) }}</pre></div>
        <div v-if="result.flashcards"><h4>闪卡</h4><pre class="pre">{{ JSON.stringify(result.flashcards, null, 2) }}</pre></div>
        <div v-if="result.quiz"><h4>测验</h4><pre class="pre">{{ JSON.stringify(result.quiz, null, 2) }}</pre></div>
        <div v-if="result.ppt"><h4>PPT</h4><pre class="pre">{{ JSON.stringify(result.ppt, null, 2) }}</pre></div>
      </div>
    </div>
    <div v-else class="viewer"><div class="panel-title">请选择左侧文档</div></div>
  `,
  props: ["document"],
  data() {
    return { result: null };
  },
  methods: {
    async gen(kind) {
      const map = {
        summary: '/generate/summary',
        audio: '/generate/audio',
        video: '/generate/video',
        mindmap: '/generate/mindmap',
        flashcards: '/generate/flashcards',
        quiz: '/generate/quiz',
        ppt: '/generate/ppt',
      };
      try {
        const { data } = await axios.post(map[kind], { content: this.document.content });
        if (!data.success) return alert('生成失败: ' + (data.message || ''));
        this.result = data;
      } catch (e) {
        alert('请求失败: ' + e.message);
      }
    },
    async embed() {
      try {
        const { data } = await axios.post(`/embed/${this.document.id}`);
        if (data.success) alert('向量化完成：chunks=' + data.chunks);
        else alert('向量化失败: ' + (data.message || ''));
      } catch (e) {
        alert('向量化异常: ' + e.message);
      }
    }
  },
};

// ChatPanel component
const ChatPanel = {
  template: `
    <div class="chat-panel">
      <div class="panel-title" style="padding: 16px;">Chat</div>
      <div class="messages" ref="list">
        <div v-for="m in messages" :key="m.id" :class="['msg', m.role]">
          <div class="role">{{ m.role }}</div>
          <div class="bubble">{{ m.content }}</div>
          <div class="citations" v-if="m.citations && m.citations.length">
            引用：
            <div v-for="(c, idx) in m.citations" :key="idx">[{{ idx+1 }}] doc {{ c.doc_id }} #{{ c.paragraph_index }}</div>
          </div>
        </div>
      </div>
      <div class="input-box">
        <div class="row">
          <input class="input" v-model="input" placeholder="输入你的问题..." @keyup.enter="send" />
          <button class="btn" @click="send">发送</button>
        </div>
      </div>
    </div>
  `,
  props: ["messages"],
  data() { return { input: "" }; },
  methods: {
    async send() {
      const text = this.input.trim();
      if (!text) return;
      const userMsg = { id: Date.now()+":u", role: 'user', content: text };
      this.$emit('push-message', userMsg);
      this.input = '';
      try {
        const history = this.messages.map(({ role, content }) => ({ role, content }));
        const { data } = await axios.post('/chat', { query: text, top_k: 5, history });
        const asMsg = { id: Date.now()+":a", role: 'assistant', content: data.answer || '', citations: data.citations || [] };
        this.$emit('push-message', asMsg);
        this.$nextTick(() => {
          this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
        });
      } catch (e) {
        alert('聊天失败: ' + e.message);
      }
    }
  }
};

const app = Vue.createApp({
  data() {
    return {
      documents: [],
      selectedDoc: null,
      chatMessages: [],
    };
  },
  components: { Sidebar, DocumentViewer, ChatPanel },
  template: `
    <div id="layout" style="display:flex; width:100%; height:100%;">
      <Sidebar :documents="documents" :selectedDoc="selectedDoc" @uploaded="fetchDocuments" @select-document="onSelectDoc" />
      <DocumentViewer :document="selectedDoc" />
      <ChatPanel :messages="chatMessages" @push-message="pushMessage" />
    </div>
  `,
  mounted() { this.fetchDocuments(); },
  methods: {
    async fetchDocuments() {
      try {
        const { data } = await axios.get('/docs/list');
        this.documents = data.documents || [];
        if (this.documents.length && !this.selectedDoc) {
          this.onSelectDoc(this.documents[0]);
        }
      } catch (e) {
        console.warn('获取文档失败', e.message);
      }
    },
    async onSelectDoc(doc) {
      try {
        const { data } = await axios.get(`/docs/${doc.id}`);
        if (data.success) this.selectedDoc = data.document;
      } catch (e) {
        console.warn('获取文档详情失败', e.message);
      }
    },
    pushMessage(m) { this.chatMessages.push(m); }
  }
});

app.mount('#app');

