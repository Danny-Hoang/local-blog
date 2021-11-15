const {writeFileSync} = require('fs');
const {
  getIconForPath,
  ICON_SIZE_MEDIUM
} = require('system-icon');

getIconForPath("D:/CV_-_hoang_ngoc_thai.pdf", ICON_SIZE_MEDIUM, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    writeFileSync("icon.png", result);
  }
});