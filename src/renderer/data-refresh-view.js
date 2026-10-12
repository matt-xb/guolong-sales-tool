const labels = ['正在连接共享目录…', '正在下载数据库…', '正在同步产品图片…', '正在同步资料文件…', '正在校验资料…', '正在应用更新…', '刷新完成，正在重新打开软件…'];
window.refreshAPI.onProgress((state) => {
  document.querySelector('#status').textContent = state.error ? '资料刷新未完成' : labels[state.step] || labels[0];
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
  const error = document.querySelector('#error');
  error.hidden = !state.error;
  error.textContent = state.error || '';
  const button = document.querySelector('#return');
  button.hidden = !state.error;
  button.textContent = state.recoveryRequired ? '关闭软件' : '返回软件';
});
document.querySelector('#return').addEventListener('click', () => window.refreshAPI.returnToApp());
