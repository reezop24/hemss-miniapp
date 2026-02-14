document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.hemss-brand')) {
    return;
  }

  const body = document.body;
  if (!body) {
    return;
  }

  const brand = document.createElement('div');
  brand.className = 'hemss-brand';
  brand.innerHTML = [
    '<img src="logo.png" alt="Logo Sekolah" class="hemss-logo">',
    '<div class="hemss-title">Unit HEMSS</div>'
  ].join('');

  const firstHeading = body.querySelector('h2');
  if (firstHeading) {
    body.insertBefore(brand, firstHeading);
  } else {
    body.insertBefore(brand, body.firstChild);
  }
});
