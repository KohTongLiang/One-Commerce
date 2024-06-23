htmx.on('#imageInput', 'change', async function (evt) {
  const imageFile = evt.target.files[0];
  if (
    imageFile.type !== 'image/webp' &&
    imageFile.type !== 'image/jpeg' &&
    imageFile.type !== 'image/jpg' &&
    imageFile.type !== 'image/png'
  ) {
    alert('Only jpeg, webp, or png files are allowed');
  } else {
    await handleImageUpload(evt);
  }
});

async function handleImageUpload(event) {
  const imageFile = event.target.files[0];

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);
    const dataTransfer = new DataTransfer();
    const newFile = new File([compressedFile], imageFile.name, {
      type: imageFile.type,
    });

    dataTransfer.items.add(newFile);
    event.target.files = dataTransfer.files;

    htmx.find('#preview').setAttribute('src', URL.createObjectURL(compressedFile));
  } catch (error) {
    console.log(error);
  }
}
