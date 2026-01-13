document.addEventListener('DOMContentLoaded', function() {
  M.updateTextFields();
});

document.getElementById('profile_avatar').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('avatar-preview');
      if (preview.tagName === 'IMG') {
        preview.src = e.target.result;
      } else {
        preview.outerHTML = '<img id="avatar-preview" src="' + e.target.result + '" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #33b5e5;">';
      }
    }
    reader.readAsDataURL(file);
  }
});