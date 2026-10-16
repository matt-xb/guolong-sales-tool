const labels = ['正在连接共享目录…', '正在下载数据库…', '正在同步产品图片…', '正在同步资料文件…', '正在校验资料…', '正在应用更新…', '刷新完成，正在重新打开软件…'];
const program = new URLSearchParams(location.search).get('mode') === 'program';
if (program) {
  document.title = '升级销售工具';
  document.querySelector('h1').textContent = '升级销售工具';
  labels[1] = '正在比对并下载程序文件…';
  document.querySelectorAll('ol li')[1].textContent = '程序与数据';
}
window.refreshAPI.onProgress((state) => {
  document.querySelector('#status').textContent = state.error ? (program ? '程序升级未完成' : '资料刷新未完成') : labels[state.step] || labels[0];
  document.querySelectorAll('ol li').forEach((item, index) => {
    item.classList.toggle('done', index < state.step);
    item.classList.toggle('active', index === state.step);
  });
  const progress = document.querySelector('progress');
  if (state.error) { progress.max = 1; progress.value = 0; }
  else if (state.total > 0) { progress.max = state.total; progress.value = state.current; }
  else progress.removeAttribute('value');
  document.querySelector('#detail').textContent = state.detail || '';
  document.querySelector('#count').textContent = state.total > 0 ? `${state.current} / ${state.total} 个文件` : '';
  if (state.downloaded !== undefined) document.querySelector('#transfer').textContent = `已下载 ${state.downloaded} 个文件（${(state.downloadedBytes / 1048576).toFixed(2)} MB），本机复用 ${state.reused} 个文件`;
  const error = document.querySelector('#error');
  error.hidden = !state.error;
  error.textContent = state.error || '';
  const button = document.querySelector('#return');
  button.hidden = !state.error;
  button.textContent = state.recoveryRequired ? '关闭软件' : '返回软件';
});
document.querySelector('#return').addEventListener('click', () => window.refreshAPI.returnToApp());
