function productImagePaths(item) {
  const photos = Array.isArray(item.documents?.photos) ? item.documents.photos : [];
  return [...new Set([item.image_path, ...photos].filter((value) => typeof value === 'string' && value.trim()))];
}

function productImageGroupKey(item) {
  return JSON.stringify([item.type, item.category || '', item.name]);
}

function productImageFolder(item = {}) {
  const clean = (value) => {
    const name = String(value || '').trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, '').slice(0, 80).replace(/[. ]+$/g, '');
    return /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name) ? `_${name}` : name;
  };
  const type = item.type === 'equipment' ? 'equipment' : item.type === 'part' ? 'parts' : '';
  if (!type) return '';
  const category = clean(item.category);
  let name = String(item.name || '').trim();
  if (type === 'parts') {
    const family = name.match(/(控制器|接触器|减速机|热电偶|高温线|轴承|压力表|万向节|安全阀|空气滤芯|内胆|O型圈)$/i);
    name = family ? family[1] : name
      .replace(/^(?:\d+(?:\.\d+)?\s*(?:kW|mm|L|W|²)?\s*[/、]?\s*)+/i, '')
      .replace(/\s*\d+(?:\.\d+)?\s*(?:kW|mm|W)(?:\/\d+(?:\.\d+)?\s*(?:kW|mm|W))*$/i, '');
  }
  return [type, ...(type === 'equipment' ? [category] : []), clean(name)].filter(Boolean).join('/');
}

function editProductImages(item, action, imagePath, added = []) {
  const photos = productImagePaths(item).filter((value) => value !== item.image_path);
  let main = item.image_path || '';
  if (action === 'add') photos.push(...added);
  else {
    if (!productImagePaths(item).includes(imagePath)) throw new Error('图片已变更，请重新打开详情页。');
    if (action !== 'replace' && action !== 'remove') throw new Error('无效的图片操作。');
    if (action === 'replace' && added.length !== 1) throw new Error('请选择一张替换图片。');
    if (imagePath === main) main = action === 'replace' ? added[0] : '';
    else photos.splice(photos.indexOf(imagePath), 1, ...(action === 'replace' ? added : []));
  }
  return { image_path: main, photos: [...new Set(photos)].filter((value) => value !== main) };
}

module.exports = { productImagePaths, productImageGroupKey, productImageFolder, editProductImages };
