htmx.on('#imageInput', 'change', function (evt) {
  if (evt.target.files[0].size > 1048576) {
    alert('Please upload images under 1MB');
    htmx.find('#imageInput').value = '';
    return;
  }

  htmx.find('#preview').setAttribute('src', URL.createObjectURL(evt.target.files[0]));
});
