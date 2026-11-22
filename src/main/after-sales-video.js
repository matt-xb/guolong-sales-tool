function buildAfterSalesVideoUrl(baseUrl, deviceName) {
  if (typeof baseUrl !== 'string' || !baseUrl.trim()) {
    throw new Error('未配置互联网售后视频库，请设置 SALES_VIDEO_URL 或公司版 videoUrl。');
  }
  let url;
  try { url = new URL(baseUrl); } catch { throw new Error('售后视频库地址无效，必须使用不含账号密码的 HTTPS 地址。'); }
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) {
    throw new Error('售后视频库地址无效，必须使用不含账号密码的 HTTPS 地址。');
  }
  for (const key of ['category', 'subcategory', 'device']) url.searchParams.delete(key);
  url.hash = '';
  if (deviceName !== undefined) {
    if (typeof deviceName !== 'string' || !deviceName.trim()) throw new Error('设备名称为空，无法定位售后视频。');
    url.searchParams.set('device', deviceName.trim());
  }
  return url.href;
}

module.exports = { buildAfterSalesVideoUrl };
