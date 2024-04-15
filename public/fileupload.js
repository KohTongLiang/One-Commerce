htmx.on('#form', 'htmx:xhr:progress', function (evt) {
  htmx.find('#progress').setAttribute('value', (evt.detail.loaded / evt.detail.total) * 100);
  htmx.find('#imageInput').value = '';
});

htmx.on('#imageInput', 'change', function (evt) {
  if (evt.target.files[0].size > 1048576) {
    alert('Please upload images under 1MB');
    htmx.find('#imageInput').value = '';
    return;
  }

  htmx.find('#preview').setAttribute('src', URL.createObjectURL(evt.target.files[0]));
});
