import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// Element Plus 暗色模式变量（配合 html.dark class，见 src/theme）
import 'element-plus/theme-chalk/dark/css-vars.css';
import {
  Brush,
  Expand,
  Fold,
  Grid,
  HomeFilled,
  Lock,
  Menu,
  Moon,
  Postcard,
  School,
  Sunny,
  SwitchButton,
} from '@element-plus/icons-vue';
import './styles/index.css';
// 设计令牌：主色板 / 语义变量 / 布局预设皮肤（须在样式之后引入以覆盖默认）
import './theme/tokens.css';
import { permissionDirective } from './directives/permission';

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.directive('permission', permissionDirective);
for (const component of [
  Brush,
  Expand,
  Fold,
  Grid,
  HomeFilled,
  Lock,
  Menu,
  Moon,
  Postcard,
  School,
  Sunny,
  SwitchButton,
]) {
  app.component(component.name!, component);
}
app.mount('#app');
