function productImagePaths(item) {
  const photos = Array.isArray(item.documents?.photos) ? item.documents.photos : [];
  return [...new Set([item.image_path, ...photos].filter((value) => typeof value === 'string' && value.trim()))];
}

function productImageGroupKey(item) {
  return JSON.stringify([item.type, item.category || '', item.name]);
}

function productImageFolder(item = {}) {
  const clean = (value) => String(value || '').trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/[. ]+$/g, '').slice(0, 80);
  const type = item.type === 'equipment' ? 'equipment' : item.type === 'part' ? 'parts' : '';
  if (!type) return '';
  const category = clean(item.category);
  return [type, category, ...(type === 'equipment' && category ? [clean(item.name)] : [])].filter(Boolean).join('/');
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
